import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ITEM_TYPE = 'TODO_ITEM';

// Dragable Todo Card
function DraggableTodoItem({
  todo,
  accentClass,
  dueDateClass,
  showCompleteBtn,
  onToggle,
  onDelete,
  onEditClick,
  onViewClick,
  getCategoryBadgeStyle,
}) {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: { id: todo.id, status: todo.status },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [todo.id, todo.status]
  );

  return (
    <li
      ref={preview}
      className={`list-group-item d-flex justify-content-between align-items-center py-3 gap-2 ${
        isDragging ? 'bg-light border-primary shadow-sm' : ''
      }`}
      style={{ opacity: isDragging ? 0.55 : 1 }}
    >
      {/* handle */}
      <span
        ref={drag}
        className="text-muted px-1 flex-shrink-0"
        style={{ cursor: 'grab' }}
        title="Drag to change status"
      >
        <i className="bi bi-grip-vertical"></i>
      </span>

      <div
        style={{ cursor: 'pointer', minWidth: 0 }}
        className="flex-grow-1 me-2"
        onClick={() => onViewClick(todo)}
        title="Click to view details"
      >
        <h6 className={`mb-1 fw-bold ${accentClass} text-decoration-underline text-truncate`}>
          {todo.title}
        </h6>

        <p className="mb-1 text-muted small text-truncate">
          {todo.description || 'No description'}
        </p>

        <div className="d-flex align-items-center flex-wrap gap-1 mb-1">
          {Array.isArray(todo.categories) &&
            todo.categories.map((cat) => (
              <span key={cat} className={`badge ${getCategoryBadgeStyle(cat)}`}>
                {cat}
              </span>
            ))}
        </div>

        {todo.due_date && <small className={dueDateClass}>Due: {todo.due_date}</small>}
      </div>

      {/* Action */}
      <div className="btn-group btn-group-sm flex-shrink-0">
        <button
          type="button"
          onClick={() => onEditClick(todo)}
          className="btn btn-outline-primary px-2"
          title="Edit"
        >
          <i className="bi bi-pencil-fill"></i>
        </button>
        {showCompleteBtn && (
          <button
            type="button"
            onClick={() => onToggle(todo.id, 'complete')}
            className="btn btn-outline-success px-2"
            title="Complete"
          >
            <i className="bi bi-check-lg"></i>
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="btn btn-outline-danger px-2"
          title="Delete"
        >
          <i className="bi bi-trash-fill"></i>
        </button>
      </div>
    </li>
  );
}

// Frag and Drop（Pending / Complete）
function StatusDropCard({
  targetStatus,
  headerText,
  headerClass,
  borderClass,
  badgeClass,
  count,
  columnClass,
  onToggle,
  children,
  footer,
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      canDrop: (item) => item.status !== targetStatus,
      drop: (item) => {
        if (item.status !== targetStatus && onToggle) {
          onToggle(item.id, targetStatus);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [targetStatus, onToggle]
  );

  const highlightClass =
    isOver && canDrop ? 'border-primary bg-primary bg-opacity-10' : borderClass;

  return (
    <div className={columnClass}>
      <div
        ref={drop}
        className={`card h-100 ${highlightClass} shadow-sm d-flex flex-column`}
      >
        <div className={`card-header ${headerClass} fw-bold d-flex justify-content-between align-items-center`}>
          <span>{headerText}</span>
          <span className={`badge ${badgeClass}`}>{count}</span>
        </div>

        <ul className="list-group list-group-flush flex-grow-1">{children}</ul>

        {footer}
      </div>
    </div>
  );
}

function TodoListContent({
  todos,
  onDelete,
  onToggle,
  onEditClick,
  onViewClick,
  viewMode,
  setViewMode,
  onImport,
  onExport,
}) {
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingLimit, setPendingLimit] = useState(5);
  const [completedPage, setCompletedPage] = useState(1);
  const [completedLimit, setCompletedLimit] = useState(5);
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
    e.target.value = '';
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

  if (todos.length === 0) {
    return <p className="text-muted text-center">No todo datas</p>;
  }

  const pendingTodos = todos.filter((todo) => todo.status === 'pending');
  const completedTodos = todos.filter((todo) => todo.status === 'complete');

  const totalPendingPages = Math.ceil(pendingTodos.length / pendingLimit) || 1;
  const currentPendingPage = Math.min(pendingPage, totalPendingPages);
  const pendingStartIndex = (currentPendingPage - 1) * pendingLimit;
  const paginatedPending = pendingTodos.slice(pendingStartIndex, pendingStartIndex + pendingLimit);

  const totalCompletedPages = Math.ceil(completedTodos.length / completedLimit) || 1;
  const currentCompletedPage = Math.min(completedPage, totalCompletedPages);
  const completedStartIndex = (currentCompletedPage - 1) * completedLimit;
  const paginatedCompleted = completedTodos.slice(
    completedStartIndex,
    completedStartIndex + completedLimit
  );

  const showPending = viewMode === 'all' || viewMode === 'pending';
  const showCompleted = viewMode === 'all' || viewMode === 'complete';
  const columnClass = viewMode === 'all' ? 'col-md-6' : 'col-12';

  const pendingFooter = (
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
          type="button"
          className="btn btn-outline-secondary"
          disabled={currentPendingPage === 1}
          onClick={() => setPendingPage(currentPendingPage - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={currentPendingPage >= totalPendingPages}
          onClick={() => setPendingPage(currentPendingPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );

  const completedFooter = (
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
          type="button"
          className="btn btn-outline-secondary"
          disabled={currentCompletedPage === 1}
          onClick={() => setCompletedPage(currentCompletedPage - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={currentCompletedPage >= totalCompletedPages}
          onClick={() => setCompletedPage(currentCompletedPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Import / Export / Sample */}
      <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv"
          style={{ display: 'none' }}
        />

        <a
          href="/sample/import_sample.xlsx"
          download="import_sample.xlsx"
          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
          title="Download Excel Sample"
        >
          <i className="bi bi-file-earmark-excel"></i>
          <span>Sample</span>
        </a>

        <button
          type="button"
          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
          onClick={handleImportClick}
        >
          <i className="bi bi-upload"></i>
          <span>Import</span>
        </button>

        <button
          type="button"
          className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
          onClick={onExport}
          disabled={todos.length === 0}
        >
          <i className="bi bi-download"></i>
          <span>Export</span>
        </button>
      </div>

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
          <StatusDropCard
            targetStatus="pending"
            headerText="Pending"
            headerClass="bg-warning text-dark"
            borderClass="border-warning"
            badgeClass="bg-dark"
            count={pendingTodos.length}
            columnClass={columnClass}
            onToggle={onToggle}
            footer={pendingFooter}
          >
            {paginatedPending.length === 0 ? (
              <li className="list-group-item text-muted text-center py-4">
                No pending tasks (drop here to mark pending)
              </li>
            ) : (
              paginatedPending.map((todo) => (
                <DraggableTodoItem
                  key={todo.id}
                  todo={todo}
                  accentClass="text-primary"
                  dueDateClass="text-danger fw-semibold"
                  showCompleteBtn={true}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEditClick={onEditClick}
                  onViewClick={onViewClick}
                  getCategoryBadgeStyle={getCategoryBadgeStyle}
                />
              ))
            )}
          </StatusDropCard>
        )}

        {/* Completed Block */}
        {showCompleted && (
          <StatusDropCard
            targetStatus="complete"
            headerText="Completed"
            headerClass="bg-success text-white"
            borderClass="border-success"
            badgeClass="bg-light text-dark"
            count={completedTodos.length}
            columnClass={columnClass}
            onToggle={onToggle}
            footer={completedFooter}
          >
            {paginatedCompleted.length === 0 ? (
              <li className="list-group-item text-muted text-center py-4">
                No completed tasks (drop here to complete)
              </li>
            ) : (
              paginatedCompleted.map((todo) => (
                <DraggableTodoItem
                  key={todo.id}
                  todo={todo}
                  accentClass="text-success"
                  dueDateClass="text-muted"
                  showCompleteBtn={false}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEditClick={onEditClick}
                  onViewClick={onViewClick}
                  getCategoryBadgeStyle={getCategoryBadgeStyle}
                />
              ))
            )}
          </StatusDropCard>
        )}
      </div>
    </div>
  );
}

export default function TodoList(props) {
  return (
    <DndProvider backend={HTML5Backend}>
      <TodoListContent {...props} />
    </DndProvider>
  );
}