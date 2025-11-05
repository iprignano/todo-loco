import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useBoardContext } from '../lib/context/useBoardContext';

export function BoardSwitcher() {
  const { state, activeBoard, setActiveBoard, createBoard } = useBoardContext();
  const wrapperElId = 'boardSwitcher';
  const [newName, setNewName] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddingNewBoard, setIsAddingNewBoard] = useState(false);

  const closePanel = () => {
    setNewName('');
    setIsAddingNewBoard(false);
    setIsPanelOpen(false);
  };

  const handleClick = useCallback((evt: PointerEvent) => {
    if (!(evt.target as HTMLElement).closest(`#${wrapperElId}`)) {
      closePanel();
    }
  }, []);

  const handleNewBoardSubmit = useCallback((evt: FormEvent, newBoardName: string) => {
    evt.preventDefault();
    createBoard(newBoardName);
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
        className="flex gap-4 items-center border border-gray-300 rounded-lg py-2 px-3 bg-white cursor-pointer group hover:border-gray-400 transition-colors duration-100"
        onClick={() => {
          setIsPanelOpen((isOpen) => !isOpen);
          setIsAddingNewBoard(false);
          setNewName('');
        }}
      >
        <h2 className="text-lg font-semibold">{activeBoard.name}</h2>
        <span className="opacity-50 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none">
          <CaretDownIcon />
        </span>
      </button>
      {isPanelOpen && (
        <div className="absolute top-14 left-0 cursor-pointer bg-white border border-gray-300 rounded-lg min-w-56 shadow-sm overflow-hidden">
          {Object.values(state.boards).map(({ id, name }) => (
            <div
              key={id}
              onClick={() => {
                setActiveBoard(id);
                closePanel();
              }}
              className="px-3 py-2 hover:bg-gray-50"
            >
              {name}
            </div>
          ))}
          {isAddingNewBoard ? (
            <div className="hover:bg-gray-50 border-t border-gray-200">
              <form
                className="flex gap-2 items-center px-3 py-2"
                onSubmit={(evt) => handleNewBoardSubmit(evt, newName)}
              >
                <input
                  type="text"
                  id="newBoardName"
                  placeholder="My new board"
                  className="focus:outline-none bg-transparent"
                  autoFocus
                  onChange={(evt) => setNewName(evt.target.value)}
                  value={newName}
                />
                <button
                  disabled={newName === ''}
                  type="submit"
                  className="rounded bg-blue-800 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                >
                  Add
                </button>
              </form>
            </div>
          ) : (
            <div
              className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 border-t border-gray-200"
              onClick={() => {
                setIsAddingNewBoard(true);
              }}
            >
              New board{' '}
              <span className="pointer-events-none">
                <PlusCircleIcon />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CaretDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="#000000"
    >
      <path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14px"
      viewBox="0 -960 960 960"
      width="14px"
      fill="#a6a6a6"
    >
      <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}
