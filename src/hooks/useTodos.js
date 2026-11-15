import { useState, useEffect } from 'react';

export default function useTodos() {
  /*
  // dummy data
  const [todos, setTodos] = useState([
    { id: 1, title: 'learn Next.js basic structure', description: 'learn Next.js basic structure', status: 'pending', completed_at: null, created_at: null, modified_at: null, deleted_at: null  },
    { id: 2, title: 'learn App.js logic', description: 'learn App.js logic', status: 'complete', completed_at: null, created_at: null, modified_at: null, deleted_at: null  },
    { id: 3, title: 'integrate with SQLite database', description: 'integrate with SQLite database', status: 'pending', completed_at: null, created_at: null, modified_at: null, deleted_at: null  }
  ]);
  */

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTodos(data);
      })
      .catch((err) => console.error('Failed to fetch todos:', err));
  }, []);

  const addTodo = async (title, description, categories = ['Work'], due_date = '') => {
    if (!title.trim()) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, categories, due_date }),
      });
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const toggleTodo = async (id, newStatus) => {
    try {
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      setTodos(
        todos.map((todo) =>
          todo.id === id 
            ? { ...todo, status: newStatus, completed_at: newStatus === 'complete' ? new Date().toISOString() : null } 
            : todo
        )
      );
    } catch (err) {
      console.error('Failed to update todo status:', err);
    }
  };

  const editTodo = async (id, updatedFields) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedFields }),
      });
      
      if (res.ok) {
        setTodos(
          todos.map((todo) => {
            if (todo.id === id) {
              const newStatus = updatedFields.status !== undefined ? updatedFields.status : todo.status;
              return {
                ...todo,
                ...updatedFields,
                completed_at: newStatus === 'complete' ? (todo.completed_at || new Date().toISOString()) : null,
                modified_at: new Date().toISOString()
              };
            }
            return todo;
          })
        );
      }
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  return {
    todos,
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodo,
  };
}