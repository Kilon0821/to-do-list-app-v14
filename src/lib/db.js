import fs from 'fs';
import path from 'path';

// setup data path（data/todos.json）
const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'todos.json');

/**
 * get all to-do datas
 * if data file not exist, create it and return empty array
 */
export function getTodos() {
  // 1. make sure data directory exist, if not, create it
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create data directory:', err);
    }
  }

  // 2. if json file not exist, create it and add seeder
  if (!fs.existsSync(filePath)) {
    const initialData = [
        {
            id: 1,
            title: 'Basic Functionality',
            description: 'Implement list, add, delete, edit, mark complete/incomplete, set due date, and multiple categories (Work, Personal, Urgent) selection.',
            status: 'pending',
            categories: ['Work'],
            due_date: '2026-11-21',
            completed_at: null,
            created_at: new Date().toISOString(),
            modified_at: null,
            deleted_at: null
        },
        {
            id: 2,
            title: 'Pagination',
            description: 'Implement pagination with configurable limit (5, 10, 15, or 20), navigation controls (Previous, Next), and page status indicators.',
            status: 'pending',
            categories: ['Work'],
            due_date: '2026-11-21',
            completed_at: null,
            created_at: new Date().toISOString(),
            modified_at: null,
            deleted_at: null
        },
        {
            id: 3,
            title: 'Searching, Filtering and Sorting',
            description: 'Implement keyword search, status filtering, category filtering, and sorting by due date, created date, or completed date with asc/desc order.',
            status: 'pending',
            categories: ['Work'],
            due_date: '2026-11-21',
            completed_at: null,
            created_at: new Date().toISOString(),
            modified_at: null,
            deleted_at: null
        },
        {
            id: 4,
            title: 'Persistent Storage',
            description: 'Research and implement local storage or file-based JSON persistence to ensure tasks survive page reloads and application restarts.',
            status: 'pending',
            categories: ['Work'],
            due_date: '2026-11-21',
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            modified_at: null,
            deleted_at: null
        },
        {
            id: 5,
            title: 'Import To-Do List',
            description: 'Implement a feature to allow users to import tasks in bulk through CSV or Excel files.',
            status: 'pending',
            categories: ['Work'],
            due_date: '2026-11-21',
            completed_at: null,
            created_at: new Date().toISOString(),
            modified_at: null,
            deleted_at: null
        },
        {
            id: 6,
            title: 'Export as Report',
            description: 'Implement an export feature allowing users to download to-do items and reports in Excel format.',
            status: 'pending',
            categories: ['Work'],
            due_date: '2026-11-21',
            completed_at: null,
            created_at: new Date().toISOString(),
            modified_at: null,
            deleted_at: null
        },
        {
            id: 7,
            title: 'Calendar View (Optional, Extra)',
            description: 'Create a calendar component displaying tasks by due dates with color-coded categories using a library like react-calendar or react-big-calendar.',
            status: 'pending',
            categories: ['Work'],
            due_date: '2026-11-21',
            completed_at: null,
            created_at: new Date().toISOString(),
            modified_at: null,
            deleted_at: null
        },
        {
            id: 8,
            title: 'Drag-and-Drop Reordering (Optional, Extra)',
            description: 'Allow users to reorder tasks by dragging and dropping them using a library like react-beautiful-dnd or react-dnd.',
            status: 'pending',
            categories: ['Work'],
            due_date: '2026-11-21',
            completed_at: null,
            created_at: new Date().toISOString(),
            modified_at: null,
            deleted_at: null
        }
        ];

    try {
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf8');
      console.log('Initialized todos.json with default data.');
    } catch (err) {
      console.error('Failed to write initial todos.json:', err);
    }

    return initialData;
  }

  // 3. read json file
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.error('Failed to read or parse todos.json:', err);
    return [];
  }
}

/**
 * save to-do data back to json file
 */
export function saveTodos(todos) {
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create data directory:', err);
      return;
    }
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save todos.json:', err);
  }
}