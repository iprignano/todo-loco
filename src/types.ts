export type ColumnId = 'backlog' | 'inProgress' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  createdAt: number;
  updatedAt?: number;
}

export interface Board {
  id: string;
  name: string;
  columns: ColumnId[];
}

export interface BoardState {
  boards: Record<string, Board>;
  tasksByBoard: Record<string, Record<ColumnId, string[]>>;
  tasks: Record<string, Task>;
  activeBoardId?: string;
  schemaVersion: number;
}

export const SCHEMA_VERSION = 1 as const;
