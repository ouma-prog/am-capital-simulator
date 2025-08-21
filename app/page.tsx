import Header from './components/Header';
import Hero from './components/Hero';
import SimulatorModule from './components/SimulatorPage';

// Composant de page principale ("/")
export default function Page() {
  return (
    <>
      {/* En-tête du site (logo, navigation…) */}
      <Header />

      {/* Section Hero : bandeau d’accueil  */}
      <Hero />

      {/* Section Simulation */}
      <main id="simulation" className="max-w-7xl mx-auto px-4 py-10">
        {/* Titre de la section */}
        <h2 className="text-2xl font-semibold mb-6">Simulation</h2>

        {/* Module de simulation complet */}
        <SimulatorModule />
      </main>
    </>
  );
}
