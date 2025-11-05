import { BoardArea } from './components/BoardArea';
import { BoardContextProvider } from './components/BoardContextProvider';

import './styles/app.css';

export default function App() {
  return (
    <div className="min-h-screen text-gray-900">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <BoardContextProvider>
          <BoardArea />
        </BoardContextProvider>
      </main>
      <footer className="mt-10 text-center">
        <a
          className="logo-link"
          target="_blank"
          href="https://github.com/iprignano/todo-loco"
          rel="noreferrer noopener"
        />
      </footer>
    </div>
  );
}
