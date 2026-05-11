export default function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-100 h-10 animate-pulse" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="h-12 border-t border-gray-100 bg-white px-4 flex items-center"
        >
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      ))}
    </div>
  );
}
