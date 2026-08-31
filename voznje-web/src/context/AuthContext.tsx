import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Korisnik {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  uloga: 'PUTNIK' | 'VOZAC' | 'ADMIN';
}

interface AuthContextTip {
  korisnik: Korisnik | null;
  token: string | null;
  ulogujSe: (token: string, korisnik: Korisnik) => void;
  izlogujSe: () => void;
}

const AuthContext = createContext<AuthContextTip | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [korisnik, setKorisnik] = useState<Korisnik | null>(() => {
    const sacuvan = localStorage.getItem('korisnik');
    return sacuvan ? JSON.parse(sacuvan) : null;
  });

  const ulogujSe = (noviToken: string, noviKorisnik: Korisnik) => {
    localStorage.setItem('token', noviToken);
    localStorage.setItem('korisnik', JSON.stringify(noviKorisnik));
    setToken(noviToken);
    setKorisnik(noviKorisnik);
  };

  const izlogujSe = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('korisnik');
    setToken(null);
    setKorisnik(null);
  };

  return (
    <AuthContext.Provider value={{ korisnik, token, ulogujSe, izlogujSe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti korišćen unutar AuthProvider-a');
  }
  return context;
};