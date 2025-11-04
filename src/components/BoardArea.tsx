import { useState } from 'react';
import { Board } from './Board';
import { TaskDetailsPanel } from './TaskDetailsPanel';

export function BoardArea() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  return (
    <div className="relative">
      <Board onSelectTask={setSelectedTaskId} />
      {selectedTaskId && (
        <TaskDetailsPanel taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
      )}
    </div>
  );
}
