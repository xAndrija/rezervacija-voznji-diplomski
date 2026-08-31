import apiClient from './client';

export interface Rezervacija {
  id: number;
  brojRezervisanihMesta: number;
  datumRezervacije: string;
  status: string;
  voznjaId: number;
  korisnikId: number;
  voznja?: {
    id: number;
    polaznaLokacija: string;
    odredisnaLokacija: string;
    datumVremePolaska: string;
    cenaPoMestu: string;
  };
}

export const napraviRezervaciju = async (voznjaId: number, brojRezervisanihMesta: number) => {
  const response = await apiClient.post('/reservations', { voznjaId, brojRezervisanihMesta });
  return response.data.rezervacija as Rezervacija;
};

export const otkaziRezervaciju = async (id: number) => {
  const response = await apiClient.patch(`/reservations/${id}/otkazi`);
  return response.data.rezervacija as Rezervacija;
};

export const preuzmiMojeRezervacije = async () => {
  const response = await apiClient.get('/reservations/moje');
  return response.data.rezervacije as Rezervacija[];
};