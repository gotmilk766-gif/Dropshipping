export default function LegalPage({ title, updated, children }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-line bg-[#16202b] p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-black text-ink">{title}</h1>
        <p className="mt-1 text-xs text-muted">
          {updated ? `Last updated: ${updated}` : "Nexus Store"}
        </p>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
          {children}
        </div>
      </div>
    </main>
  );
}