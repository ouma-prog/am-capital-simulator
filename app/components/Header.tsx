"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#003049] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logoA&M.png" alt="A&M Capital" className="h-8 w-auto" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link
            href="/#simulation"
            className="hover:text-[var(--color-am-gold)] transition"
          >
            Simulation
          </Link>
          <Link
            href="#contact"
            className="hover:text-[var(--color-am-gold)] transition"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
