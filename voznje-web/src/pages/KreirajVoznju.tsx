import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kreirajVoznju } from '../api/rides';
import { useAuth } from '../context/AuthContext';
import Navigacija from '../components/Navigacija';
import NazadDugme from '../components/NazadDugme';
import AutoUnosGrada from '../components/AutoUnosGrada';

export default function KreirajVoznju() {
  const { korisnik } = useAuth();
  const navigate = useNavigate();

  const [polaznaLokacija, setPolaznaLokacija] = useState('');
  const [odredisnaLokacija, setOdredisnaLokacija] = useState('');
  const [datumPolaska, setDatumPolaska] = useState('');
  const [vremePolaska, setVremePolaska] = useState('');
  const [brojSlobodnihMesta, setBrojSlobodnihMesta] = useState(1);
  const [cenaPoMestu, setCenaPoMestu] = useState(0);
  const [greska, setGreska] = useState('');
  const [ucitava, setUcitava] = useState(false);

  if (korisnik?.uloga !== 'VOZAC') {
    return (
      <div className="min-h-screen bg-bg">
        <Navigacija />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-surface border border-border p-6 rounded-lg">
            <p className="text-text mb-3">Samo vozači mogu da kreiraju vožnje.</p>
            <NazadDugme to="/voznje" tekst="Nazad na listu" />
          </div>
        </div>
      </div>
    );
  }

  const posaljiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska('');
    setUcitava(true);

    try {
      const novaVoznja = await kreirajVoznju({
        polaznaLokacija,
        odredisnaLokacija,
        datumVremePolaska: new Date(`${datumPolaska}T${vremePolaska}`).toISOString(),
        brojSlobodnihMesta,
        cenaPoMestu,
      });
      navigate(`/voznje/${novaVoznja.id}`);
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri kreiranju vožnje');
    } finally {
      setUcitava(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navigacija />

      <div className="max-w-xl mx-auto px-4 py-8">
        <NazadDugme to="/moje-voznje" tekst="Nazad" />

        <div className="bg-surface border border-border rounded-lg p-6 mt-5">
          <h1 className="font-display font-semibold text-lg text-text mb-5">Nova vožnja</h1>

          {greska && (
            <div className="bg-danger-soft text-danger text-sm p-3 rounded-md mb-4">{greska}</div>
          )}

          <form onSubmit={posaljiFormu} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-soft mb-1">Polazna lokacija</label>
                <AutoUnosGrada vrednost={polaznaLokacija} onChange={setPolaznaLokacija} placeholder="Izaberi ili ukucaj grad" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-soft mb-1">Odredišna lokacija</label>
                <AutoUnosGrada vrednost={odredisnaLokacija} onChange={setOdredisnaLokacija} placeholder="Izaberi ili ukucaj grad" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-soft mb-1">Datum polaska</label>
                <input
                  type="date"
                  value={datumPolaska}
                  onChange={(e) => setDatumPolaska(e.target.value)}
                  required
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-soft mb-1">Vreme polaska</label>
                <input
                  type="time"
                  value={vremePolaska}
                  onChange={(e) => setVremePolaska(e.target.value)}
                  required
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-soft mb-1">Broj slobodnih mesta</label>
                <input
                  type="number"
                  min={1}
                  value={brojSlobodnihMesta === 0 ? '' : brojSlobodnihMesta}
                  onChange={(e) => setBrojSlobodnihMesta(e.target.value === '' ? 0 : Number(e.target.value))}
                  required
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-soft mb-1">Cena po mestu (RSD)</label>
                <input
                  type="number"
                  min={0}
                  value={cenaPoMestu === 0 ? '' : cenaPoMestu}
                  onChange={(e) => setCenaPoMestu(e.target.value === '' ? 0 : Number(e.target.value))}
                  required
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={ucitava}
              className="w-full bg-accent text-white py-2.5 rounded-md font-medium text-sm hover:bg-accent-dark transition disabled:opacity-50"
            >
              {ucitava ? 'Kreiranje...' : 'Kreiraj vožnju'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}