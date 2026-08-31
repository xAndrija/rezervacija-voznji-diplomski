import { useState, useRef, useEffect } from 'react';
import { GRADOVI_SRBIJE } from '../constants/gradovi';

interface Props {
  vrednost: string;
  onChange: (vrednost: string) => void;
  placeholder: string;
}

export default function AutoUnosGrada({ vrednost, onChange, placeholder }: Props) {
  const [fokusiran, setFokusiran] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtrirano =
    vrednost.length > 0
      ? GRADOVI_SRBIJE.filter((grad) => grad.toLowerCase().startsWith(vrednost.toLowerCase()))
      : GRADOVI_SRBIJE;

  useEffect(() => {
    const naKlikVan = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFokusiran(false);
      }
    };
    document.addEventListener('mousedown', naKlikVan);
    return () => document.removeEventListener('mousedown', naKlikVan);
  }, []);

  const ispraviIzListe = () => {
    if (vrednost.length === 0) return;
    const tacnoPoklapanje = GRADOVI_SRBIJE.find(
      (grad) => grad.toLowerCase() === vrednost.toLowerCase()
    );
    if (tacnoPoklapanje && tacnoPoklapanje !== vrednost) {
      onChange(tacnoPoklapanje);
    }
  };

  const naPritisakTastera = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    if (fokusiran && filtrirano.length > 0) {
      const tacnoPoklapanje = filtrirano.find(
        (grad) => grad.toLowerCase() === vrednost.toLowerCase()
      );

      if (tacnoPoklapanje) {
        if (tacnoPoklapanje !== vrednost) {
          e.preventDefault();
          onChange(tacnoPoklapanje);
          setFokusiran(false);
        } else {
          setFokusiran(false);
        }
      } else {
        e.preventDefault();
        onChange(filtrirano[0]);
        setFokusiran(false);
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <input
        type="text"
        value={vrednost}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFokusiran(true)}
        onBlur={ispraviIzListe}
        onKeyDown={naPritisakTastera}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-soft focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
      />

      {fokusiran && filtrirano.length > 0 && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-md shadow-lg max-h-56 overflow-y-auto">
          {filtrirano.map((grad) => (
            <button
              key={grad}
              type="button"
              onClick={() => {
                onChange(grad);
                setFokusiran(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-text hover:bg-bg transition"
            >
              {grad}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}