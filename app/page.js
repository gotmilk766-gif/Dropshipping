"use client";

import HeroBand from "@/components/HeroBand3D";
import MarqueeBand from "@/components/MarqueeBand";
import FeelingSection from "@/components/FeelingSection";
import ServicesBand from "@/components/ServicesBand";
import FlashSale from "@/components/FlashSale";
import Testimonials from "@/components/Testimonials";
import GetStartedBand from "@/components/GetStartedBand";
import { useProducts } from "@/lib/useProducts";

export default function HomePage() {
  const { products, loaded } = useProducts();

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
      <FlashSale products={products} loaded={loaded} />
      <Testimonials />
      <GetStartedBand />
    </main>
  );
}