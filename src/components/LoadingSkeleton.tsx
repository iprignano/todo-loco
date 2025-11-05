export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-12 block bg-gray-200 rounded-lg animate-pulse w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 h-dvh md:h-96 animate-pulse">
        <div className="bg-gray-200 rounded-lg h-full"></div>
        <div className="hidden md:block bg-gray-200 rounded-lg h-full"></div>
        <div className="hidden md:block bg-gray-200 rounded-lg h-full"></div>
      </div>
    </div>
  );
}
