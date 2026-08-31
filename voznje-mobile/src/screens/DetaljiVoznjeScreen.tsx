import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { preuzmiVoznju } from '../api/rides';
import { napraviRezervaciju } from '../api/reservations';
import { useAuth } from '../context/AuthContext';
import RutaLinijaMobile from '../components/RutaLinijaMobile';

export default function DetaljiVoznjeScreen({ route }: any) {
  const { id } = route.params;
  const { korisnik } = useAuth();

  const [voznja, setVoznja] = useState<any>(null);
  const [brojMesta, setBrojMesta] = useState(1);
  const [ucitava, setUcitava] = useState(true);
  const [rezervisemSe, setRezervisemSe] = useState(false);
  const [greska, setGreska] = useState('');
  const [uspeh, setUspeh] = useState('');

  const ucitajVoznju = async () => {
    try {
      const podaci = await preuzmiVoznju(id);
      setVoznja(podaci);
    } catch (err) {
      console.error(err);
    } finally {
      setUcitava(false);
    }
  };

  useEffect(() => {
    ucitajVoznju();
  }, [id]);

  const rezervisi = async () => {
    setGreska('');
    setUspeh('');
    setRezervisemSe(true);
    try {
      await napraviRezervaciju(id, brojMesta);
      setUspeh('Rezervacija je uspešno napravljena!');
      ucitajVoznju();
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri rezervaciji');
    } finally {
      setRezervisemSe(false);
    }
  };

  if (ucitava) {
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color="#4c6ef5" />
      </SafeAreaView>
    );
  }

  if (!voznja) {
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center">
        <Text className="text-textsoft">Vožnja nije pronađena</Text>
      </SafeAreaView>
    );
  }

  const zauzetaMesta = voznja.rezervacije?.reduce(
    (zbir: number, r: any) => zbir + r.brojRezervisanihMesta,
    0
  ) || 0;
  const dostupnaMesta = voznja.brojSlobodnihMesta - zauzetaMesta;
  const jeVozac = korisnik?.id === voznja.vozac.id;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-surface border border-border rounded-lg p-5">
          <RutaLinijaMobile polazna={voznja.polaznaLokacija} odredisna={voznja.odredisnaLokacija} />
          <Text className="text-textsoft text-sm mt-2 mb-4">
            {new Date(voznja.datumVremePolaska).toLocaleString('sr-RS', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <View className="flex-row flex-wrap gap-y-3 pb-4 mb-4 border-b border-border">
            <View className="w-1/2">
              <Text className="text-xs text-textsoft mb-1">Vozač</Text>
              <Text className="font-medium text-text">{voznja.vozac.ime} {voznja.vozac.prezime}</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-xs text-textsoft mb-1">Cena po mestu</Text>
              <Text className="font-medium text-text">{voznja.cenaPoMestu} RSD</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-xs text-textsoft mb-1">Dostupno mesta</Text>
              <Text className="font-medium text-teal">{dostupnaMesta}</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-xs text-textsoft mb-1">Status</Text>
              <Text className="font-medium text-text">{voznja.status}</Text>
            </View>
          </View>

          {greska ? (
            <View className="bg-dangersoft p-3 rounded-md mb-4">
              <Text className="text-danger text-sm">{greska}</Text>
            </View>
          ) : null}
          {uspeh ? (
            <View className="bg-teal/10 p-3 rounded-md mb-4">
              <Text className="text-teal text-sm">{uspeh}</Text>
            </View>
          ) : null}

          {jeVozac ? (
            <Text className="text-textsoft text-sm italic">Ovo je tvoja vožnja, ne možeš je rezervisati.</Text>
          ) : dostupnaMesta <= 0 ? (
            <Text className="text-danger text-sm font-medium">Nema više slobodnih mesta.</Text>
          ) : (
            <View>
              <Text className="text-sm text-textsoft mb-2">Broj mesta</Text>
              <View className="flex-row items-center gap-3 mb-4">
                <View className="flex-row items-center border border-border rounded-md overflow-hidden">
                  <TouchableOpacity
                    onPress={() => setBrojMesta((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2.5"
                  >
                    <Text className="text-text text-lg">−</Text>
                  </TouchableOpacity>
                  <Text className="px-4 text-text font-medium">{brojMesta}</Text>
                  <TouchableOpacity
                    onPress={() => setBrojMesta((prev) => Math.min(dostupnaMesta, prev + 1))}
                    className="px-4 py-2.5"
                  >
                    <Text className="text-text text-lg">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={rezervisi}
                disabled={rezervisemSe}
                className="bg-accent py-3 rounded-md items-center"
              >
                <Text className="text-white font-semibold">
                  {rezervisemSe ? 'Rezervišem...' : 'Rezerviši'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}