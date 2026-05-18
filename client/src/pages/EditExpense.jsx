import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchExpense, updateExpense } from '../api/expenses.js';
import { CATEGORIES, formatDateInput } from '../utils/format.js';

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    merchant: '',
    amount: '',
    date: '',
    category: 'Other',
    tax: '',
    paymentMethod: '',
    rawText: '',
    aiSummary: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetchExpense(id);
        const e = res.data;
        if (cancelled) return;
        setForm({
          merchant: e.merchant || '',
          amount: e.amount ?? '',
          date: formatDateInput(e.date),
          category: e.category || 'Other',
          tax: e.tax ?? '',
          paymentMethod: e.paymentMethod || '',
          rawText: e.rawText || '',
          aiSummary: e.aiSummary || '',
        });
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

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        merchant: form.merchant,
        amount: Number(form.amount),
        date: form.date || null,
        category: form.category,
        tax: form.tax === '' ? null : Number(form.tax),
        paymentMethod: form.paymentMethod,
        rawText: form.rawText,
        aiSummary: form.aiSummary,
      };

      await updateExpense(id, payload);
      navigate(`/expenses/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading…
      </div>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1>Edit expense</h1>
        <p>Update extracted fields after reviewing the receipt.</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card form-grid">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="merchant">Merchant</label>
            <input
              id="merchant"
              value={form.merchant}
              onChange={(e) => updateField('merchant', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => updateField('amount', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tax">Tax</label>
            <input
              id="tax"
              type="number"
              step="0.01"
              value={form.tax}
              onChange={(e) => updateField('tax', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment method</label>
            <input
              id="paymentMethod"
              value={form.paymentMethod}
              onChange={(e) => updateField('paymentMethod', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="aiSummary">AI summary</label>
          <input
            id="aiSummary"
            value={form.aiSummary}
            onChange={(e) => updateField('aiSummary', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rawText">Raw extracted text</label>
          <textarea
            id="rawText"
            value={form.rawText}
            onChange={(e) => updateField('rawText', e.target.value)}
          />
        </div>

        <div className="action-bar">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <Link to={`/expenses/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
