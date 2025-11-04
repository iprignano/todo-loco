import { useState } from 'react';
import { Board } from './Board';
import { TaskDetailsPanel } from './TaskDetailsPanel';

export function BoardArea() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  return (
    <div className="relative space-y-6">
      <Board onSelectTask={setSelectedTaskId} />
      {selectedTaskId && (
        <TaskDetailsPanel taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
      )}
    </div>
  );
}
