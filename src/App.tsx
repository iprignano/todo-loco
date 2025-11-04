import BoardArea from './components/BoardArea';

export default function App() {
  return (
    <div className="min-h-screen text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">todo-loco</h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <BoardArea />
      </main>
    </div>
  );
}
