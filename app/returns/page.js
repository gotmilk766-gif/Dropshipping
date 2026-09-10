import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns & Refunds" updated="September 2026">
      <section>
        <h2 className="font-heading text-base font-bold text-ink">Digital Products</h2>
        <p>
          Because digital templates are delivered instantly upon payment, they
          are <b>non-refundable</b> except where required by Philippine law
          (e.g. the item was misrepresented or the file is defective). If a
          file fails to download, contact us and we&apos;ll re-send it or fix
          the issue right away.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">Physical &amp; Dropship Products</h2>
        <p>
          You may request a return within <b>7 days of delivery</b> if the item
          arrives damaged, defective, or not as described. Items must be unused
          and in original packaging where possible. Refunds are issued to the
          original payment method within 5–7 business days of approval.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">Non-Returnable Items</h2>
        <p>
          Custom/personalized 3D prints made to your specifications are
          non-refundable unless they arrive damaged. For hygiene reasons,
          worn/opened wearable accessories (e.g. smartwatch straps) cannot be
          returned unless defective.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">How to Start a Return</h2>
        <p>
          Email{" "}
          <a href="mailto:hello@nexusstore.ph" className="text-brand">
            hello@nexusstore.ph
          </a>{" "}
          within 7 days of delivery with your order number, a photo of the item
          (if damaged), and a short description. We&apos;ll reply within 48
          hours with next steps.
        </p>
      </section>
    </LegalPage>
  );
}