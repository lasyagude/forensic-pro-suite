import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="grid gap-12 max-w-4xl w-full lg:grid-cols-2 items-center">
        <section className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Welcome to Forensic Pro Suite</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">Secure case management for investigators and analysts.</h1>
            <p className="mt-4 text-slate-300 leading-8">
              Access the restricted investigator portal for authorized case review, evidence analysis, and secure forensic workflows.
            </p>
          </div>

          <Link href="/investigator-login" className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-8 transition hover:border-emerald-400 hover:bg-slate-900 block">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm uppercase tracking-[0.3em] text-emerald-300 font-semibold">
              Security Warning
            </div>
            <h2 className="text-2xl font-semibold">Restricted Investigator Access</h2>
            <p className="mt-3 text-slate-400">Access the secure investigator portal for authorized case review and evidence tools.</p>
            <span className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-950">
              Investigator Login
            </span>
          </Link>
        </section>

        <section className="rounded-[2rem] border border-emerald-500/20 bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
            Forensic Pro Suite — Trusted by security teams
          </div>
          <div className="space-y-4 text-slate-300">
            <p className="text-lg">Protect sensitive case data with role-based access and specialized investigator workflows.</p>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>• Locked investigator portal for authorized personnel</li>
              <li>• Secure case review and evidence analysis</li>
              <li>• Modern, accessible interface with intuitive navigation</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
