import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { preuzmiVoznje, type Voznja } from '../api/rides';
import Navigacija from '../components/Navigacija';
import RutaLinija from '../components/RutaLinija';
import AutoUnosGrada from '../components/AutoUnosGrada';
import mapaSlika from '../assets/mapa.jpg';

const POPULARNE_RUTE = [
  { polazna: 'Beograd', odredisna: 'Novi Sad' },
  { polazna: 'Beograd', odredisna: 'Niš' },
  { polazna: 'Novi Sad', odredisna: 'Subotica' },
  { polazna: 'Beograd', odredisna: 'Kragujevac' },
];

export default function ListaVoznji() {
  const [voznje, setVoznje] = useState<Voznja[]>([]);
  const [polaznaLokacija, setPolaznaLokacija] = useState('');
  const [odredisnaLokacija, setOdredisnaLokacija] = useState('');
  const [ucitava, setUcitava] = useState(true);

  const ucitajVoznje = async (polazna?: string, odredisna?: string) => {
    setUcitava(true);
    try {
      const podaci = await preuzmiVoznje({
        polaznaLokacija: (polazna ?? polaznaLokacija) || undefined,
        odredisnaLokacija: (odredisna ?? odredisnaLokacija) || undefined,
      });
      setVoznje(podaci);
    } catch (err) {
      console.error(err);
    } finally {
      setUcitava(false);
    }
  };

  useEffect(() => {
    ucitajVoznje();
  }, []);

  const pretrazi = (e: React.FormEvent) => {
    e.preventDefault();
    ucitajVoznje();
  };

  const izaberiPopularnuRutu = (polazna: string, odredisna: string) => {
    setPolaznaLokacija(polazna);
    setOdredisnaLokacija(odredisna);
    ucitajVoznje(polazna, odredisna);
  };

  const gradovi = new Set<string>();
  voznje.forEach((v) => {
    gradovi.add(v.polaznaLokacija);
    gradovi.add(v.odredisnaLokacija);
  });

  const najjeftinija = voznje.length > 0
    ? Math.min(...voznje.map((v) => Number(v.cenaPoMestu)))
    : null;

  return (
    <div className="min-h-screen bg-bg">
      <Navigacija />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-text mb-3 leading-tight">
              Gde god kreneš,
              <br />
              neko već ide tim putem.
            </h1>
            <p className="text-text-soft max-w-sm">
              Pretraži dostupne vožnje širom Srbije i pronađi saputnika za svoj put.
            </p>
          </div>

          <div className="relative rounded-xl border border-border overflow-hidden">
            <img src={mapaSlika} alt="Mapa" className="w-full h-56 object-cover" />
          </div>
        </div>

        <form onSubmit={pretrazi} className="flex gap-2 mb-8 bg-surface border-2 border-accent/15 rounded-xl p-3 shadow-lg shadow-accent/10">
          <AutoUnosGrada vrednost={polaznaLokacija} onChange={setPolaznaLokacija} placeholder="Odakle krećeš" />
          <AutoUnosGrada vrednost={odredisnaLokacija} onChange={setOdredisnaLokacija} placeholder="Gde ideš" />
          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-accent-dark transition"
          >
            Pretraži
          </button>
        </form>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-sm text-text-soft">
                {ucitava ? 'Pretraga...' : `${voznje.length} ${voznje.length === 1 ? 'vožnja' : 'vožnji'}`}
              </h2>
            </div>

            {ucitava ? (
              <p className="text-center text-text-soft text-sm py-8">Učitavanje...</p>
            ) : voznje.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-text-soft text-sm">Nema vožnji koje odgovaraju pretrazi. Probaj drugu rutu.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {voznje.map((voznja) => (
                  <Link
                    key={voznja.id}
                    to={`/voznje/${voznja.id}`}
                    className="flex justify-between items-center p-4 bg-surface border border-border rounded-lg hover:border-accent/40 transition"
                  >
                    <div className="space-y-1">
                      <RutaLinija polazna={voznja.polaznaLokacija} odredisna={voznja.odredisnaLokacija} velicina="sm" />
                      <p className="text-sm text-text-soft">
                        {new Date(voznja.datumVremePolaska).toLocaleString('sr-RS', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' · '}{voznja.vozac.ime} {voznja.vozac.prezime}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 pl-4">
                      <p className="font-medium text-text">{voznja.cenaPoMestu} RSD</p>
                      <p className="text-xs text-teal">{voznja.brojSlobodnihMesta} mesta</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <p className="text-xs text-text-soft uppercase tracking-wide">Trenutno na mreži</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-soft">Aktivnih vožnji</span>
                  <span className="text-sm font-semibold text-text bg-bg border border-border px-2.5 py-1 rounded-md">
                    {voznje.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-soft">Gradova povezano</span>
                  <span className="text-sm font-semibold text-text bg-bg border border-border px-2.5 py-1 rounded-md">
                    {gradovi.size}
                  </span>
                </div>
                {najjeftinija !== null && (
                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <span className="text-sm text-text-soft">Najniža cena</span>
                    <span className="text-sm font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-md">
                      {najjeftinija} RSD
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                <p className="text-xs text-text-soft uppercase tracking-wide">Popularne rute</p>
              </div>
              <div className="space-y-1">
                {POPULARNE_RUTE.map((ruta) => (
                  <button
                    key={`${ruta.polazna}-${ruta.odredisna}`}
                    onClick={() => izaberiPopularnuRutu(ruta.polazna, ruta.odredisna)}
                    className="w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 rounded-md text-sm text-text hover:bg-bg transition group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-accent transition" />
                      {ruta.polazna} → {ruta.odredisna}
                    </span>
                    <span className="text-text-soft group-hover:text-accent transition">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}