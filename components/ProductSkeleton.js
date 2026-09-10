export default function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[1.5rem] border border-line bg-[#16202b]">
      <div className="aspect-square w-full bg-white/5" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-4/5 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/10" />
        <div className="h-6 w-1/3 rounded bg-white/10" />
        <div className="h-9 w-full rounded bg-white/5" />
      </div>
    </div>
  );
}