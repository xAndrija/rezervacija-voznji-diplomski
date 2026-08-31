import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { preuzmiMojeVoznjeKaoVozac, obrisiVoznju, otkaziVoznju } from '../api/rides';
import Navigacija from '../components/Navigacija';
import RutaLinija from '../components/RutaLinija';
import NazadDugme from '../components/NazadDugme';
import SeatIndikator from '../components/SeatIndikator';
import StatusOznaka from '../components/StatusOznaka';
import { formatDatumVreme } from '../utils/format';

function inicijali(ime: string, prezime: string) {
  return `${ime.charAt(0)}${prezime.charAt(0)}`.toUpperCase();
}

export default function MojeVoznje() {
  const [voznje, setVoznje] = useState<any[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState('');
  const [akcijaId, setAkcijaId] = useState<number | null>(null);

  const ucitajVoznje = async () => {
    setUcitava(true);
    try {
      const podaci = await preuzmiMojeVoznjeKaoVozac();
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

  const obrisi = async (id: number) => {
    if (!confirm('Da li si siguran da želiš da obrišeš ovu vožnju?')) return;

    setGreska('');
    setAkcijaId(id);
    try {
      await obrisiVoznju(id);
      ucitajVoznje();
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri brisanju vožnje');
    } finally {
      setAkcijaId(null);
    }
  };

  const otkazi = async (id: number) => {
    if (!confirm('Da li si siguran da želiš da otkažeš ovu vožnju? Svi putnici će izgubiti rezervaciju.')) return;

    setGreska('');
    setAkcijaId(id);
    try {
      await otkaziVoznju(id);
      ucitajVoznje();
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri otkazivanju vožnje');
    } finally {
      setAkcijaId(null);
    }
  };

  const aktivne = voznje.filter((v) => v.status === 'AKTIVNA');
  const neaktivne = voznje.filter((v) => v.status !== 'AKTIVNA');
  const ukupnoPutnika = voznje.reduce((zbir, v) => zbir + (v.rezervacije?.length || 0), 0);

  const KarticaVoznje = ({ voznja }: { voznja: any }) => {
    const brojRezervacija = voznja.rezervacije?.length || 0;
    const zauzetaMesta = voznja.rezervacije?.reduce(
      (zbir: number, r: any) => zbir + r.brojRezervisanihMesta,
      0
    ) || 0;
    const imaRezervacije = brojRezervacija > 0;
    const zarada = zauzetaMesta * Number(voznja.cenaPoMestu);

    return (
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <RutaLinija polazna={voznja.polaznaLokacija} odredisna={voznja.odredisnaLokacija} velicina="sm" />
            <StatusOznaka status={voznja.status} />
          </div>

          <p className="text-sm text-text-soft mb-4">{formatDatumVreme(voznja.datumVremePolaska)}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SeatIndikator ukupno={voznja.brojSlobodnihMesta} zauzeto={zauzetaMesta} />
              <span className="text-xs text-text-soft">
                {zauzetaMesta}/{voznja.brojSlobodnihMesta} mesta
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-soft">Zarada</p>
              <p className="font-medium text-text">{zarada || 0} RSD</p>
            </div>
          </div>
        </div>

        {imaRezervacije && (
          <div className="px-5 py-4 bg-bg border-t border-border">
            <p className="text-xs text-text-soft mb-2.5">Putnici</p>
            <ul className="space-y-2">
              {voznja.rezervacije.map((rez: any) => (
                <li key={rez.id} className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {inicijali(rez.korisnik.ime, rez.korisnik.prezime)}
                  </span>
                  <span className="text-sm text-text">
                    {rez.korisnik.ime} {rez.korisnik.prezime}
                    <span className="text-text-soft"> · {rez.brojRezervisanihMesta} mesta</span>
                    {rez.korisnik.telefon && (
                      <span className="text-text-soft"> · {rez.korisnik.telefon}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {voznja.status === 'AKTIVNA' && (
          <div className="px-5 py-3 bg-bg border-t border-border flex justify-end">
            {imaRezervacije ? (
              <button
                onClick={() => otkazi(voznja.id)}
                disabled={akcijaId === voznja.id}
                className="text-sm text-accent font-medium hover:underline disabled:opacity-50"
              >
                {akcijaId === voznja.id ? 'Otkazujem...' : 'Otkaži vožnju'}
              </button>
            ) : (
              <button
                onClick={() => obrisi(voznja.id)}
                disabled={akcijaId === voznja.id}
                className="text-sm text-danger font-medium hover:underline disabled:opacity-50"
              >
                {akcijaId === voznja.id ? 'Brišem...' : 'Obriši vožnju'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navigacija />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <NazadDugme to="/voznje" tekst="Nazad na listu vožnji" />

        <div className="flex justify-between items-center mt-5 mb-1">
          <h1 className="font-display font-semibold text-xl text-text">Moje vožnje</h1>
          <Link
            to="/kreiraj-voznju"
            className="bg-accent text-white px-3.5 py-2 rounded-md text-sm font-medium hover:bg-accent-dark transition"
          >
            + Nova vožnja
          </Link>
        </div>

        {!ucitava && voznje.length > 0 && (
          <p className="text-sm text-text-soft mb-6">
            {voznje.length} {voznje.length === 1 ? 'vožnja' : 'vožnji'} ukupno · {aktivne.length} aktivnih · {ukupnoPutnika} putnika
          </p>
        )}
        {!ucitava && voznje.length === 0 && <div className="mb-6" />}

        {greska && (
          <div className="bg-danger-soft text-danger text-sm p-3 rounded-md mb-4">{greska}</div>
        )}

        {ucitava ? (
          <p className="text-center text-text-soft text-sm py-8">Učitavanje...</p>
        ) : voznje.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-border rounded-lg">
            <p className="text-text-soft text-sm mb-3">Nemaš nijednu kreiranu vožnju</p>
            <Link to="/kreiraj-voznju" className="text-accent text-sm font-medium hover:underline">
              Napravi svoju prvu vožnju →
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
                  Nemaš aktivnih vožnji
                </p>
              ) : (
                <div className="space-y-4">
                  {aktivne.map((voznja) => (
                    <KarticaVoznje key={voznja.id} voznja={voznja} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm text-text-soft mb-3">
                Neaktivne <span className="text-text">({neaktivne.length})</span>
              </h2>
              {neaktivne.length === 0 ? (
                <p className="text-sm text-text-soft py-6 text-center border border-dashed border-border rounded-lg">
                  Nemaš neaktivnih vožnji
                </p>
              ) : (
                <div className="space-y-4">
                  {neaktivne.map((voznja) => (
                    <KarticaVoznje key={voznja.id} voznja={voznja} />
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