import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6">
      <ProductGridSkeleton />
    </div>
  );
}