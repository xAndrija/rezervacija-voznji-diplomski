import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { preuzmiMojeRezervacije, otkaziRezervaciju, type Rezervacija } from '../api/reservations';
import Navigacija from '../components/Navigacija';
import RutaLinija from '../components/RutaLinija';
import NazadDugme from '../components/NazadDugme';
import StatusOznaka from '../components/StatusOznaka';
import { formatDatumVreme } from '../utils/format';

export default function MojeRezervacije() {
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [otkazujemId, setOtkazujemId] = useState<number | null>(null);

  const ucitajRezervacije = async () => {
    setUcitava(true);
    try {
      const podaci = await preuzmiMojeRezervacije();
      setRezervacije(podaci);
    } catch (err) {
      console.error(err);
    } finally {
      setUcitava(false);
    }
  };

  useEffect(() => {
    ucitajRezervacije();
  }, []);

  const otkazi = async (id: number) => {
    setOtkazujemId(id);
    try {
      await otkaziRezervaciju(id);
      ucitajRezervacije();
    } catch (err) {
      console.error(err);
    } finally {
      setOtkazujemId(null);
    }
  };

  const aktivne = rezervacije.filter((r) => r.status === 'POTVRDJENA');
  const otkazane = rezervacije.filter((r) => r.status !== 'POTVRDJENA');

  const KarticaRezervacije = ({ rez }: { rez: Rezervacija }) => (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          {rez.voznja && (
            <RutaLinija polazna={rez.voznja.polaznaLokacija} odredisna={rez.voznja.odredisnaLokacija} velicina="sm" />
          )}
          <StatusOznaka status={rez.status} />
        </div>

        {rez.voznja?.datumVremePolaska && (
          <p className="text-sm text-text-soft mb-4">{formatDatumVreme(rez.voznja.datumVremePolaska)}</p>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-text-soft">{rez.brojRezervisanihMesta} mesta</p>
          {rez.voznja?.cenaPoMestu && (
            <p className="font-medium text-text">
              {Number(rez.voznja.cenaPoMestu) * rez.brojRezervisanihMesta} RSD
            </p>
          )}
        </div>
      </div>

      {rez.status === 'POTVRDJENA' && (
        <div className="px-5 py-3 bg-bg border-t border-border flex justify-end">
          <button
            onClick={() => otkazi(rez.id)}
            disabled={otkazujemId === rez.id}
            className="text-sm text-danger font-medium hover:underline disabled:opacity-50"
          >
            {otkazujemId === rez.id ? 'Otkazujem...' : 'Otkaži rezervaciju'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      <Navigacija />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <NazadDugme to="/voznje" tekst="Nazad na listu vožnji" />

        <h1 className="font-display font-semibold text-xl text-text mt-5 mb-6">Moje rezervacije</h1>

        {ucitava ? (
          <p className="text-center text-text-soft text-sm py-8">Učitavanje...</p>
        ) : rezervacije.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-border rounded-lg">
            <p className="text-text-soft text-sm mb-3">Nemaš nijednu rezervaciju</p>
            <Link to="/voznje" className="text-accent text-sm font-medium hover:underline">
              Pronađi vožnju →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm text-text-soft mb-3">
                Aktivne <span className="text-text">({aktivne.length})</span>
              </h2>
              {aktivne.length === 0 ? (
                <p className="text-sm text-text-soft py-6 text-center border border-dashed border-border rounded-lg">
                  Nemaš aktivnih rezervacija
                </p>
              ) : (
                <div className="space-y-3">
                  {aktivne.map((rez) => (
                    <KarticaRezervacije key={rez.id} rez={rez} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm text-text-soft mb-3">
                Otkazane <span className="text-text">({otkazane.length})</span>
              </h2>
              {otkazane.length === 0 ? (
                <p className="text-sm text-text-soft py-6 text-center border border-dashed border-border rounded-lg">
                  Nemaš otkazanih rezervacija
                </p>
              ) : (
                <div className="space-y-3">
                  {otkazane.map((rez) => (
                    <KarticaRezervacije key={rez.id} rez={rez} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}