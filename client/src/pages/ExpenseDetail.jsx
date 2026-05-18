import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteExpense, fetchExpense } from '../api/expenses.js';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import { formatCurrency, formatDate, imageSrc } from '../utils/format.js';

export default function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetchExpense(id);
        if (!cancelled) setExpense(res.data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteExpense(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading expense…
      </div>
    );
  }

  if (error && !expense) {
    return (
      <>
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-secondary">
          Back to dashboard
        </Link>
      </>
    );
  }

  if (!expense) return null;

  return (
    <>
      <header className="page-header">
        <h1>{expense.merchant || 'Expense detail'}</h1>
        <p>{expense.aiSummary || 'Receipt expense record'}</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="detail-layout">
        <section className="card">
          {expense.imageUrl ? (
            <img
              src={imageSrc(expense.imageUrl)}
              alt="Receipt"
              className="detail-image"
            />
          ) : (
            <p className="meta">No receipt image</p>
          )}
        </section>

        <section className="card">
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Amount</dt>
              <dd>{formatCurrency(expense.amount)}</dd>
            </div>
            <div className="detail-row">
              <dt>Date</dt>
              <dd>{formatDate(expense.date)}</dd>
            </div>
            <div className="detail-row">
              <dt>Category</dt>
              <dd>{expense.category || '—'}</dd>
            </div>
            <div className="detail-row">
              <dt>Tax</dt>
              <dd>{formatCurrency(expense.tax)}</dd>
            </div>
            <div className="detail-row">
              <dt>Payment</dt>
              <dd>{expense.paymentMethod || '—'}</dd>
            </div>
            <div className="detail-row">
              <dt>Created</dt>
              <dd>{formatDate(expense.createdAt)}</dd>
            </div>
          </dl>

          {expense.items?.length > 0 && (
            <>
              <h3 style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>Items</h3>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {expense.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {item.lineTotal != null
                          ? formatCurrency(item.lineTotal)
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {expense.rawText && (
            <>
              <h3 style={{ marginTop: '1.5rem', fontSize: '0.95rem' }}>
                Extracted text (OCR)
              </h3>
              <pre className="raw-text">{expense.rawText}</pre>
            </>
          )}

          <div className="action-bar">
            <Link to={`/expenses/${id}/edit`} className="btn btn-primary">
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
            <Link to="/" className="btn btn-ghost">
              Back
            </Link>
          </div>
        </section>
      </div>

      <DeleteConfirmModal
        open={showDelete}
        merchant={expense.merchant}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
}
