
import { defaultAnimateLayoutChanges, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { NewTaskForm } from './NewTaskForm';
import type { ColumnId, Task } from '../types';

const LABELS: Record<ColumnId, string> = {
  backlog: 'Backlog',
  inProgress: 'In progress',
  done: 'Done',
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({...args, wasDragging: true});

export function Column({
  columnId,
  onSelectTask,
  tasks,
}: {
  columnId: ColumnId;
  onSelectTask?: (taskId: string) => void;
  tasks: Task[];
}) {
  const { setNodeRef } = useSortable({ id: `col:${columnId}`, animateLayoutChanges });

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{LABELS[columnId]}</h3>
        <span className="text-xs text-gray-500">{tasks.length}</span>
      </header>
      <div ref={setNodeRef} className="rounded-lg border bg-white p-3 shadow-sm">
        <SortableContext
          items={tasks.map((t) => `task:${t.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {tasks.map((t) => (
              <TaskCard key={t.id} task={t} onSelect={onSelectTask} />
            ))}
          </div>
        </SortableContext>
        <div className="mt-3 pt-3 border-t">
          <NewTaskForm columnId={columnId} />
        </div>
      </div>
    </section>
  );
}
