import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrujKorisnika } from '../api/auth';
import RutaPozadina from '../components/RutaPozadina';

export default function Register() {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [telefon, setTelefon] = useState('');
  const [uloga, setUloga] = useState<'PUTNIK' | 'VOZAC'>('PUTNIK');
  const [greska, setGreska] = useState('');
  const [ucitava, setUcitava] = useState(false);

  const navigate = useNavigate();

  const posaljiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska('');
    setUcitava(true);

    try {
      await registrujKorisnika({ ime, prezime, email, lozinka, telefon, uloga });
      navigate('/prijava');
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri registraciji');
    } finally {
      setUcitava(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-text relative overflow-hidden flex-col justify-between p-12">
        <RutaPozadina />
        <a href="/prijava" className="relative font-display font-bold text-2xl text-bg tracking-tight flex items-center gap-2">
          Convoy
          <span className="w-2 h-2 rounded-full bg-accent" />
        </a>

        <div className="relative">
          <h2 className="font-display font-bold text-4xl text-bg mb-4 leading-tight">
            Prvi korak
            <br />
            do saputnika.
          </h2>
          <ul className="space-y-3 mt-8">
            {[
              'Registruj se kao putnik ili vozač',
              'Objavi vožnju ili pronađi jednu koja ti odgovara',
              'Bez skrivenih troškova, bez čekanja',
            ].map((tekst) => (
              <li key={tekst} className="flex items-start gap-3 text-bg/70 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                {tekst}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-bg/40 text-xs">Convoy — 2026</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-bg px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 md:hidden">
            <a href="/prijava" className="font-display font-bold text-2xl text-text tracking-tight inline-flex items-center gap-2">
              Convoy
              <span className="w-2 h-2 rounded-full bg-accent" />
            </a>
          </div>

          <h1 className="font-display font-semibold text-2xl text-text mb-1">Napravi nalog</h1>
          <p className="text-sm text-text-soft mb-6">Traje manje od minuta</p>

          {greska && (
            <div className="bg-danger-soft text-danger text-sm p-3 rounded-md mb-4">{greska}</div>
          )}

          <form onSubmit={posaljiFormu} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-soft mb-1">Ime</label>
                <input
                  type="text"
                  value={ime}
                  onChange={(e) => setIme(e.target.value)}
                  required
                  className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-soft mb-1">Prezime</label>
                <input
                  type="text"
                  value={prezime}
                  onChange={(e) => setPrezime(e.target.value)}
                  required
                  className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-soft mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-soft mb-1">Lozinka</label>
              <input
                type="password"
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
                required
                className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-soft mb-1">Telefon</label>
              <input
                type="text"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-soft mb-1">Registrujem se kao</label>
              <select
                value={uloga}
                onChange={(e) => setUloga(e.target.value as 'PUTNIK' | 'VOZAC')}
                className="w-full bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              >
                <option value="PUTNIK">Putnik</option>
                <option value="VOZAC">Vozač</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={ucitava}
              className="w-full bg-accent text-white py-2.5 rounded-md font-display font-semibold text-sm hover:bg-accent-dark transition disabled:opacity-50"
            >
              {ucitava ? 'Kreiranje naloga...' : 'Registruj se'}
            </button>
          </form>

          <p className="text-sm text-text-soft mt-5 text-center">
            Već imaš nalog?{' '}
            <Link to="/prijava" className="text-accent font-medium">
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}