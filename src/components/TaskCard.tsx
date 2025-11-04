import { useSortable } from '@dnd-kit/sortable';
import type { Task } from '../types';

export function TaskCard({ task, onSelect }: { task: Task; onSelect?: (taskId: string) => void }) {
  const { setNodeRef, listeners, isDragging, transform, transition } = useSortable({
    id: `task:${task.id}`,
  });
  const style = {
    transition,
    opacity: isDragging ? '0.5' : '1',
    '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
    '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
    '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
    '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
  } as React.CSSProperties;

  const prioColor =
    task.priority === 'high'
      ? 'bg-red-100 text-red-700'
      : task.priority === 'medium'
        ? 'bg-amber-100 text-amber-700'
        : task.priority === 'low'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-600';

  return (
    <button
      type="button"
      style={style}
      ref={setNodeRef}
      className="w-full rounded-md border bg-white p-3 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      {...listeners}
      onClick={() => onSelect?.(task.id)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium text-gray-800 truncate">{task.title}</div>
        <span className={`shrink-0 rounded px-2 py-0.5 text-xs ${prioColor}`}>
          {task.priority ?? '—'}
        </span>
      </div>
    </button>
  );
}
