import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[22rem] md:h-[28rem]">
      <Image src="/images/archi.jpg" alt="" fill style={{objectFit:'cover'}} priority />
      <div className="absolute inset-0 bg-black/45" />
      <div className="max-w-7xl mx-auto px-4 absolute inset-0 flex flex-col justify-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold max-w-2xl">
          Simulez la rentabilité de votre investissement locatif
        </h1>
        <p className="mt-3 max-w-xl text-white/90">Données marché 2025, calculs en temps réel.</p>
        <a href="#simulation" className="mt-6 bg-[var(--color-am-gold)] hover:brightness-110 text-[var(--color-am-blue)] font-semibold px-6 py-3 rounded-full w-max">
          Commencer la simulation
        </a>
      </div>
    </section>
  );
}
