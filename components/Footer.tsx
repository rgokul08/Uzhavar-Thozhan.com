import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-paddy-dark text-husk/80 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-sm">
        <div>
          <p className="font-display text-lg text-husk mb-2">Uzhavar Thozhan</p>
          <p>உழவர் தோழன் — the farmer&apos;s companion, from soil to sale.</p>
        </div>
        <div>
          <p className="eyebrow text-turmeric mb-2">Grow</p>
          <ul className="space-y-1">
            <li><Link href="/crops">Crop Match</Link></li>
            <li><Link href="/seasonal">Season Guide</Link></li>
            <li><Link href="/weather">Weather</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-turmeric mb-2">Protect &amp; Fund</p>
          <ul className="space-y-1">
            <li><Link href="/insurance">Insurance</Link></li>
            <li><Link href="/loans">Loans</Link></li>
            <li><Link href="/schemes">Govt. Schemes</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-turmeric mb-2">Trade &amp; Support</p>
          <ul className="space-y-1">
            <li><Link href="/marketplace">Sell Produce</Link></li>
            <li><Link href="/seeds">Inputs Store</Link></li>
            <li><Link href="/equipment">Equipment</Link></li>
            <li><Link href="/consult">Ask a Doctor</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} Uzhavar Thozhan. Built for every farmer.
      </div>
    </footer>
  );
}
