import apiClient from './client';

export interface Voznja {
  id: number;
  polaznaLokacija: string;
  odredisnaLokacija: string;
  datumVremePolaska: string;
  brojSlobodnihMesta: number;
  cenaPoMestu: string;
  status: string;
  vozac: {
    id: number;
    ime: string;
    prezime: string;
  };
}

export const preuzmiVoznje = async (filteri?: { polaznaLokacija?: string; odredisnaLokacija?: string; datum?: string }) => {
  const response = await apiClient.get('/rides', { params: filteri });
  return response.data.voznje as Voznja[];
};

export const preuzmiVoznju = async (id: number) => {
  const response = await apiClient.get(`/rides/${id}`);
  return response.data.voznja;
};

export interface NovaVoznjaPodaci {
    polaznaLokacija: string;
    odredisnaLokacija: string;
    datumVremePolaska: string;
    brojSlobodnihMesta: number;
    cenaPoMestu: number;
  }
  
  export const kreirajVoznju = async (podaci: NovaVoznjaPodaci) => {
    const response = await apiClient.post('/rides', podaci);
    return response.data.voznja;
  };

  export const preuzmiMojeVoznjeKaoVozac = async () => {
    const response = await apiClient.get('/rides/moje-voznje');
    return response.data.voznje;
  };
  
  export const obrisiVoznju = async (id: number) => {
    const response = await apiClient.delete(`/rides/${id}`);
    return response.data;
  };
  
  export const otkaziVoznju = async (id: number) => {
    const response = await apiClient.patch(`/rides/${id}/otkazi`);
    return response.data.voznja;
  };