import { useState } from 'react';
import { useBoards } from '../state/useBoards';

export function BoardSwitcher() {
  const { state, activeBoard, setActiveBoard, createBoard, renameBoard, deleteBoard } = useBoards();
  const [newName, setNewName] = useState('');

  if (!state || !activeBoard) return null;

  return (
    <div className="flex items-center gap-2">
      <select
        className="rounded border px-2 py-1 text-sm"
        value={activeBoard.id}
        onChange={(e) => setActiveBoard(e.target.value)}
        aria-label="Select board"
      >
        {Object.values(state.boards).map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <input
        className="rounded border px-2 py-1 text-sm"
        placeholder="New board name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        aria-label="New board name"
      />
      <button
        type="button"
        className="rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white"
        onClick={() => {
          const n = newName.trim();
          if (n) {
            createBoard(n);
            setNewName('');
          }
        }}
      >
        + Board
      </button>
      <button
        type="button"
        className="rounded border px-2 py-1 text-xs"
        onClick={() => {
          const n = prompt('Rename board to: ', activeBoard.name);
          if (n && n.trim()) renameBoard(activeBoard.id, n.trim());
        }}
      >
        Rename
      </button>
      <button
        type="button"
        className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700"
        onClick={() => {
          if (confirm('Delete current board? This cannot be undone.')) deleteBoard(activeBoard.id);
        }}
      >
        Delete
      </button>
    </div>
  );
}
