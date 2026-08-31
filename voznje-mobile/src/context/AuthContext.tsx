import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Korisnik {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon?: string;
  uloga: 'PUTNIK' | 'VOZAC' | 'ADMIN';
}

interface AuthContextTip {
  korisnik: Korisnik | null;
  token: string | null;
  ucitavanje: boolean;
  ulogujSe: (token: string, korisnik: Korisnik) => Promise<void>;
  izlogujSe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextTip | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [ucitavanje, setUcitavanje] = useState(true);

  useEffect(() => {
    const ucitajSacuvano = async () => {
      const sacuvaniToken = await AsyncStorage.getItem('token');
      const sacuvaniKorisnik = await AsyncStorage.getItem('korisnik');
      if (sacuvaniToken && sacuvaniKorisnik) {
        setToken(sacuvaniToken);
        setKorisnik(JSON.parse(sacuvaniKorisnik));
      }
      setUcitavanje(false);
    };
    ucitajSacuvano();
  }, []);

  const ulogujSe = async (noviToken: string, noviKorisnik: Korisnik) => {
    await AsyncStorage.setItem('token', noviToken);
    await AsyncStorage.setItem('korisnik', JSON.stringify(noviKorisnik));
    setToken(noviToken);
    setKorisnik(noviKorisnik);
  };

  const izlogujSe = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('korisnik');
    setToken(null);
    setKorisnik(null);
  };

  return (
    <AuthContext.Provider value={{ korisnik, token, ucitavanje, ulogujSe, izlogujSe }}>
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