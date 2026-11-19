'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import useTodos from './hooks/useTodos';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import EditTodo from './components/EditTodo';
import TodoItem from './components/TodoItem';
import Calendar from './components/Calendar';
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
  const { todos, addTodo, editTodo, deleteTodo, toggleTodo, fetchTodos } = useTodos();
  
  // modal visibility state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
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

  // calender modal
  const handleCalendarViewClick = (todo) => {
    setShowCalendarModal(false);
    handleViewClick(todo);
  };

  // Export filtered/sorted todos to Excel (.xlsx)
  const handleExport = () => {
    const dataToExport = sortedTodos.map((todo) => ({
      Title: todo.title || '',
      Description: todo.description || '',
      Status: todo.status || 'pending',
      Categories: Array.isArray(todo.categories) ? todo.categories.join(', ') : '',
      DueDate: todo.due_date || '',
      CreatedAt: todo.created_at || '',
      CompletedAt: todo.completed_at || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Todos');

    const filename = `todos_${getTodayStr()}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const parseAndValidateDueDate = (rawDueDate) => {
    if (rawDueDate === null || rawDueDate === undefined || String(rawDueDate).trim() === '') {
      return { valid: true, value: '' };
    }

    if (typeof rawDueDate === 'number') {
      const parsed = XLSX.SSF?.parse_date_code?.(rawDueDate);
      if (!parsed || !parsed.y || !parsed.m || !parsed.d) {
        return { valid: false, value: '' };
      }
      const yyyy = String(parsed.y).padStart(4, '0');
      const mm = String(parsed.m).padStart(2, '0');
      const dd = String(parsed.d).padStart(2, '0');
      return { valid: true, value: `${yyyy}-${mm}-${dd}` };
    }

    const str = String(rawDueDate).trim();

    const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoMatch) {
      const year = Number(isoMatch[1]);
      const month = Number(isoMatch[2]);
      const day = Number(isoMatch[3]);
      const dateObj = new Date(Date.UTC(year, month - 1, day));
      if (
        dateObj.getUTCFullYear() === year &&
        dateObj.getUTCMonth() === month - 1 &&
        dateObj.getUTCDate() === day
      ) {
        return {
          valid: true,
          value: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        };
      }
      return { valid: false, value: '' };
    }

    const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const month = Number(slashMatch[1]);
      const day = Number(slashMatch[2]);
      const year = Number(slashMatch[3]);
      const dateObj = new Date(Date.UTC(year, month - 1, day));
      if (
        dateObj.getUTCFullYear() === year &&
        dateObj.getUTCMonth() === month - 1 &&
        dateObj.getUTCDate() === day
      ) {
        return {
          valid: true,
          value: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        };
      }
      return { valid: false, value: '' };
    }

    return { valid: false, value: '' };
  };

  const handleImport = async (file) => {
    const ALLOWED_STATUSES = ['pending', 'complete'];
    const ALLOWED_CATEGORIES = ['Urgent', 'Personal', 'Work'];

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!rows.length) {
        alert('Excel not found or no data found');
        return;
      }

      let importedCount = 0;
      const errors = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const excelRowNumber = i + 2; // 第 1 行为表头，数据从第 2 行开始

        const title = String(row.title ?? row.Title ?? '').trim();
        const description = String(row.description ?? row.Description ?? '').trim();
        const rawStatus = String(row.status ?? row.Status ?? '').trim();
        const rawCategories = row.categories ?? row.Categories ?? '';
        const rawDueDate = row.due_date ?? row.DueDate ?? '';

        const catStr = Array.isArray(rawCategories)
          ? rawCategories.join(',')
          : String(rawCategories).trim();

        const dueDateStr =
          rawDueDate === null || rawDueDate === undefined ? '' : String(rawDueDate).trim();

        // skip if all fields are empty
        if (!title && !description && !rawStatus && !catStr && !dueDateStr) {
          continue;
        }

        const rowErrors = [];

        // 1. check title
        if (!title) {
          rowErrors.push('title is required');
        }

        // 2. check status
        let status = 'pending';
        if (rawStatus) {
          const normalizedStatus = rawStatus.toLowerCase();
          if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
            rowErrors.push(`status ("${rawStatus}") is invalid, must be "pending" or "complete"`);
          } else {
            status = normalizedStatus === 'completed' ? 'complete' : normalizedStatus;
          }
        }

        // 3. check categories
        const categories = catStr
          ? catStr
              .split(',')
              .map((c) => c.trim())
              .filter(Boolean)
          : [];

        if (categories.length > 0) {
          const invalidCats = categories.filter((c) => !ALLOWED_CATEGORIES.includes(c));
          if (invalidCats.length > 0) {
            rowErrors.push(
              `categories (${invalidCats.join(', ')}) not allowed, expected: ${ALLOWED_CATEGORIES.join(', ')}`
            );
          }
        }

        // 4. check due_date
        const dateResult = parseAndValidateDueDate(rawDueDate);
        if (!dateResult.valid) {
          rowErrors.push(`due_date ("${dueDateStr}") is invalid`);
        }

        // if got errors, skip this row
        if (rowErrors.length > 0) {
          errors.push(`Row ${excelRowNumber}: ${rowErrors.join('; ')}`);
          continue;
        }

        await addTodo(
          title,
          description,
          status,
          categories.length > 0 ? categories : ['Work'],
          dateResult.value
        );

        importedCount += 1;
      }

      // fetch if complete
      if (importedCount > 0) {
        await fetchTodos();
      }

      if (errors.length > 0 && importedCount > 0) {
        alert(
          `import ${importedCount} datas successfully, but ${errors.length} row(s) had errors:\n\n${errors.join('\n')}`
        );
      } else if (errors.length > 0 && importedCount === 0) {
        alert(`import failed, no data imported due to validation errors:\n\n${errors.join('\n')}`);
      } else {
        alert(`import ${importedCount} datas successfully`);
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('import failed, please check the Excel file format and try again');
    }
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
              type="button"
              className="btn btn-outline-info fw-semibold"
              onClick={() => setShowCalendarModal(true)}
            >
              <i className="bi bi-calendar3 me-1"></i>
              Calendar
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
        onImport={handleImport}
        onExport={handleExport}
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

      {/* pop up calendar Modal */}
      <Calendar
        show={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        todos={sortedTodos}
        onViewClick={handleCalendarViewClick}
      />
    </div>
  );
}