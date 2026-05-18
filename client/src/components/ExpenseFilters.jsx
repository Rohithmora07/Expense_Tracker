import { CATEGORIES } from '../utils/format.js';

const EMPTY = {
  category: '',
  merchant: '',
  date: '',
  dateFrom: '',
  dateTo: '',
  amount: '',
  minAmount: '',
  maxAmount: '',
};

export default function ExpenseFilters({ filters, onChange, onApply, onReset }) {
  function updateField(name, value) {
    onChange({ ...filters, [name]: value });
  }

  return (
    <section className="card filters-panel">
      <h2 style={{ margin: 0, fontSize: '1rem' }}>Search & filters</h2>
      <div className="filters-grid">
        <label>
          Category
          <select
            value={filters.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Merchant
          <input
            type="text"
            placeholder="Store name"
            value={filters.merchant}
            onChange={(e) => updateField('merchant', e.target.value)}
          />
        </label>
        <label>
          Date (exact)
          <input
            type="date"
            value={filters.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
        </label>
        <label>
          From
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateField('dateFrom', e.target.value)}
          />
        </label>
        <label>
          To
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateField('dateTo', e.target.value)}
          />
        </label>
        <label>
          Amount (exact)
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.amount}
            onChange={(e) => updateField('amount', e.target.value)}
          />
        </label>
        <label>
          Min amount
          <input
            type="number"
            step="0.01"
            value={filters.minAmount}
            onChange={(e) => updateField('minAmount', e.target.value)}
          />
        </label>
        <label>
          Max amount
          <input
            type="number"
            step="0.01"
            value={filters.maxAmount}
            onChange={(e) => updateField('maxAmount', e.target.value)}
          />
        </label>
      </div>
      <div className="filters-actions">
        <button type="button" className="btn btn-primary" onClick={onApply}>
          Apply filters
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => onReset(EMPTY)}
        >
          Clear
        </button>
      </div>
    </section>
  );
}
