import ProductCard from "./ProductCard";
import Reveal from "./motion/Reveal";

export default function ProductGrid({ products, priority = false }) {
  if (!products || products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p, i) => (
        <Reveal key={p.id} delay={(i % 5) * 90}>
          <ProductCard product={p} priority={priority && i < 6} />
        </Reveal>
      ))}
    </div>
  );
}