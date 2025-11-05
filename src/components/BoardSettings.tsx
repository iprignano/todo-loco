import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useBoardContext } from '../lib/context/useBoardContext';

export function BoardSettings() {
  const { state, activeBoard, renameBoard, deleteBoard } = useBoardContext();
  const wrapperElId = 'boardSettings';
  const [newName, setNewName] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isRenamingBoard, setIsRenamingBoard] = useState(false);

  const closePanel = () => {
    setNewName('');
    setIsPanelOpen(false);
    setIsRenamingBoard(false);
  };

  const handleClick = useCallback((evt: PointerEvent) => {
    if (!(evt.target as HTMLElement).closest(`#${wrapperElId}`)) {
      closePanel();
    }
  }, []);

  const handleBoardRename = useCallback((evt: FormEvent, newBoardName: string) => {
    evt.preventDefault();
    if (newBoardName === '') return;

    renameBoard(activeBoard?.id!, newBoardName);
    closePanel();
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);

  if (!state || !activeBoard) return null;

  return (
    <div id={wrapperElId} className="relative">
      <button
        className={`cursor-pointer hover:opacity-100 transition-opacity duration-200 ${!isPanelOpen ? 'opacity-50' : ''}`}
        onClick={() => {
          setIsPanelOpen((isOpen) => !isOpen);
          setIsRenamingBoard(false);
          setNewName('');
        }}
      >
        <span className="group-hover:opacity-100 transition-all duration-100">
          <CogIcon />
        </span>
      </button>
      {isPanelOpen && (
        <div className="absolute top-10 right-0 cursor-pointer bg-white border border-gray-300 rounded-lg min-w-56 shadow-sm overflow-hidden">
          {isRenamingBoard ? (
            <div className="px-3 py-2 hover:bg-gray-50">
              <form
                className="flex gap-2 items-center"
                onSubmit={(evt) => handleBoardRename(evt, newName)}
              >
                <input
                  type="text"
                  id="renameBoardName"
                  placeholder="Your new name"
                  className="focus:outline-none bg-transparent"
                  autoFocus
                  onChange={(evt) => setNewName(evt.target.value)}
                  value={newName}
                />
                <button
                  disabled={newName === ''}
                  type="submit"
                  className="rounded bg-blue-800 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => {
                    renameBoard(activeBoard.id, newName);
                    closePanel();
                  }}
                >
                  Rename
                </button>
              </form>
            </div>
          ) : (
            <div
              className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50"
              onClick={() => {
                setIsRenamingBoard(true);
              }}
            >
              Rename board
            </div>
          )}
          <div
            className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 border-t border-gray-200 text-red-700"
            onClick={() => {
              const ok = confirm(
                'Are you sure you want to delete this board? This operation is irreversible.',
              );
              if (ok) {
                deleteBoard(activeBoard.id);
              }
            }}
          >
            <TrashIcon />
            Delete board
          </div>
        </div>
      )}
    </div>
  );
}

function CogIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#000000"
    >
      <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="18px"
      viewBox="0 -960 960 960"
      width="18px"
      fill="#b91c1c"
    >
      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
    </svg>
  );
}
