import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="September 2026">
      <section>
        <h2 className="font-heading text-base font-bold text-ink">1. Acceptance of Terms</h2>
        <p>
          By accessing or purchasing from Nexus Store (&quot;we&quot;,
          &quot;us&quot;), you agree to these Terms of Service. If you do not
          agree, please do not use the store.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">2. Products &amp; Pricing</h2>
        <p>
          We offer three types of products: <b>physical</b> (3D prints shipped
          in-house), <b>digital</b> (instant download templates) and{" "}
          <b>dropship</b> (items shipped from our supplier). Prices are listed
          in Philippine Pesos (₱) and include applicable taxes unless stated
          otherwise. We may update prices at any time; the price at checkout
          applies to your order.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">3. Orders &amp; Payment</h2>
        <p>
          Payment is processed securely via Stripe (GCash, Maya, credit and
          debit cards). Your order is confirmed once payment is received.
          Digital products are delivered instantly; shipped items follow the
          timelines in our Shipping Policy.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">4. Digital Products</h2>
        <p>
          Digital templates are licensed for personal or single-business use.
          Reselling, redistributing or sharing download links is prohibited.
          Because digital goods are delivered instantly, they are
          non-refundable except where required by law.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">5. User Conduct</h2>
        <p>
          You agree not to misuse the store, attempt to interfere with its
          security, or use it for unlawful purposes. We may suspend accounts
          that violate these terms.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Nexus Store is not liable for
          indirect or consequential damages arising from the use of our
          products or services. Our total liability for any claim is limited to
          the amount you paid for the product in question.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">7. Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the
          store after changes constitutes acceptance of the updated terms.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">8. Contact</h2>
        <p>
          Questions about these terms? Email us at{" "}
          <a href="mailto:hello@nexusstore.ph" className="text-brand">
            hello@nexusstore.ph
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}