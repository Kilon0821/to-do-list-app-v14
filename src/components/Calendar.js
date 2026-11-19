import React, { useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const e = React.createElement;

// follow first category change task color
const getCategoryColors = (todo) => {
  const firstCategory =
    Array.isArray(todo?.categories) && todo.categories.length > 0
      ? String(todo.categories[0]).trim()
      : '';

  switch (firstCategory) {
    case 'Urgent':
      return {
        backgroundColor: '#f8d7da',
        color: '#842029',
        border: '1px solid #dc3545',
        borderLeft: '3px solid #dc3545',
      };
    case 'Personal':
      return {
        backgroundColor: '#cff4fc',
        color: '#055160',
        border: '1px solid #0dcaf0',
        borderLeft: '3px solid #0dcaf0',
      };
    case 'Work':
    default:
      return {
        backgroundColor: '#e2e3e5',
        color: '#41464b',
        border: '1px solid #6c757d',
        borderLeft: '3px solid #6c757d',
      };
  }
};

export default function TodoCalendar({ show, onClose, todos = [], onViewClick }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateMap = useMemo(() => {
    const map = new Map();
    for (const todo of todos) {
      const raw = todo.due_date || todo.created_at || '';
      const key = String(raw).trim().slice(0, 10);
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(todo);
    }
    return map;
  }, [todos]);

  if (!show) return null;

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const selectedKey = `${year}-${month}-${day}`;
  const selectedDayTodos = dateMap.get(selectedKey) || [];
  const pendingDayTodos = selectedDayTodos.filter((todo) => todo.status !== 'complete');
  const completeDayTodos = selectedDayTodos.filter((todo) => todo.status === 'complete');

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const k = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
    const items = dateMap.get(k) || [];
    if (!items.length) return null;

    const shown = items.slice(0, 2).map((todo) => {
      const catStyle = getCategoryColors(todo);
      const firstCat =
        Array.isArray(todo.categories) && todo.categories.length > 0
          ? todo.categories[0]
          : 'No Category';

      return e(
        'div',
        {
          key: todo.id,
          className: 'text-truncate px-1 rounded mt-1',
          title: `${todo.title} (${firstCat}${todo.status === 'complete' ? ', complete' : ''})`,
          style: {
            fontSize: '11px',
            backgroundColor: catStyle.backgroundColor,
            color: catStyle.color,
            borderLeft: catStyle.borderLeft,
            textDecoration: todo.status === 'complete' ? 'line-through' : 'none',
          },
          onClick: (ev) => {
            ev.stopPropagation();
          },
        },
        todo.title
      );
    });

    if (items.length > 2) {
      shown.push(
        e(
          'div',
          {
            key: 'more',
            style: { fontSize: '10px', color: '#6c757d', fontWeight: 600 },
          },
          `+${items.length - 2} more`
        )
      );
    }

    return e('div', { style: { overflow: 'hidden', width: '100%' } }, shown);
  };

  return e(
    React.Fragment,
    null,
    e('div', { className: 'modal-backdrop fade show', onClick: onClose }),
    e(
      'div',
      { className: 'modal fade show d-block', tabIndex: '-1', onClick: onClose },
      e(
        'div',
        {
          className: 'modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable',
          onClick: (ev) => ev.stopPropagation(),
        },
        e(
          'div',
          { className: 'modal-content' },
          e(
            'div',
            { className: 'modal-header' },
            e('h5', { className: 'modal-title fw-bold mb-0' }, 'Calendar View'),
            e('button', { type: 'button', className: 'btn-close', onClick: onClose })
          ),
          e(
            'div',
            { className: 'modal-body' },
            e(
              'div',
              { className: 'd-flex justify-content-center align-items-center w-100 todo-calendar-wrapper' },
              e(Calendar, {
                onChange: setSelectedDate,
                value: selectedDate,
                tileContent,
                locale: 'en-US',
              })
            ),
            e(
              'div',
              { className: 'mt-3 pt-3 border-top daily-task-content' },
              e(
                'div',
                { className: 'fw-semibold small text-secondary mb-2' },
                `Tasks on ${selectedKey} (${selectedDayTodos.length})`
              ),
              selectedDayTodos.length === 0
                ? e('div', { className: 'text-muted small' }, 'No tasks on this date.')
                : e(
                    'div',
                    { className: 'row g-3' },
                    // Pending
                    e(
                      'div',
                      { className: 'col-md-6' },
                      e(
                        'div',
                        { className: 'border rounded p-2 h-100 bg-light' },
                        e(
                          'div',
                          { className: 'd-flex justify-content-between align-items-center mb-2' },
                          e('span', { className: 'fw-semibold small text-warning-emphasis' }, 'Pending'),
                          e('span', { className: 'badge bg-warning text-dark' }, pendingDayTodos.length)
                        ),
                        pendingDayTodos.length === 0
                          ? e('div', { className: 'text-muted small' }, 'No pending tasks.')
                          : e(
                              'div',
                              { className: 'd-flex flex-column gap-2' },
                                pendingDayTodos.map((todo) => {
                                const catStyle = getCategoryColors(todo);
                                const firstCat =
                                    Array.isArray(todo.categories) && todo.categories.length > 0
                                    ? todo.categories[0]
                                    : 'No Category';

                                return e(
                                    'button',
                                    {
                                    key: todo.id,
                                    type: 'button',
                                    className: 'btn btn-sm text-start text-truncate w-100',
                                    title: `${todo.title} (${firstCat})`,
                                    style: {
                                        backgroundColor: catStyle.backgroundColor,
                                        color: catStyle.color,
                                        border: catStyle.border,
                                        borderLeft: catStyle.borderLeft,
                                    },
                                    onClick: () => onViewClick && onViewClick(todo),
                                    },
                                    todo.title
                                );
                                })
                            )
                      )
                    ),
                    // Complete
                    e(
                      'div',
                      { className: 'col-md-6' },
                      e(
                        'div',
                        { className: 'border rounded p-2 h-100 bg-light' },
                        e(
                          'div',
                          { className: 'd-flex justify-content-between align-items-center mb-2' },
                          e('span', { className: 'fw-semibold small text-success' }, 'Complete'),
                          e('span', { className: 'badge bg-success' }, completeDayTodos.length)
                        ),
                        completeDayTodos.length === 0
                          ? e('div', { className: 'text-muted small' }, 'No completed tasks.')
                          : e(
                              'div',
                              { className: 'd-flex flex-column gap-2' },
                                completeDayTodos.map((todo) => {
                                const catStyle = getCategoryColors(todo);
                                const firstCat =
                                    Array.isArray(todo.categories) && todo.categories.length > 0
                                    ? todo.categories[0]
                                    : 'No Category';

                                return e(
                                    'button',
                                    {
                                    key: todo.id,
                                    type: 'button',
                                    className: 'btn btn-sm text-start text-truncate w-100',
                                    title: `${todo.title} (${firstCat})`,
                                    style: {
                                        backgroundColor: catStyle.backgroundColor,
                                        color: catStyle.color,
                                        border: catStyle.border,
                                        borderLeft: catStyle.borderLeft,
                                    },
                                    onClick: () => onViewClick && onViewClick(todo),
                                    },
                                    todo.title
                                );
                                })
                            )
                      )
                    )
                  )
            )
          ),
          e(
            'div',
            { className: 'modal-footer' },
            e('button', { type: 'button', className: 'btn btn-secondary', onClick: onClose }, 'Close')
          )
        )
      )
    )
  );
}