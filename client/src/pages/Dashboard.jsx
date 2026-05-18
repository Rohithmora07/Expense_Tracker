import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchExpenses } from '../api/expenses.js';
import ExpenseCard from '../components/ExpenseCard.jsx';
import ExpenseFilters from '../components/ExpenseFilters.jsx';
import { formatCurrency } from '../utils/format.js';

const INITIAL_FILTERS = {
  category: '',
  merchant: '',
  date: '',
  dateFrom: '',
  dateTo: '',
  amount: '',
  minAmount: '',
  maxAmount: '',
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (activeFilters) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchExpenses(activeFilters);
      setExpenses(res.data || []);
    } catch (err) {
      setError(err.message);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(appliedFilters);
  }, [appliedFilters, load]);

  const totalAmount = expenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );

  return (
    <>
      <header className="page-header">
        <h1>Expense dashboard</h1>
        <p>Receipts analyzed by Gemini — search and manage your spending.</p>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <div className="label">Expenses</div>
          <div className="value">{expenses.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Filtered total</div>
          <div className="value">{formatCurrency(totalAmount)}</div>
        </div>
        <div
          className="stat-card"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Link to="/upload" className="btn btn-primary" style={{ width: '100%' }}>
            + Upload receipt
          </Link>
        </div>
      </div>

      <ExpenseFilters
        filters={filters}
        onChange={setFilters}
        onApply={() => setAppliedFilters({ ...filters })}
        onReset={(empty) => {
          setFilters(empty);
          setAppliedFilters(empty);
        }}
      />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          Loading expenses…
        </div>
      ) : expenses.length === 0 ? (
        <div className="empty card">
          <p>No expenses found.</p>
          <Link to="/upload" className="btn btn-primary">
            Upload your first receipt
          </Link>
        </div>
      ) : (
        <div className="expense-grid">
          {expenses.map((expense) => (
            <ExpenseCard key={expense._id} expense={expense} />
          ))}
        </div>
      )}
    </>
  );
}
