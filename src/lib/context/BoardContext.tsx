import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SCHEMA_VERSION } from '../../types';
import { generateId } from '../../lib/id';
import { loadState, saveStateDebounced } from '../../lib/storage';
import type { Board, BoardState, ColumnId, Priority, Task } from '../../types';

const DEFAULT_COLUMNS: ColumnId[] = ['backlog', 'inProgress', 'done'];

function createEmptyState(): BoardState {
  const defaultBoardId = generateId('board');
  const defaultBoard: Board = { id: defaultBoardId, name: 'My Board', columns: DEFAULT_COLUMNS };
  return {
    boards: { [defaultBoardId]: defaultBoard },
    tasksByBoard: {
      [defaultBoardId]: { backlog: [], inProgress: [], done: [] },
    },
    tasks: {},
    activeBoardId: defaultBoardId,
    schemaVersion: SCHEMA_VERSION,
  };
}

export const createBoardContext = (args?: { isDraggingTask?: boolean }) => {
  const [state, setState] = useState<BoardState | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    (async () => {
      const loaded = await loadState<BoardState>();
      if (loaded && loaded.schemaVersion === SCHEMA_VERSION) {
        setState(loaded);
      } else {
        setState(createEmptyState());
      }
    })();
  }, []);

  // Persist whenever state changes,
  // except when a card is being dragged around
  useEffect(() => {
    if (!state || args?.isDraggingTask) return;
    saveStateDebounced(state);
  }, [state]);

  useEffect(() => {
    document.title = `[tl] ${activeBoard?.name}`;
  }, [state?.activeBoardId]);

  const saveState = () => {
    saveStateDebounced(state);
  };

  const activeBoard = useMemo(() => {
    if (!state?.activeBoardId) return undefined;
    return state.boards[state.activeBoardId];
  }, [state]);

  const setActiveBoard = useCallback((boardId: string) => {
    setState((prev) => (prev ? { ...prev, activeBoardId: boardId } : prev));
  }, []);

  const createBoard = useCallback((name: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const id = generateId('board');
      const board: Board = { id, name, columns: DEFAULT_COLUMNS };
      return {
        ...prev,
        boards: { ...prev.boards, [id]: board },
        tasksByBoard: { ...prev.tasksByBoard, [id]: { backlog: [], inProgress: [], done: [] } },
        activeBoardId: id,
      };
    });
  }, []);

  const renameBoard = useCallback((id: string, name: string) => {
    setState((prev) => {
      const board = prev?.boards[id];
      if (!board) return prev;
      return { ...prev, boards: { ...prev.boards, [id]: { ...board, name } } };
    });
  }, []);

  const deleteBoard = useCallback((id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const boards = { ...prev.boards };
      const tasksByBoard = { ...prev.tasksByBoard };
      delete boards[id];
      const removed = tasksByBoard[id];
      delete tasksByBoard[id];

      // Optionally clean up orphaned tasks
      if (removed) {
        const referenced = new Set<string>();
        for (const bId of Object.keys(tasksByBoard)) {
          const cols = tasksByBoard[bId];
          (['backlog', 'inProgress', 'done'] as ColumnId[]).forEach((col) => {
            cols[col].forEach((tid) => referenced.add(tid));
          });
        }
        const tasks = Object.fromEntries(
          Object.entries(prev.tasks).filter(([tid]) => referenced.has(tid)),
        );
        const next: BoardState = {
          ...prev,
          boards,
          tasksByBoard,
          tasks,
        };
        if (prev.activeBoardId === id) {
          next.activeBoardId = Object.keys(boards)[0];
        }
        return next;
      }

      const next: BoardState = { ...prev, boards, tasksByBoard };
      if (prev.activeBoardId === id) next.activeBoardId = Object.keys(boards)[0];
      return next;
    });
  }, []);

  const createTask = useCallback((column: ColumnId, title: string, priority?: Priority) => {
    setState((prev) => {
      if (!prev || !prev.activeBoardId) return prev;
      const id = generateId('task');
      const task: Task = { id, title, priority, createdAt: Date.now() };
      const tasks = { ...prev.tasks, [id]: task };
      const tasksByBoard = { ...prev.tasksByBoard };
      tasksByBoard[prev.activeBoardId] = {
        ...tasksByBoard[prev.activeBoardId],
        [column]: [...tasksByBoard[prev.activeBoardId][column], id],
      };
      return { ...prev, tasks, tasksByBoard };
    });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setState((prev) => {
      if (!prev) return prev;
      const existing = prev.tasks[id];
      if (!existing) return prev;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [id]: { ...existing, ...updates, updatedAt: Date.now() },
        },
      };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => {
      if (!prev || !prev.activeBoardId) return prev;
      const tasks = { ...prev.tasks };
      delete tasks[id];
      const bId = prev.activeBoardId;
      const cols = prev.tasksByBoard[bId];
      const nextCols: Record<ColumnId, string[]> = {
        backlog: cols.backlog.filter((tid) => tid !== id),
        inProgress: cols.inProgress.filter((tid) => tid !== id),
        done: cols.done.filter((tid) => tid !== id),
      };
      return { ...prev, tasks, tasksByBoard: { ...prev.tasksByBoard, [bId]: nextCols } };
    });
  }, []);

  const moveTask = useCallback(
    (
      _taskId: string,
      from: { column: ColumnId; index: number },
      to: { column: ColumnId; index: number },
    ) => {
      setState((prev) => {
        if (!prev || !prev.activeBoardId) return prev;
        const bId = prev.activeBoardId;
        const cols = { ...prev.tasksByBoard[bId] };

        // Remove from source
        const fromArr = [...cols[from.column]];
        const [removed] = fromArr.splice(from.index, 1);
        // Insert into target
        const toArr = from.column === to.column ? fromArr : [...cols[to.column]];
        toArr.splice(to.index, 0, removed);

        cols[from.column] = from.column === to.column ? toArr : fromArr;
        cols[to.column] = toArr;

        return { ...prev, tasksByBoard: { ...prev.tasksByBoard, [bId]: cols } };
      });
    },
    [],
  );

  const tasksByColumn = useCallback(() => {
    if (!state || !state.activeBoardId) return {} as Record<string, Task[]>;
    const bId = state.activeBoardId;
    const columns = state.boards[bId].columns;

    const result: Record<string, Task[]> = {};
    for (const column of columns) {
      const ids = state.tasksByBoard[bId][column];
      const items = ids.map((id) => state.tasks[id]).filter(Boolean) as Task[];

      result[`col:${column}`] = items;
    }
    return result;
  }, [state]);

  const taskById = useCallback(
    (id: string) => {
      if (!state) return undefined;
      return state.tasks[id];
    },
    [state],
  );

  return {
    state,
    saveState,
    activeBoard,
    setActiveBoard,
    createBoard,
    renameBoard,
    deleteBoard,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    tasksByColumn,
    taskById,
  } as const;
};

type BoardsContextValue = ReturnType<typeof createBoardContext> | null;
export const BoardContext = createContext<BoardsContextValue>(null);
