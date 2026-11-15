import React from 'react';

export default function TodoItem({ show, onClose, todo }) {
  if (!show || !todo) return null;

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString();
  };

  const getCategoryBadgeStyle = (cat) => {
    switch (cat) {
      case 'Urgent':
        return 'bg-danger';
      case 'Personal':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            
            <div className="modal-header">
              <h5 className="modal-title fw-bold text-primary">Task Details</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              
              {/* ID */}
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">TASK ID</label>
                <div className="fw-semibold text-secondary">#{todo.id}</div>
              </div>

              {/* Title */}
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">TITLE</label>
                <div className="fs-5 fw-bold text-dark">{todo.title}</div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">DESCRIPTION</label>
                <div className="p-3 bg-light rounded border text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                  {todo.description || 'No description provided.'}
                </div>
              </div>

              {/* Status & Category */}
              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold mb-1">STATUS</label>
                  <div>
                    <span className={`badge ${todo.status === 'complete' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {todo.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold mb-1">DUE DATE</label>
                  <div className="fw-medium text-danger">{todo.due_date || 'No due date'}</div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">CATEGORIES</label>
                <div className="d-flex gap-1 flex-wrap">
                  {Array.isArray(todo.categories) && todo.categories.length > 0 ? (
                    todo.categories.map((cat) => (
                      <span key={cat} className={`badge ${getCategoryBadgeStyle(cat)}`}>
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="badge bg-secondary">Work</span>
                  )}
                </div>
              </div>

              <hr className="text-muted" />

              {/* Timestamps (Created, Modified, Completed) */}
              <div className="mb-2 small">
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Created At:</span>
                  <span className="fw-medium">{formatDate(todo.created_at)}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Modified At:</span>
                  <span className="fw-medium">{formatDate(todo.modified_at)}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Completed At:</span>
                  <span className="fw-medium">{formatDate(todo.completed_at)}</span>
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary w-100" onClick={onClose}>
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}