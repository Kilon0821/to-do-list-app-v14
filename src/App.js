'use client';

import React, { useState } from 'react';
import useTodos from './hooks/useTodos';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import EditTodo from './components/EditTodo';
import TodoItem from './components/TodoItem';
import Filter from './components/Filters';

// get selected date (YYYY-MM-DD)
const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// get today date (YYYY-MM-DD)
const getTodayStr = () => {
  return new Date().toISOString().split('T')[0];
};

export default function App() {
  const { todos, addTodo, editTodo, deleteTodo, toggleTodo } = useTodos();
  
  // modal visibility state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // modal data state
  const [editingTodo, setEditingTodo] = useState(null);
  const [viewingTodo, setViewingTodo] = useState(null);

  const [viewMode, setViewMode] = useState('all');

  // keyword for search
  const [searchKeyword, setSearchKeyword] = useState('');

  // default filter by created date (last 7 days)
  const [createdRange, setCreatedRange] = useState({
    start: getDateDaysAgo(7),
    end: getTodayStr(),
  });

  const [completedRange, setCompletedRange] = useState({
    start: '',
    end: '',
  });
  
  const [dueDateRange, setDueDateRange] = useState({
    start: '',
    end: '',
  });

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // reset filter date
  const handleResetOneWeek = () => {
    setSearchKeyword('');
    setCreatedRange({
      start: getDateDaysAgo(7),
      end: getTodayStr(),
    });
    setCompletedRange({
      start: '',
      end: '',
    });
    setDueDateRange({
      start: '',
      end: '',
    });
    setSelectedCategories([]);
    setSortBy('created_at');
    setSortOrder('desc');
  };

  // edit modal
  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setShowEditModal(true);
  };

  // view modal
  const handleViewClick = (todo) => {
    setViewingTodo(todo);
    setShowViewModal(true);
  };

  // filter todos based on search keyword and date range
  const filteredTodos = todos.filter((todo) => {
    // 1. keyword
    const keyword = searchKeyword.toLowerCase();
    const matchesKeyword = 
      (todo.title || '').toLowerCase().includes(keyword) || 
      (todo.description && todo.description.toLowerCase().includes(keyword));

    if (!matchesKeyword) return false;

    // 2. Categories
    if (selectedCategories.length > 0) {
      const todoCats = Array.isArray(todo.categories) ? todo.categories : [];
      const hasMatchingCategory = selectedCategories.some(cat => todoCats.includes(cat));
      if (!hasMatchingCategory) return false;
    }

    // 3. Created At range
    if (createdRange.start && todo.created_at) {
      const createdDate = todo.created_at.split('T')[0];
      if (createdDate < createdRange.start) return false;
    }
    if (createdRange.end && todo.created_at) {
      const createdDate = todo.created_at.split('T')[0];
      if (createdDate > createdRange.end) return false;
    }

    // 4. Completed At range
    if (completedRange.start) {
      if (!todo.completed_at) return false;
      const completedDate = todo.completed_at.split('T')[0];
      if (completedDate < completedRange.start) return false;
    }
    if (completedRange.end) {
      if (!todo.completed_at) return false;
      const completedDate = todo.completed_at.split('T')[0];
      if (completedDate > completedRange.end) return false;
    }

    // 5. Due Date range
    if (dueDateRange.start) {
      if (!todo.due_date) return false;
      if (todo.due_date < dueDateRange.start) return false;
    }
    if (dueDateRange.end) {
      if (!todo.due_date) return false;
      if (todo.due_date > dueDateRange.end) return false;
    }

    return true;
  });

  // based on filter content doing sorting
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // 处理可能为空的值 (如没有 due_date 或 completed_at)
    if (valA === null || valA === undefined) valA = '';
    if (valB === null || valB === undefined) valB = '';

    let comparison = valA > valB ? 1 : valA < valB ? -1 : 0;

    // sorting result
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="card shadow-sm p-4 mx-auto my-4" style={{ maxWidth: '1200px' }}>
      {/* add new Task button on top right */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-primary fw-bold mb-0">To-Do List</h1>
        <div className="d-flex">
            <button 
            className="btn btn-primary fw-semibold"
            onClick={() => setShowAddModal(true)}
            >
            + Add New Task
            </button>
            <button 
            className="btn btn-secondary fw-semibold"
            >
            + Bulk Add Task (coming soon)
            </button>
        </div>
        
      </div>

      {/* filter */}
      <Filter
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        createdRange={createdRange}
        setCreatedRange={setCreatedRange}
        completedRange={completedRange}
        setCompletedRange={setCompletedRange}
        dueDateRange={dueDateRange}
        setDueDateRange={setDueDateRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        handleResetOneWeek={handleResetOneWeek}
      />

      {/* to-do list */}
      <TodoList 
        todos={sortedTodos} 
        onDelete={deleteTodo} 
        onToggle={toggleTodo} 
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* pop up add to-do Modal */}
      <AddTodo
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTodo}
      />

      {/* pop up edit to-do Modal */}
      <EditTodo
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        todo={editingTodo}
        onEdit={editTodo}
      />

      {/* pop up view to-do Modal */}
      <TodoItem
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        todo={viewingTodo}
      />
    </div>
  );
}