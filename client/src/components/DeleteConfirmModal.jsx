export default function DeleteConfirmModal({
  open,
  merchant,
  onCancel,
  onConfirm,
  deleting,
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Delete expense?</h2>
        <p>
          This will permanently remove
          {merchant ? ` the expense from "${merchant}"` : ' this expense'} and
          its receipt image.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
