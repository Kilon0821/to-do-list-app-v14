import { NextResponse } from 'next/server';
import { getTodos, saveTodos } from '@/lib/db';

// 1. GET: get Todo without deleted
export async function GET() {
  try {
    const todos = getTodos();
    const activeTodos = todos.filter(t => !t.deleted_at);
    return NextResponse.json(activeTodos);
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: add Todo
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, categories, due_date } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const todos = getTodos();
    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const now = new Date().toISOString();

    const newTodo = {
      id: newId,
      title: title.trim(),
      description: description ? description.trim() : '',
      status: 'pending',
      categories: Array.isArray(categories) && categories.length > 0 ? categories : ['Work'],
      due_date: due_date || '',
      completed_at: null,
      created_at: now,
      modified_at: null,
      deleted_at: null
    };

    todos.unshift(newTodo);
    saveTodos(todos);

    return NextResponse.json(newTodo);
  } catch (error) {
    console.error('API POST Error Detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE: soft delete
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const id = Number(idParam);
    const todos = getTodos();
    const now = new Date().toISOString();
    
    let updated = false;
    const newTodos = todos.map(t => {
      if (t.id === id) {
        updated = true;
        return { ...t, deleted_at: now, modified_at: now };
      }
      return t;
    });

    if (!updated) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    saveTodos(newTodos);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. PUT: update status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description, status, categories, due_date } = body;

    const todos = getTodos();
    const now = new Date().toISOString();

    let updated = false;
    const newTodos = todos.map(t => {
      if (t.id === id) {
        updated = true;
        const newStatus = status !== undefined ? status : t.status;
        return {
          ...t,
          title: title !== undefined ? title.trim() : t.title,
          description: description !== undefined ? description.trim() : t.description,
          status: newStatus,
          categories: categories !== undefined ? categories : t.categories,
          due_date: due_date !== undefined ? due_date : t.due_date,
          completed_at: newStatus === 'complete' ? (t.completed_at || now) : null,
          modified_at: now
        };
      }
      return t;
    });

    if (!updated) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    saveTodos(newTodos);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}