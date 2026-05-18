import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, imageSrc } from '../utils/format.js';

export default function ExpenseCard({ expense }) {
  return (
    <Link to={`/expenses/${expense._id}`} className="card expense-card">
      {expense.imageUrl ? (
        <img
          src={imageSrc(expense.imageUrl)}
          alt={expense.merchant || 'Receipt'}
          className="expense-card-thumb"
        />
      ) : (
        <div
          className="expense-card-thumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          No image
        </div>
      )}
      <div className="expense-card-header">
        <h3>{expense.merchant || 'Unknown merchant'}</h3>
        <span className="amount">{formatCurrency(expense.amount)}</span>
      </div>
      <div>
        {expense.category && (
          <span className="badge">{expense.category}</span>
        )}
      </div>
      <p className="meta">
        {formatDate(expense.date)}
        {expense.paymentMethod ? ` · ${expense.paymentMethod}` : ''}
      </p>
      {expense.aiSummary && (
        <p className="meta" style={{ margin: 0 }}>
          {expense.aiSummary}
        </p>
      )}
    </Link>
  );
}
