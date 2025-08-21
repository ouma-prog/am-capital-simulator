import "./globals.css";
import Footer from "./components/Footer";

// ✅ Les metadata (SEO, favicon, titre...) doivent être définies
//    dans un export const en haut du fichier (Next.js 13+).
export const metadata = {
  title: "A&M Capital – Simulateur d’investissement",   // <title> de la page
  description: "Simulateur locatif interactif par A&M Capital", // <meta description>
  icons: {
    icon: "/images/logoA&M.png", // favicon affichée dans l’onglet
  },
};

// Composant racine qui encapsule toute l’application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Définition de la langue par défaut
    <html lang="fr">
      <body>
        {/* Le contenu principal de chaque page */}
        <main>{children}</main>

        {/* Pied de page commun à toutes les pages */}
        <Footer />
      </body>
    </html>
  );
}
