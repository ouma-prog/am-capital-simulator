'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

const IDF_CITIES = [
  // Paris
  'Paris',
  // Hauts-de-Seine (92)
  'Nanterre','Boulogne-Billancourt','Courbevoie','Colombes','Asnières-sur-Seine','Rueil-Malmaison',
  'Levallois-Perret','Issy-les-Moulineaux','Clichy','Clamart','Meudon','Suresnes','Gennevilliers',
  'Puteaux','Montrouge','Neuilly-sur-Seine','Bagneux','Malakoff','Châtillon','Châtenay-Malabry',
  'Antony','Fontenay-aux-Roses','Ville-d’Avray','Saint-Cloud','Garches','Vaucresson',
  // Val-de-Marne (94)
  'Créteil','Vitry-sur-Seine','Champigny-sur-Marne','Saint-Maur-des-Fossés','Ivry-sur-Seine',
  'Villejuif','Maisons-Alfort','Alfortville','Choisy-le-Roi','Gentilly','Cachan','Arcueil',
  'L’Haÿ-les-Roses','Le Kremlin-Bicêtre','Fontenay-sous-Bois','Nogent-sur-Marne','Le Perreux-sur-Marne',
  'Vincennes','Charenton-le-Pont','Orly','Villeneuve-Saint-Georges','Thiais','Rungis','Fresnes',
  // Seine-Saint-Denis (93)
  'Saint-Denis','Aubervilliers','Pantin','La Courneuve','Drancy','Le Bourget','Bobigny','Montreuil',
  'Noisy-le-Grand','Bondy','Aulnay-sous-Bois','Sevran','Livry-Gargan','Villepinte','Gagny',
  // Yvelines (78)
  'Versailles','Saint-Germain-en-Laye','Mantes-la-Jolie','Sartrouville','Poissy','Houilles','Conflans-Sainte-Honorine',
  'Trappes','Rambouillet','Maisons-Laffitte','Le Chesnay-Rocquencourt',
  // Essonne (91)
  'Évry-Courcouronnes','Massy','Palaiseau','Savigny-sur-Orge','Sainte-Geneviève-des-Bois','Athis-Mons',
  'Viry-Châtillon','Juvisy-sur-Orge','Draveil','Vigneux-sur-Seine','Ris-Orangis','Longjumeau',
  // Seine-et-Marne (77)
  'Meaux','Melun','Fontainebleau','Chelles','Pontault-Combault','Lognes','Torcy','Noisiel','Serris',
  // Val-d’Oise (95)
  'Cergy','Pontoise','Argenteuil','Sarcelles','Gonesse','Garges-lès-Gonesse','Ermont','Franconville',
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function Highlight({ text, query }: { text: string; query: string }) {
  const nText = normalize(text);
  const nQuery = normalize(query);
  const idx = nText.indexOf(nQuery);
  if (!query || idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Paris, Arcueil, Montrouge…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState<string>(value ?? '');
  const [open, setOpen] = useState<boolean>(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const inputId = 'city-combobox';
  const listboxId = 'city-listbox';

  useEffect(() => {
    setQuery(value ?? '');
  }, [value]);

  const suggestions = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return IDF_CITIES.slice(0, 8);
    return IDF_CITIES.filter((c) => normalize(c).includes(q)).slice(0, 8);
  }, [query]);

  useEffect(() => {
    onChange(query);
  }, [query, onChange]);

  function choose(city: string) {
    setQuery(city);
    onChange(city);
    setOpen(false);
    setActiveIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && suggestions[activeIdx]) {
        e.preventDefault();
        choose(suggestions[activeIdx]);
      } else {
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!listRef.current || activeIdx < 0) return;
    const el = listRef.current.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const activeOptionId = activeIdx >= 0 ? `city-option-${activeIdx}` : undefined;

  return (
    <div className="relative">
      <input
        id={inputId}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIdx(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 120);
        }}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-am-gold)]"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
      />

      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          ref={listRef}
          role="listbox"
          className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded border bg-white shadow"
          aria-labelledby={inputId}
        >
          {suggestions.map((s, i) => {
            const id = `city-option-${i}`;
            const selected = i === activeIdx;
            return (
              <li
                id={id}
                key={s}
                role="option"
                aria-selected={selected}
                onMouseDown={() => choose(s)} 
                className={`px-3 py-2 cursor-pointer ${selected ? 'bg-slate-100' : ''}`}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <Highlight text={s} query={query} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
