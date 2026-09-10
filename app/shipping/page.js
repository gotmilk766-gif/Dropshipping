import LegalPage from "@/components/LegalPage";
import { PackageIcon, TruckIcon, ZapIcon } from "@/components/icons";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping Policy" updated="September 2026">
      <section>
        <h2 className="font-heading text-base font-bold text-ink">Three Ways to Receive</h2>
        <p>
          Nexus Store sells three kinds of products, each with its own delivery
          timeline. The badge on every product card tells you which one you&apos;re
          buying.
        </p>
      </section>

      <div className="space-y-4 rounded-xl border border-line bg-[#16202b] p-5">
        <div>
          <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-ink">
            <TruckIcon className="h-4 w-4 text-accent" />
            Physical — 3D Prints (Ships in 3 Days)
          </h3>
          <p className="mt-1">
            Printed and packed in-house. Orders ship within <b>3 business
            days</b> of payment confirmation. Delivery typically takes 1–4
            additional days depending on courier and location.
          </p>
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-ink">
            <ZapIcon className="h-4 w-4 text-accent" />
            Digital — Instant Download
          </h3>
          <p className="mt-1">
            No shipping involved. Your download link unlocks <b>immediately
            after payment</b> and is also emailed to you. Links stay valid for
            re-downloading your purchases.
          </p>
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-ink">
            <PackageIcon className="h-4 w-4 text-accent" />
            Dropship — Supplier Items (Ships in 7+ Days)
          </h3>
          <p className="mt-1">
            These items ship directly from our supplier&apos;s warehouse. Allow{" "}
            <b>7–14 business days</b> for delivery. Tracking is provided by
            email once the item leaves the warehouse.
          </p>
        </div>
      </div>

      <section>
        <h2 className="font-heading text-base font-bold text-ink">Shipping Fees</h2>
        <p>
          Shipping is calculated at checkout and shown before you pay. Some
          promotions include free shipping — the discount appears automatically
          in your order summary.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">Mixed Carts</h2>
        <p>
          If your order contains both digital and shipped items, digital
          downloads unlock immediately while shipped items follow their own
          timelines. You will not be charged double shipping where combined
          rates apply.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">Delays</h2>
        <p>
          If a shipment is delayed (bad weather, courier backlog, supplier
          delay), we will notify you by email with an updated estimate. Contact
          us at{" "}
          <a href="mailto:hello@nexusstore.ph" className="text-brand">
            hello@nexusstore.ph
          </a>{" "}
          for help with any order.
        </p>
      </section>
    </LegalPage>
  );
}