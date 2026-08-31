import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'tajni_kljuc_promeni_ovo';

export const register = async (req: Request, res: Response) => {
  try {
    const { ime, prezime, email, lozinka, telefon, uloga } = req.body;

    if (!ime || !prezime || !email || !lozinka) {
      return res.status(400).json({ error: 'Nedostaju obavezna polja' });
    }

    const postojeciKorisnik = await prisma.user.findUnique({ where: { email } });
    if (postojeciKorisnik) {
      return res.status(409).json({ error: 'Korisnik sa ovim emailom već postoji' });
    }

    const hashLozinke = await bcrypt.hash(lozinka, 10);

    const noviKorisnik = await prisma.user.create({
      data: {
        ime,
        prezime,
        email,
        lozinka: hashLozinke,
        telefon,
        uloga: uloga || 'PUTNIK',
      },
    });

    const { lozinka: _, ...korisnikBezLozinke } = noviKorisnik;

    res.status(201).json({ korisnik: korisnikBezLozinke });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, lozinka } = req.body;

    if (!email || !lozinka) {
      return res.status(400).json({ error: 'Email i lozinka su obavezni' });
    }

    const korisnik = await prisma.user.findUnique({ where: { email } });
    if (!korisnik) {
      return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
    }

    const lozinkaTacna = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!lozinkaTacna) {
      return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
    }

    const token = jwt.sign(
      { id: korisnik.id, uloga: korisnik.uloga },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { lozinka: _, ...korisnikBezLozinke } = korisnik;

    res.status(200).json({ token, korisnik: korisnikBezLozinke });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};