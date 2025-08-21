export default function Footer() {
    return (
      <footer className="bg-[#003049] text-white mt-16">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo + description */}
          <div>
            <img src="/images/logoA&M.png" alt="A&M Capital" className="h-10 mb-4" />
            <p className="text-sm text-gray-300">
              A&M Capital — Spécialistes en investissement immobilier locatif.
            </p>
          </div>
  
          {/* Liens */}
          <div>
            <ul className="space-y-2">
              <li><a href="/#simulation" className="hover:text-[var(--color-am-gold)]">Simulation</a></li>
              <li><a href="#contact" className="hover:text-[var(--color-am-gold)]">Contact</a></li>
            </ul>
          </div>
  
          {/* Contact */}
          <div id="contact">
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-sm">📧 contact@amcapital.com</p>
            <p className="text-sm">📞 +33 1 23 45 67 89</p>
          </div>
        </div>
  
        <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} A&M Capital. Tous droits réservés.
        </div>
      </footer>
    );
  }
  