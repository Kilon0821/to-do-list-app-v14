import React, { useState, useEffect } from 'react';

const AVAILABLE_CATEGORIES = ['Work', 'Personal', 'Urgent'];

export default function EditTodo({ show, onClose, todo, onEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [categories, setCategories] = useState(['Work']);
  const [dueDate, setDueDate] = useState('');

  // Automatically populate the form's initial values ​​when the incoming todo changes.
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setStatus(todo.status || 'pending');
      setCategories(todo.categories || ['Work']);
      setDueDate(todo.due_date || '');
    }
  }, [todo]);

  const handleCategoryChange = (cat) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter(c => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !todo) return;
    onEdit(todo.id, { title, description, status, categories, due_date: dueDate });
    onClose();
  };

  if (!show || !todo) return null;

  return (
    <>
      {/* background blur */}
      <div className="modal-backdrop fade show"></div>

      {/* modal block */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            
            <div className="modal-header">
              <h5 className="modal-title fw-bold text-primary">Edit Task</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold d-block">Categories (Multi-select)</label>
                  <div className="btn-group w-100" role="group">
                    {AVAILABLE_CATEGORIES.map((cat) => {
                      const isSelected = categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => handleCategoryChange(cat)}
                        >
                          {isSelected ? `✓ ${cat}` : cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}