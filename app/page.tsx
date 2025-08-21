import Header from './components/Header';
import Hero from './components/Hero';
import SimulatorModule from './components/SimulatorPage';

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <main id="simulation" className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">Simulation</h2>
        <SimulatorModule />
      </main>
    </>
  );
}
