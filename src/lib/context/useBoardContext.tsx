import { useContext } from 'react';
import { BoardContext } from './BoardContext';

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error('useBoards must be used within a BoardProvider');
  }
  return ctx;
}
