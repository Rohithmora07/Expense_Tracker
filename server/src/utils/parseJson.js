/**
 * Parses JSON from Gemini text (handles optional ```json fences).
 */
export function parseJsonFromText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty AI response');
  }

  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  return JSON.parse(cleaned);
}
