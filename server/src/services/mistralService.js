import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Mistral } from '@mistralai/mistralai';

import { AppError } from '../utils/AppError.js';

const EXTRACTION_PROMPT = `
You are a receipt and expense document analyzer.

IMPORTANT RULES:
- Return ONLY valid JSON.
- No markdown.
- No explanation.
- Escape all quotes properly.
- Do not include raw line breaks, tabs, or control characters inside JSON strings.
- Keep rawText as a single plain text line.

Return JSON in this exact structure:

{
  "merchant": "store or merchant name",
  "amount": 0.00,
  "date": "YYYY-MM-DD or null",
  "items": [
    {
      "name": "item name",
      "quantity": 1,
      "unitPrice": null,
      "lineTotal": null
    }
  ],
  "tax": null,
  "paymentMethod": "cash|card|upi|wallet|bank|other|unknown",
  "category": "Food|Transport|Shopping|Utilities|Health|Entertainment|Travel|Education|Groceries|Subscriptions|Other",
  "rawText": "single line OCR text",
  "aiSummary": "short summary"
}
`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEBUG_LOG_PATH = path.join(
  __dirname,
  '../../../debug-ef0c8d.log'
);

function debugLog(location, message, data = {}) {
  const payload = {
    location,
    message,
    data,
    timestamp: Date.now(),
  };

  try {
    fs.appendFileSync(
      DEBUG_LOG_PATH,
      `${JSON.stringify(payload)}\n`
    );
  } catch {
    // ignore logging errors
  }
}

function getClient() {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new AppError(
      'MISTRAL_API_KEY is missing in server/.env',
      500
    );
  }

  return new Mistral({ apiKey });
}

function cleanJsonText(text) {
  return (
    text
      // remove markdown code blocks
      .replace(/```json/gi, '')
      .replace(/```/g, '')

      // remove control chars
      .replace(/[\u0000-\u001F]+/g, ' ')

      // normalize whitespace
      .replace(/\r/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')

      // collapse spaces
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function extractJson(text) {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('No valid JSON object found');
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    debugLog(
      'safeJsonParse',
      'Initial JSON parse failed',
      {
        error: err.message,
      }
    );

    // attempt repair
    const repaired = text
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/\\/g, '\\\\');

    return JSON.parse(repaired);
  }
}

function normalizeExtraction(data) {
  const parsedDate = data?.date
    ? new Date(data.date)
    : null;

  const validDate =
    parsedDate &&
    !Number.isNaN(parsedDate.getTime())
      ? parsedDate
      : null;

  const items = Array.isArray(data?.items)
    ? data.items.map((item) => ({
        name: String(item?.name ?? '').trim(),
        quantity: Number(item?.quantity) || 1,
        unitPrice:
          item?.unitPrice != null
            ? Number(item.unitPrice)
            : null,
        lineTotal:
          item?.lineTotal != null
            ? Number(item.lineTotal)
            : null,
      }))
    : [];

  return {
    merchant: String(
      data?.merchant ?? ''
    ).trim(),

    amount:
      data?.amount != null
        ? Number(data.amount)
        : null,

    date: validDate,

    items,

    tax:
      data?.tax != null
        ? Number(data.tax)
        : null,

    paymentMethod: String(
      data?.paymentMethod ?? 'unknown'
    ).trim(),

    category:
      String(data?.category ?? 'Other').trim() ||
      'Other',

    rawText: String(
      data?.rawText ?? ''
    )
      .replace(/\s+/g, ' ')
      .trim(),

    aiSummary: String(
      data?.aiSummary ?? ''
    ).trim(),
  };
}

export async function extractExpenseFromImage(
  filePath,
  mimeType
) {
  try {
    const client = getClient();

    const buffer = fs.readFileSync(filePath);

    const base64 = buffer.toString('base64');

    debugLog(
      'mistralService:start',
      'Starting extraction',
      {
        filePath,
        mimeType,
      }
    );

    const response =
      await client.chat.complete({
        model:
          process.env.MISTRAL_MODEL ||
          'pixtral-12b',

        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: EXTRACTION_PROMPT,
              },
              {
                type: 'image_url',
                imageUrl: `data:${
                  mimeType || 'image/jpeg'
                };base64,${base64}`,
              },
            ],
          },
        ],
      });

    const rawText =
      response?.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error('Empty AI response');
    }

    debugLog(
      'mistralService:raw',
      'Received raw response',
      {
        length: rawText.length,
      }
    );

    const cleaned = cleanJsonText(rawText);

    const jsonString = extractJson(cleaned);

    const parsed = safeJsonParse(jsonString);

    const normalized =
      normalizeExtraction(parsed);

    debugLog(
      'mistralService:success',
      'Extraction successful',
      {
        merchant: normalized.merchant,
        amount: normalized.amount,
      }
    );

    return normalized;
  } catch (err) {
    debugLog(
      'mistralService:error',
      'Extraction failed',
      {
        error: String(err?.message || err),
      }
    );

    throw new AppError(
      `Mistral analysis failed: ${
        err?.message || 'Unknown error'
      }`,
      502
    );
  }
}