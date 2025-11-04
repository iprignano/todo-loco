import { useState } from 'react';
import type { ColumnId, Priority } from '../types';
import { useBoards } from '../state/useBoards';

export function NewTaskForm({ columnId }: { columnId: ColumnId }) {
  const { createTask } = useBoards();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    createTask(columnId, trimmed, priority || undefined);
    setTitle('');
    setPriority('');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Add a task title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Task title"
      />
      <div className="flex items-center gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority((e.target.value || '') as Priority | '')}
          className="rounded border px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Priority"
        >
          <option value="">No priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button
          type="submit"
          className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
    </form>
  );
}
