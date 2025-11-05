import { BoardArea } from './components/BoardArea';
import { BoardContextProvider } from './components/BoardContextProvider';

export default function App() {
  return (
    <div className="min-h-screen text-gray-900">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <BoardContextProvider>
          <BoardArea />
        </BoardContextProvider>
      </main>
    </div>
  );
}
