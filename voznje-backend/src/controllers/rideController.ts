import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

const azurirajIstekleVoznje = async (vozacId?: number) => {
  await prisma.ride.updateMany({
    where: {
      status: 'AKTIVNA',
      datumVremePolaska: { lt: new Date() },
      ...(vozacId ? { vozacId } : {}),
    },
    data: {
      status: 'ZAVRSENA',
    },
  });
};

export const kreirajVoznju = async (req: AuthRequest, res: Response) => {
  try {
    const { polaznaLokacija, odredisnaLokacija, datumVremePolaska, brojSlobodnihMesta, cenaPoMestu } = req.body;

    if (!polaznaLokacija || !odredisnaLokacija || !datumVremePolaska || !brojSlobodnihMesta || !cenaPoMestu) {
      return res.status(400).json({ error: 'Nedostaju obavezna polja' });
    }

    if (polaznaLokacija.trim().length < 2 || odredisnaLokacija.trim().length < 2) {
      return res.status(400).json({ error: 'Lokacija mora imati najmanje 2 karaktera' });
    }

    if (polaznaLokacija.trim().toLowerCase() === odredisnaLokacija.trim().toLowerCase()) {
      return res.status(400).json({ error: 'Polazna i odredišna lokacija ne mogu biti iste' });
    }

    const mesta = Number(brojSlobodnihMesta);
    if (!Number.isInteger(mesta) || mesta < 1 || mesta > 8) {
      return res.status(400).json({ error: 'Broj slobodnih mesta mora biti između 1 i 8' });
    }

    const cena = Number(cenaPoMestu);
    if (!Number.isFinite(cena) || cena <= 0 || cena > 100000) {
      return res.status(400).json({ error: 'Cena po mestu mora biti realna vrednost veća od 0' });
    }

    const datumPolaska = new Date(datumVremePolaska);
    if (isNaN(datumPolaska.getTime())) {
      return res.status(400).json({ error: 'Nevažeći datum' });
    }
    if (datumPolaska.getTime() < Date.now()) {
      return res.status(400).json({ error: 'Datum polaska mora biti u budućnosti' });
    }

    const vozacId = req.korisnik!.id;

    const novaVoznja = await prisma.ride.create({
      data: {
        polaznaLokacija: polaznaLokacija.trim(),
        odredisnaLokacija: odredisnaLokacija.trim(),
        datumVremePolaska: datumPolaska,
        brojSlobodnihMesta: mesta,
        cenaPoMestu: cena,
        vozacId,
      },
    });

    res.status(201).json({ voznja: novaVoznja });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export const pregledajVoznje = async (req: AuthRequest, res: Response) => {
  try {
    await azurirajIstekleVoznje();

    const { polaznaLokacija, odredisnaLokacija, datum } = req.query;

    const sada = new Date();

    const filteri: any = {
      status: 'AKTIVNA',
    };

    if (polaznaLokacija) {
      filteri.polaznaLokacija = { contains: String(polaznaLokacija), mode: 'insensitive' };
    }
    if (odredisnaLokacija) {
      filteri.odredisnaLokacija = { contains: String(odredisnaLokacija), mode: 'insensitive' };
    }

    if (datum) {
      const pocetakDana = new Date(String(datum));
      const krajDana = new Date(String(datum));
      krajDana.setHours(23, 59, 59, 999);

      filteri.datumVremePolaska = {
        gte: pocetakDana > sada ? pocetakDana : sada,
        lte: krajDana,
      };
    } else {
      filteri.datumVremePolaska = { gte: sada };
    }

    const voznje = await prisma.ride.findMany({
      where: filteri,
      include: {
        vozac: {
          select: { id: true, ime: true, prezime: true },
        },
      },
      orderBy: { datumVremePolaska: 'asc' },
    });

    res.status(200).json({ voznje });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export const pregledajVoznju = async (req: AuthRequest, res: Response) => {
  try {
    await azurirajIstekleVoznje();

    const { id } = req.params;

    const voznja = await prisma.ride.findUnique({
      where: { id: Number(id) },
      include: {
        vozac: {
          select: { id: true, ime: true, prezime: true },
        },
        rezervacije: {
          where: { status: 'POTVRDJENA' },
        },
      },
    });

    if (!voznja) {
      return res.status(404).json({ error: 'Vožnja nije pronađena' });
    }

    res.status(200).json({ voznja });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export const mojeVoznjeKaoVozac = async (req: AuthRequest, res: Response) => {
  try {
    const vozacId = req.korisnik!.id;
    await azurirajIstekleVoznje(vozacId);

    const voznje = await prisma.ride.findMany({
      where: { vozacId },
      include: {
        rezervacije: {
          where: { status: 'POTVRDJENA' },
          include: {
            korisnik: {
              select: { id: true, ime: true, prezime: true, telefon: true },
            },
          },
        },
      },
      orderBy: { datumVremePolaska: 'asc' },
    });

    res.status(200).json({ voznje });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export const obrisiVoznju = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const vozacId = req.korisnik!.id;

    const voznja = await prisma.ride.findUnique({
      where: { id: Number(id) },
      include: {
        rezervacije: {
          where: { status: 'POTVRDJENA' },
        },
      },
    });

    if (!voznja) {
      return res.status(404).json({ error: 'Vožnja ne postoji' });
    }

    if (voznja.vozacId !== vozacId) {
      return res.status(403).json({ error: 'Ne možeš obrisati tuđu vožnju' });
    }

    if (voznja.rezervacije.length > 0) {
      return res.status(409).json({ error: 'Ne možeš obrisati vožnju koja ima aktivne rezervacije. Otkaži vožnju umesto brisanja.' });
    }

    await prisma.ride.delete({ where: { id: Number(id) } });

    res.status(200).json({ poruka: 'Vožnja je obrisana' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export const otkaziVoznju = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const vozacId = req.korisnik!.id;

    const voznja = await prisma.ride.findUnique({ where: { id: Number(id) } });

    if (!voznja) {
      return res.status(404).json({ error: 'Vožnja ne postoji' });
    }

    if (voznja.vozacId !== vozacId) {
      return res.status(403).json({ error: 'Ne možeš otkazati tuđu vožnju' });
    }

    const azurirana = await prisma.ride.update({
      where: { id: Number(id) },
      data: { status: 'OTKAZANA' },
    });

    res.status(200).json({ voznja: azurirana });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};