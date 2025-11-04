import { useMemo, useState } from 'react';
import type { ColumnId, Priority } from '../types';
import { useBoards } from '../state/useBoards';

export function TaskDetailsPanel({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const { state, updateTask, deleteTask, moveTask } = useBoards();
  const task = state?.tasks[taskId];

  const [localTitle, setLocalTitle] = useState('');
  const [localDesc, setLocalDesc] = useState('');
  const [localPriority, setLocalPriority] = useState<Priority | ''>('');
  // Sync local fields when task changes
  if (task && localTitle === '' && localDesc === '' && localPriority === '') {
    // naive sync on first render for the given taskId
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.resolve().then(() => {
      setLocalTitle(task.title);
      setLocalDesc(task.description ?? '');
      setLocalPriority((task.priority ?? '') as Priority | '');
    });
  }

  const currentColumn: ColumnId | undefined = useMemo(() => {
    if (!state?.activeBoardId) return undefined;
    const bId = state.activeBoardId;
    const cols = state.tasksByBoard[bId];
    if (cols.backlog.includes(taskId)) return 'backlog';
    if (cols.inProgress.includes(taskId)) return 'inProgress';
    if (cols.done.includes(taskId)) return 'done';
    return undefined;
  }, [state, taskId]);

  if (!task || !state) return null;

  function save() {
    const updates: any = { description: localDesc, priority: localPriority || undefined };
    const t = localTitle.trim();
    if (t) updates.title = t;
    updateTask(taskId, updates);
  }

  function handleMove(toCol: ColumnId) {
    if (!state?.activeBoardId || !currentColumn) return;
    const bId = state.activeBoardId;
    const fromIndex = state.tasksByBoard[bId][currentColumn].indexOf(taskId);
    const toIndex = state.tasksByBoard[bId][toCol].length;
    moveTask(
      taskId,
      { column: currentColumn, index: fromIndex },
      { column: toCol, index: toIndex },
    );
  }

  return (
    <aside className="fixed right-0 top-0 z-20 h-full w-full max-w-md border-l bg-white shadow-xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-700">Task details</h3>
        <button onClick={onClose} className="rounded border px-2 py-1 text-xs">
          Close
        </button>
      </div>
      <div className="flex h-[calc(100%-49px)] flex-col gap-3 overflow-y-auto p-4">
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Title</label>
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Description</label>
          <textarea
            className="min-h-[120px] w-full resize-y rounded border px-3 py-2 text-sm"
            value={localDesc}
            onChange={(e) => setLocalDesc(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Priority</label>
          <select
            className="rounded border px-2 py-2 text-sm"
            value={localPriority}
            onChange={(e) => setLocalPriority((e.target.value || '') as Priority | '')}
          >
            <option value="">No priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            onClick={save}
          >
            Save changes
          </button>
          <div className="ml-auto" />
          <select
            className="rounded border px-2 py-2 text-sm"
            value={currentColumn ?? ''}
            onChange={(e) => handleMove(e.target.value as ColumnId)}
          >
            <option value="backlog">Backlog</option>
            <option value="inProgress">In progress</option>
            <option value="done">Done</option>
          </select>
          <button
            className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
            onClick={() => {
              if (confirm('Delete this task?')) {
                deleteTask(taskId);
                onClose();
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </aside>
  );
}
