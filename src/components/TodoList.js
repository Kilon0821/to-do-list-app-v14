import React, { useState } from 'react';

export default function TodoList({ todos, onDelete, onToggle, onEditClick, onViewClick, viewMode, setViewMode }) {
  if (todos.length === 0) {
    return <p className="text-muted text-center">No todo datas</p>;
  }

  const pendingTodos = todos.filter((todo) => todo.status === 'pending');
  const completedTodos = todos.filter((todo) => todo.status === 'complete');

  // pending pagination
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingLimit, setPendingLimit] = useState(5);
  const totalPendingPages = Math.ceil(pendingTodos.length / pendingLimit) || 1;
  const currentPendingPage = Math.min(pendingPage, totalPendingPages);
  const pendingStartIndex = (currentPendingPage - 1) * pendingLimit;
  const paginatedPending = pendingTodos.slice(pendingStartIndex, pendingStartIndex + pendingLimit);

  // completed pagination
  const [completedPage, setCompletedPage] = useState(1);
  const [completedLimit, setCompletedLimit] = useState(5);
  const totalCompletedPages = Math.ceil(completedTodos.length / completedLimit) || 1;
  const currentCompletedPage = Math.min(completedPage, totalCompletedPages);
  const completedStartIndex = (currentCompletedPage - 1) * completedLimit;
  const paginatedCompleted = completedTodos.slice(completedStartIndex, completedStartIndex + completedLimit);

  // set diffrent color for different category type
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

  const showPending = viewMode === 'all' || viewMode === 'pending';
  const showCompleted = viewMode === 'all' || viewMode === 'complete';
  const columnClass = viewMode === 'all' ? 'col-md-6' : 'col-12';

  return (
    <div>
      {/* switch view button */}
      <div className="mb-4">
        <div className="btn-group w-100 shadow-sm" role="group">
          <button
            type="button"
            className={`btn ${viewMode === 'all' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setViewMode('all')}
          >
            Show All (Dual View)
          </button>
          <button
            type="button"
            className={`btn ${viewMode === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setViewMode('pending')}
          >
            Pending Only (Expand)
          </button>
          <button
            type="button"
            className={`btn ${viewMode === 'complete' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setViewMode('complete')}
          >
            Completed Only (Expand)
          </button>
        </div>
      </div>

      <div className="row g-4">
        
        {/* Pending Block */}
        {showPending && (
        <div className={columnClass}>
            <div className="card h-100 border-warning shadow-sm d-flex flex-column">
            <div className="card-header bg-warning text-dark fw-bold d-flex justify-content-between align-items-center">
                <span>Pending</span>
                <span className="badge bg-dark">{pendingTodos.length}</span>
            </div>

            <ul className="list-group list-group-flush flex-grow-1">
                {paginatedPending.length === 0 ? (
                <li className="list-group-item text-muted text-center py-4">No pending tasks</li>
                ) : (
                paginatedPending.map((todo) => (
                    <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center py-3 gap-2">
                    
                    <div 
                        style={{ cursor: 'pointer', minWidth: 0 }} 
                        className="flex-grow-1 me-2"
                        onClick={() => onViewClick(todo)}
                        title="Click to view details"
                    >
                        <h6 className="mb-1 fw-bold text-primary text-decoration-underline text-truncate">
                          {todo.title}
                        </h6>

                        <p className="mb-1 text-muted small text-truncate">
                          {todo.description || 'No description'}
                        </p>

                        <div className="d-flex align-items-center flex-wrap gap-1 mb-1">
                          {Array.isArray(todo.categories) && todo.categories.map(cat => (
                              <span key={cat} className={`badge ${getCategoryBadgeStyle(cat)}`}>{cat}</span>
                          ))}
                        </div>

                        {todo.due_date && <small className="text-danger fw-semibold">Due: {todo.due_date}</small>}
                    </div>

                    {/* Action */}
                    <div className="btn-group btn-group-sm flex-shrink-0">
                        <button 
                          onClick={() => onEditClick(todo)} 
                          className="btn btn-outline-primary px-2"
                          title="Edit"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button 
                          onClick={() => onToggle(todo.id, 'complete')} 
                          className="btn btn-outline-success px-2"
                          title="Complete"
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button 
                          onClick={() => onDelete(todo.id)} 
                          className="btn btn-outline-danger px-2"
                          title="Delete"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>

                    </li>
                ))
                )}
            </ul>

            {/* Pending pagination */}
            <div className="card-footer bg-light d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center gap-2">
                <small className="text-muted">Show:</small>
                <select 
                    className="form-select form-select-sm" 
                    style={{ width: '70px' }}
                    value={pendingLimit}
                    onChange={(e) => {
                    setPendingLimit(Number(e.target.value));
                    setPendingPage(1);
                    }}
                >
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
                </div>
                
                <small className="text-muted">
                Page {currentPendingPage} of {totalPendingPages}
                </small>

                <div className="btn-group btn-group-sm">
                <button 
                    className="btn btn-outline-secondary" 
                    disabled={currentPendingPage === 1}
                    onClick={() => setPendingPage(currentPendingPage - 1)}
                >
                    Previous
                </button>
                <button 
                    className="btn btn-outline-secondary" 
                    disabled={currentPendingPage >= totalPendingPages}
                    onClick={() => setPendingPage(currentPendingPage + 1)}
                >
                    Next
                </button>
                </div>
            </div>

            </div>
        </div>
        )}

        {/* Completed Block */}
        {showCompleted && (
        <div className={columnClass}>
            <div className="card h-100 border-success shadow-sm d-flex flex-column">
            <div className="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center">
                <span>Completed</span>
                <span className="badge bg-light text-dark">{completedTodos.length}</span>
            </div>

            <ul className="list-group list-group-flush flex-grow-1">
                {paginatedCompleted.length === 0 ? (
                <li className="list-group-item text-muted text-center py-4">No completed tasks</li>
                ) : (
                paginatedCompleted.map((todo) => (
                    <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center py-3 gap-2">
                    
                    <div 
                        style={{ cursor: 'pointer', minWidth: 0 }} 
                        className="flex-grow-1 me-2"
                        onClick={() => onViewClick(todo)}
                        title="Click to view details"
                    >
                        <h6 className="mb-1 fw-bold text-success text-decoration-underline text-truncate">
                          {todo.title}
                        </h6>

                        <p className="mb-1 text-muted small text-truncate">
                          {todo.description || 'No description'}
                        </p>

                        <div className="d-flex align-items-center flex-wrap gap-1 mb-1">
                          {Array.isArray(todo.categories) && todo.categories.map(cat => (
                              <span key={cat} className={`badge ${getCategoryBadgeStyle(cat)}`}>{cat}</span>
                          ))}
                        </div>

                        {todo.due_date && <small className="text-muted">Due: {todo.due_date}</small>}
                    </div>

                    {/* Action */}
                    <div className="btn-group btn-group-sm flex-shrink-0">
                        <button 
                          onClick={() => onEditClick(todo)} 
                          className="btn btn-outline-primary px-2"
                          title="Edit"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button 
                          onClick={() => onDelete(todo.id)} 
                          className="btn btn-outline-danger px-2"
                          title="Delete"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>

                    </li>
                ))
                )}
            </ul>

            {/* Completed pagination */}
            <div className="card-footer bg-light d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center gap-2">
                <small className="text-muted">Show:</small>
                <select 
                    className="form-select form-select-sm" 
                    style={{ width: '70px' }}
                    value={completedLimit}
                    onChange={(e) => {
                    setCompletedLimit(Number(e.target.value));
                    setCompletedPage(1);
                    }}
                >
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
                </div>
                
                <small className="text-muted">
                Page {currentCompletedPage} of {totalCompletedPages}
                </small>

                <div className="btn-group btn-group-sm">
                <button 
                    className="btn btn-outline-secondary" 
                    disabled={currentCompletedPage === 1}
                    onClick={() => setCompletedPage(currentCompletedPage - 1)}
                >
                    Previous
                </button>
                <button 
                    className="btn btn-outline-secondary" 
                    disabled={currentCompletedPage >= totalCompletedPages}
                    onClick={() => setCompletedPage(currentCompletedPage + 1)}
                >
                    Next
                </button>
                </div>
            </div>

            </div>
        </div>
        )}

        </div>
    </div>
  );
}