import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function inicijali(ime?: string, prezime?: string) {
  if (!ime || !prezime) return '?';
  return `${ime.charAt(0)}${prezime.charAt(0)}`.toUpperCase();
}

export default function Navigacija() {
  const { korisnik, izlogujSe } = useAuth();
  const navigate = useNavigate();

  const linkKlasa = ({ isActive }: { isActive: boolean }) =>
    `text-base font-medium pb-1 border-b-2 transition ${
      isActive
        ? 'text-accent border-accent'
        : 'text-text-soft border-transparent hover:text-text'
    }`;

  return (
    <nav className="bg-surface shadow-sm shadow-black/[0.03] border-b border-border px-8 py-4 flex justify-between items-center">
      <a href="/voznje" className="font-display font-bold text-2xl text-text tracking-tight flex items-center gap-2">
        Convoy
        <span className="w-2 h-2 rounded-full bg-accent" />
      </a>

      <div className="flex items-center gap-7">
        <NavLink to="/voznje" className={linkKlasa} end>
          Vožnje
        </NavLink>
        <NavLink to="/moje-rezervacije" className={linkKlasa}>
          Moje rezervacije
        </NavLink>
        {korisnik?.uloga === 'VOZAC' && (
          <NavLink to="/moje-voznje" className={linkKlasa}>
            Moje vožnje
          </NavLink>
        )}

        <div className="w-px h-6 bg-border" />

        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-accent/10 text-accent text-sm font-semibold flex items-center justify-center flex-shrink-0">
            {inicijali(korisnik?.ime, korisnik?.prezime)}
          </span>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-text">{korisnik?.ime}</p>
            <p className="text-xs text-text-soft">{korisnik?.uloga === 'VOZAC' ? 'Vozač' : 'Putnik'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            izlogujSe();
            navigate('/prijava');
          }}
          className="text-sm text-text-soft hover:text-danger font-medium transition"
        >
          Odjava
        </button>
      </div>
    </nav>
  );
}