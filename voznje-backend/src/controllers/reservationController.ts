import { Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const kreirajRezervaciju = async (req: AuthRequest, res: Response) => {
  try {
    const { voznjaId, brojRezervisanihMesta } = req.body;
    const korisnikId = req.korisnik!.id;

    if (!voznjaId || !brojRezervisanihMesta) {
      return res.status(400).json({ error: 'Nedostaju obavezna polja' });
    }

    const trazenoMesta = Number(brojRezervisanihMesta);

    if (trazenoMesta <= 0) {
      return res.status(400).json({ error: 'Broj mesta mora biti veći od nule' });
    }

    const rezultat = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const voznja = await tx.ride.findUnique({
        where: { id: Number(voznjaId) },
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
          voznjaId: Number(voznjaId),
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

      const novaRezervacija = await tx.reservation.create({
        data: {
          voznjaId: Number(voznjaId),
          korisnikId,
          brojRezervisanihMesta: trazenoMesta,
        },
      });

      return novaRezervacija;
    });

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