import { Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

const MAX_POKUSAJA = 3;

// Provera slobodnih mesta i upis rezervacije u jednoj Serializable transakciji.
// Ako dve transakcije istovremeno pokušaju da zauzmu ista mesta, baza jednu odbija
// (Prisma greška P2034), pa se ona ponavlja i tada vidi ažurno stanje.
const izvrsiRezervaciju = async (voznjaId: number, korisnikId: number, trazenoMesta: number) => {
  for (let pokusaj = 1; ; pokusaj++) {
    try {
      return await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const voznja = await tx.ride.findUnique({
            where: { id: voznjaId },
          });

          if (!voznja) {
            throw new Error('VOZNJA_NE_POSTOJI');
          }

          if (voznja.status !== 'AKTIVNA') {
            throw new Error('VOZNJA_NIJE_AKTIVNA');
          }

          if (voznja.vozacId === korisnikId) {
            throw new Error('VOZAC_NE_MOZE_REZERVISATI');
          }

          const potvrdjeneRezervacije = await tx.reservation.aggregate({
            where: {
              voznjaId,
              status: 'POTVRDJENA',
            },
            _sum: {
              brojRezervisanihMesta: true,
            },
          });

          const zauzetaMesta = potvrdjeneRezervacije._sum.brojRezervisanihMesta || 0;
          const dostupnaMesta = voznja.brojSlobodnihMesta - zauzetaMesta;

          if (trazenoMesta > dostupnaMesta) {
            throw new Error('NEDOVOLJNO_MESTA');
          }

          return tx.reservation.create({
            data: {
              voznjaId,
              korisnikId,
              brojRezervisanihMesta: trazenoMesta,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );
    } catch (error) {
      const konflikt =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034';
      if (!konflikt || pokusaj >= MAX_POKUSAJA) {
        throw error;
      }
    }
  }
};

export const kreirajRezervaciju = async (req: AuthRequest, res: Response) => {
  try {
    const { voznjaId, brojRezervisanihMesta } = req.body;
    const korisnikId = req.korisnik!.id;

    if (!voznjaId || !brojRezervisanihMesta) {
      return res.status(400).json({ error: 'Nedostaju obavezna polja' });
    }

    const trazenoMesta = Number(brojRezervisanihMesta);

    if (!Number.isInteger(trazenoMesta) || trazenoMesta <= 0) {
      return res.status(400).json({ error: 'Broj mesta mora biti ceo broj veći od nule' });
    }

    const rezultat = await izvrsiRezervaciju(Number(voznjaId), korisnikId, trazenoMesta);

    res.status(201).json({ rezervacija: rezultat });
  } catch (error: any) {
    if (error.message === 'VOZNJA_NE_POSTOJI') {
      return res.status(404).json({ error: 'Vožnja ne postoji' });
    }
    if (error.message === 'VOZNJA_NIJE_AKTIVNA') {
      return res.status(400).json({ error: 'Vožnja više nije aktivna' });
    }
    if (error.message === 'VOZAC_NE_MOZE_REZERVISATI') {
      return res.status(400).json({ error: 'Vozač ne može rezervisati sopstvenu vožnju' });
    }
    if (error.message === 'NEDOVOLJNO_MESTA') {
      return res.status(409).json({ error: 'Nema dovoljno slobodnih mesta' });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return res.status(409).json({ error: 'Previše istovremenih zahteva, pokušaj ponovo' });
    }

    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export const otkaziRezervaciju = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const korisnikId = req.korisnik!.id;

    const rezervacija = await prisma.reservation.findUnique({
      where: { id: Number(id) },
    });

    if (!rezervacija) {
      return res.status(404).json({ error: 'Rezervacija ne postoji' });
    }

    if (rezervacija.korisnikId !== korisnikId) {
      return res.status(403).json({ error: 'Ne možeš otkazati tuđu rezervaciju' });
    }

    if (rezervacija.status === 'OTKAZANA') {
      return res.status(400).json({ error: 'Rezervacija je već otkazana' });
    }

    const azuriranaRezervacija = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: 'OTKAZANA' },
    });

    res.status(200).json({ rezervacija: azuriranaRezervacija });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export const mojeRezervacije = async (req: AuthRequest, res: Response) => {
  try {
    const korisnikId = req.korisnik!.id;

    const rezervacije = await prisma.reservation.findMany({
      where: { korisnikId },
      include: {
        voznja: true,
      },
      orderBy: { datumRezervacije: 'desc' },
    });

    res.status(200).json({ rezervacije });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};