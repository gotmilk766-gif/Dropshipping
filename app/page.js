"use client";

import HeroBand from "@/components/HeroBand3D";
import MarqueeBand from "@/components/MarqueeBand";
import FeelingSection from "@/components/FeelingSection";
import ServicesBand from "@/components/ServicesBand";
import Spotlight from "@/components/Spotlight";
import Testimonials from "@/components/Testimonials";
import GetStartedBand from "@/components/GetStartedBand";
import { useProducts } from "@/lib/useProducts";

export default function HomePage() {
  const { products, loaded } = useProducts();

  // Two flagship products featured in the "NEW · JUST RELEASED" blocks.
  const spotlight = loaded
    ? products.filter((p) => p.spotlight).slice(0, 2)
    : [];

  return (
    <main>
      <HeroBand />
      {/* Left-to-right band: core catalog words, calm pace */}
      <MarqueeBand
        words={[
          "3D Prints",
          "Digital Templates",
          "Dropship",
          "Made to Order",
          "Free Shipping over ₱1,500",
        ]}
        duration={52}
      />
      <FeelingSection />
      <ServicesBand />
      {/* Right-to-left band: offer words, quicker pace, reverse direction */}
      <MarqueeBand
        reverse
        words={[
          "Custom Prints",
          "Instant Downloads",
          "Nationwide Delivery",
          "Quality Checked",
          "Secure Checkout",
        ]}
        duration={30}
        tone="#101820"
      />
      <Spotlight products={spotlight} />
      <Testimonials />
      <GetStartedBand />
    </main>
  );
}