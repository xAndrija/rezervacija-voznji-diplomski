import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { preuzmiVoznju } from '../api/rides';
import { napraviRezervaciju } from '../api/reservations';
import { useAuth } from '../context/AuthContext';
import Navigacija from '../components/Navigacija';
import RutaLinija from '../components/RutaLinija';
import NazadDugme from '../components/NazadDugme';
import StatusOznaka from '../components/StatusOznaka';
import SeatIndikator from '../components/SeatIndikator';
import { formatDatumVreme } from '../utils/format';

export default function DetaljiVoznje() {
  const { id } = useParams();
  const { korisnik } = useAuth();

  const [voznja, setVoznja] = useState<any>(null);
  const [brojMesta, setBrojMesta] = useState(1);
  const [ucitava, setUcitava] = useState(true);
  const [rezervisemSe, setRezervisemSe] = useState(false);
  const [greska, setGreska] = useState('');
  const [uspeh, setUspeh] = useState('');

  const ucitajVoznju = async () => {
    setUcitava(true);
    try {
      const podaci = await preuzmiVoznju(Number(id));
      setVoznja(podaci);
    } catch (err) {
      console.error(err);
    } finally {
      setUcitava(false);
    }
  };

  useEffect(() => {
    ucitajVoznju();
  }, [id]);

  const rezervisi = async () => {
    setGreska('');
    setUspeh('');
    setRezervisemSe(true);

    try {
      await napraviRezervaciju(Number(id), brojMesta);
      setUspeh('Rezervacija je uspešno napravljena!');
      ucitajVoznju();
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri rezervaciji');
    } finally {
      setRezervisemSe(false);
    }
  };

  if (ucitava) {
    return (
      <div className="min-h-screen bg-bg">
        <Navigacija />
        <p className="text-center mt-16 text-text-soft text-sm">Učitavanje...</p>
      </div>
    );
  }

  if (!voznja) {
    return (
      <div className="min-h-screen bg-bg">
        <Navigacija />
        <p className="text-center mt-16 text-text-soft text-sm">Vožnja nije pronađena</p>
      </div>
    );
  }

  const zauzetaMesta = voznja.rezervacije?.reduce(
    (zbir: number, r: any) => zbir + r.brojRezervisanihMesta,
    0
  ) || 0;
  const dostupnaMesta = voznja.brojSlobodnihMesta - zauzetaMesta;
  const jeVozac = korisnik?.id === voznja.vozac.id;

  return (
    <div className="min-h-screen bg-bg">
      <Navigacija />

      <div className="max-w-xl mx-auto px-4 py-8">
        <NazadDugme to="/voznje" tekst="Nazad na listu" />

        <div className="bg-surface border border-border rounded-lg overflow-hidden mt-5">
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <RutaLinija polazna={voznja.polaznaLokacija} odredisna={voznja.odredisnaLokacija} velicina="lg" />
              <StatusOznaka status={voznja.status} />
            </div>
            <p className="text-sm text-text-soft mb-5">{formatDatumVreme(voznja.datumVremePolaska)}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-soft mb-1">Vozač</p>
                <p className="font-medium text-text">{voznja.vozac.ime} {voznja.vozac.prezime}</p>
              </div>
              <div>
                <p className="text-xs text-text-soft mb-1">Cena po mestu</p>
                <p className="font-medium text-text">{voznja.cenaPoMestu} RSD</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <SeatIndikator ukupno={voznja.brojSlobodnihMesta} zauzeto={zauzetaMesta} />
              <span className="text-xs text-text-soft">{dostupnaMesta} slobodno</span>
            </div>
          </div>

          <div className="px-6 py-5 bg-bg border-t border-border">
            {greska && (
              <div className="bg-danger-soft text-danger text-sm p-3 rounded-md mb-4">{greska}</div>
            )}
            {uspeh && (
              <div className="bg-teal/10 text-teal text-sm p-3 rounded-md mb-4">{uspeh}</div>
            )}

            {jeVozac ? (
              <p className="text-sm text-text-soft italic">Ovo je tvoja vožnja, ne možeš je rezervisati.</p>
            ) : dostupnaMesta <= 0 ? (
              <p className="text-sm text-danger font-medium">Nema više slobodnih mesta.</p>
            ) : (
              <div className="flex items-end gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-soft mb-1">Broj mesta</label>
                  <div className="flex items-center border border-border rounded-md overflow-hidden w-32 bg-surface">
                    <button
                      type="button"
                      onClick={() => setBrojMesta((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-2 text-text-soft hover:bg-bg font-medium"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={dostupnaMesta}
                      value={brojMesta}
                      onChange={(e) => {
                        const vrednost = Number(e.target.value);
                        if (vrednost >= 1 && vrednost <= dostupnaMesta) {
                          setBrojMesta(vrednost);
                        }
                      }}
                      className="w-12 text-center bg-surface border-x border-border py-2 text-text focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setBrojMesta((prev) => Math.min(dostupnaMesta, prev + 1))}
                      className="px-3 py-2 text-text-soft hover:bg-bg font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={rezervisi}
                  disabled={rezervisemSe}
                  className="bg-accent text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-accent-dark transition disabled:opacity-50"
                >
                  {rezervisemSe ? 'Rezervišem...' : 'Rezerviši'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}