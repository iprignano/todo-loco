import { BoardContext, createBoardContext } from '../lib/context/BoardContext';

export function BoardContextProvider({ children }: { children: React.ReactNode }) {
  const value = createBoardContext();
  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}
