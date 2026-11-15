import React, { useState } from 'react';

const AVAILABLE_CATEGORIES = ['Work', 'Personal', 'Urgent'];

export default function AddTodo({ show, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState(['Work']);
  const [dueDate, setDueDate] = useState('');

  const handleCategoryChange = (cat) => {
    if (categories.includes(cat)) {
      // Keep at least one category, or allow it to be empty.
      if (categories.length > 1) {
        setCategories(categories.filter(c => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description, categories, dueDate);
    setTitle('');
    setDescription('');
    setCategories(['Work']);
    setDueDate('');
    onClose(); // Close Modal after submit
  };

  if (!show) return null;

  return (
    <>
      {/* background blur */}
      <div className="modal-backdrop fade show"></div>

      {/* modal block */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            
            <div className="modal-header">
              <h5 className="modal-title fw-bold text-primary">Add New Task</h5>
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
                    placeholder="Enter task title..."
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
                    placeholder="Enter task description (optional)..."
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
                  Save Task
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}