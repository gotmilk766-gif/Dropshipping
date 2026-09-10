import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <section>
        <h2 className="font-heading text-base font-bold text-ink">1. Information We Collect</h2>
        <p>
          When you place an order we collect your name, email address, phone
          number and delivery address. If you create an account, we store your
          login credentials securely. We also collect basic analytics (pages
          visited, device type) to improve the store.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">2. How We Use It</h2>
        <p>
          Your information is used to process orders, deliver digital products,
          send receipts and shipping updates, provide support, and improve our
          services. We do not sell your personal data to anyone.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">3. Payment Data</h2>
        <p>
          Card and payment details are handled entirely by our payment
          processor, <b>Stripe</b>. We never see or store your full card
          number. See Stripe&apos;s privacy policy for how they protect your
          data.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">4. Third-Party Services</h2>
        <p>
          We use third-party providers for hosting (Vercel), database and
          storage (Supabase), and transactional email (Resend). These providers
          process data only to deliver their services to us.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">5. Cookies &amp; Analytics</h2>
        <p>
          We use cookies for essential store functions (like keeping your cart)
          and may use privacy-respecting analytics to understand store traffic.
          You can clear cookies in your browser at any time.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">6. Data Retention &amp; Your Rights</h2>
        <p>
          We keep order records for as long as needed for accounting and
          support. You may request a copy or deletion of your personal data by
          emailing us — we will respond within 30 days.
        </p>
      </section>
      <section>
        <h2 className="font-heading text-base font-bold text-ink">7. Contact</h2>
        <p>
          Privacy questions:{" "}
          <a href="mailto:hello@nexusstore.ph" className="text-brand">
            hello@nexusstore.ph
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}