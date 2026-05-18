import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadExpense } from '../api/expenses.js';

const ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp';

export default function Upload() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function pickFile(selected) {
    if (!selected) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(selected.type)) {
      setError('Only JPG, JPEG, PNG, or WEBP images are allowed.');
      return;
    }

    setError('');
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Please select a receipt image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await uploadExpense(file);
      const id = res.data?._id;
      if (id) {
        navigate(`/expenses/${id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="page-header">
        <h1>Upload receipt</h1>
        <p>
          Add a receipt, invoice, bill, or payment screenshot. Gemini will extract
          the details automatically.
        </p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <label
          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>
            Drop image here or click to browse
          </p>
          <p className="meta" style={{ margin: 0 }}>
            JPG, JPEG, PNG, WEBP — max 5 MB
          </p>
        </label>

        {preview && (
          <div className="preview-wrap">
            <img src={preview} alt="Receipt preview" />
            <p className="meta">{file?.name}</p>
          </div>
        )}

        <div className="action-bar">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !file}
          >
            {loading ? 'Analyzing with AI…' : 'Upload & analyze'}
          </button>
          {file && !loading && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setFile(null);
                setPreview('');
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </>
  );
}
