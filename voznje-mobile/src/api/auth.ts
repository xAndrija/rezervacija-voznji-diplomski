import apiClient from './client';

export interface RegisterPodaci {
  ime: string;
  prezime: string;
  email: string;
  lozinka: string;
  telefon?: string;
  uloga: 'PUTNIK' | 'VOZAC';
}

export interface LoginPodaci {
  email: string;
  lozinka: string;
}

export const registrujKorisnika = async (podaci: RegisterPodaci) => {
  const response = await apiClient.post('/auth/register', podaci);
  return response.data;
};

export const ulogujKorisnika = async (podaci: LoginPodaci) => {
  const response = await apiClient.post('/auth/login', podaci);
  return response.data;
};