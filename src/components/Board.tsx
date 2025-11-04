import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { BoardSwitcher } from './BoardSwitcher';
import { useBoards } from '../state/useBoards';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import type { Task } from '../types';

export function Board({ onSelectTask }: { onSelectTask?: (taskId: string) => void }) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const { activeBoard, state, saveState, moveTask, tasksByColumn, taskById } = useBoards({
    isDraggingTask: Boolean(draggedTaskId),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (!activeBoard) {
    return <div className="text-center text-gray-600">Loading board…</div>;
  }

  const handleDragEnd = (_: DragEndEvent) => {
    setDraggedTaskId(null);
    saveState();
  };

  const handleDragOver = (event: DragOverEvent) => {
    const activeId = event.active.id as string;
    const overId = (event.over?.id ?? null) as string | null;
    if (!state || !state.activeBoardId || !overId) return;
    if (!activeId.startsWith('task:')) return;
    const taskId = activeId.replace('task:', '');

    const bId = state.activeBoardId;
    const cols = state.tasksByBoard[bId];
    const columns: Array<{ id: string; ids: string[] }> = [
      { id: 'backlog', ids: cols.backlog },
      { id: 'inProgress', ids: cols.inProgress },
      { id: 'done', ids: cols.done },
    ];

    let fromCol = 'backlog';
    let fromIndex = 0;
    for (const c of columns) {
      const idx = c.ids.indexOf(taskId);
      if (idx >= 0) {
        fromCol = c.id;
        fromIndex = idx;
        break;
      }
    }

    let toCol: string;
    let toIndex: number;
    if (overId.startsWith('task:')) {
      const overTaskId = overId.replace('task:', '');
      const found = columns.find((c) => c.ids.includes(overTaskId));
      toCol = found?.id ?? fromCol;
      toIndex = found?.ids.indexOf(overTaskId) ?? fromIndex;
    } else if (overId.startsWith('col:')) {
      toCol = overId.replace('col:', '');
      const targetCol = columns.find((c) => c.id === toCol);
      toIndex = targetCol ? targetCol.ids.length : fromIndex;
    } else {
      return;
    }

    if (fromCol === toCol && fromIndex === toIndex) return;

    moveTask(
      taskId,
      { column: fromCol as any, index: fromIndex },
      { column: toCol as any, index: toIndex },
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as string;
    if (!activeId.startsWith('task:')) return;

    const taskId = activeId.replace('task:', '');
    setDraggedTaskId(taskId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{activeBoard.name}</h2>
        <BoardSwitcher />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {activeBoard.columns.map((colId) => (
            <Column
              key={colId}
              columnId={colId}
              onSelectTask={onSelectTask}
              tasks={tasksByColumn()[`col:${colId}`]}
            />
          ))}
        </div>
        {createPortal(
          <DragOverlay>
            {draggedTaskId && <TaskCard task={taskById(draggedTaskId) as Task} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
}
