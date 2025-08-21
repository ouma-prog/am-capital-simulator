"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#003049] text-white">
      {/* Conteneur principal du header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo cliquable vers la page d'accueil */}
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/images/logoAM.png" 
            alt="A&M Capital" 
            className="h-8 w-auto" 
          />
        </Link>

        {/* Navigation principale */}
        <nav className="flex items-center gap-8">
          {/* Lien vers la section "Simulation" */}
          <Link
            href="/#simulation"
            className="hover:text-[var(--color-am-gold)] transition"
          >
            Simulation
          </Link>

          {/* Lien vers la section "Contact" */}
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
