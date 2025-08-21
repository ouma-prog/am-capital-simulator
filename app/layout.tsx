import "./globals.css";
import Footer from "./components/Footer";

// ✅ Les metadata doivent être déclarées en dehors du composant
export const metadata = {
  title: "A&M Capital – Simulateur d’investissement",
  description: "Simulateur locatif interactif par A&M Capital",
  icons: {
    icon: "/images/logoA&M.png", // mets ton logo dans /public/logo.png
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
