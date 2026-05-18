import mongoose from 'mongoose';
import { AppError } from './AppError.js';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function assertValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid expense id', 400);
  }
}

/**
 * Builds a MongoDB filter from query string (search & filters for list).
 */
export function buildExpenseFilter(query) {
  const filter = {};

  if (query.category) {
    filter.category = new RegExp(`^${escapeRegex(query.category)}$`, 'i');
  }

  if (query.merchant) {
    filter.merchant = new RegExp(escapeRegex(query.merchant), 'i');
  }

  if (query.date) {
    const day = new Date(query.date);
    if (Number.isNaN(day.getTime())) {
      throw new AppError('Invalid date query (use YYYY-MM-DD)', 400);
    }
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  } else if (query.dateFrom || query.dateTo) {
    filter.date = {};
    if (query.dateFrom) {
      const from = new Date(query.dateFrom);
      if (Number.isNaN(from.getTime())) {
        throw new AppError('Invalid dateFrom (use YYYY-MM-DD)', 400);
      }
      filter.date.$gte = from;
    }
    if (query.dateTo) {
      const to = new Date(query.dateTo);
      if (Number.isNaN(to.getTime())) {
        throw new AppError('Invalid dateTo (use YYYY-MM-DD)', 400);
      }
      to.setHours(23, 59, 59, 999);
      filter.date.$lte = to;
    }
  }

  if (query.amount !== undefined && query.amount !== '') {
    const amount = Number(query.amount);
    if (Number.isNaN(amount)) {
      throw new AppError('Invalid amount query', 400);
    }
    filter.amount = amount;
  } else if (query.minAmount !== undefined || query.maxAmount !== undefined) {
    filter.amount = {};
    if (query.minAmount !== undefined && query.minAmount !== '') {
      const min = Number(query.minAmount);
      if (Number.isNaN(min)) {
        throw new AppError('Invalid minAmount', 400);
      }
      filter.amount.$gte = min;
    }
    if (query.maxAmount !== undefined && query.maxAmount !== '') {
      const max = Number(query.maxAmount);
      if (Number.isNaN(max)) {
        throw new AppError('Invalid maxAmount', 400);
      }
      filter.amount.$lte = max;
    }
  }

  return filter;
}

const UPDATABLE_FIELDS = [
  'merchant',
  'amount',
  'date',
  'items',
  'category',
  'tax',
  'paymentMethod',
  'rawText',
  'aiSummary',
];

/**
 * Picks and validates fields allowed on PUT /expenses/:id
 */
export function buildUpdatePayload(body) {
  const update = {};

  for (const key of UPDATABLE_FIELDS) {
    if (body[key] === undefined) continue;

    switch (key) {
      case 'amount':
      case 'tax': {
        const num = Number(body[key]);
        if (Number.isNaN(num)) {
          throw new AppError(`${key} must be a number`, 400);
        }
        update[key] = num;
        break;
      }
      case 'date': {
        if (body[key] === null || body[key] === '') {
          update.date = null;
          break;
        }
        const d = new Date(body[key]);
        if (Number.isNaN(d.getTime())) {
          throw new AppError('date must be a valid date', 400);
        }
        update.date = d;
        break;
      }
      case 'items': {
        if (!Array.isArray(body.items)) {
          throw new AppError('items must be an array', 400);
        }
        update.items = body.items.map((item) => ({
          name: String(item?.name ?? ''),
          quantity: Number(item?.quantity) || 1,
          unitPrice:
            item?.unitPrice != null ? Number(item.unitPrice) : null,
          lineTotal:
            item?.lineTotal != null ? Number(item.lineTotal) : null,
        }));
        break;
      }
      default:
        update[key] = String(body[key]).trim();
    }
  }

  if (Object.keys(update).length === 0) {
    throw new AppError('No valid fields provided to update', 400);
  }

  return update;
}
