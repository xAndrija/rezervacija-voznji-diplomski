import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { preuzmiVoznje, type Voznja } from '../api/rides';
import RutaLinijaMobile from '../components/RutaLinijaMobile';
import HeaderMobile from '../components/HeaderMobile';
import AutoInputGrad from '../components/AutoInputGrad';
import LinijaRazdvajanja from '../components/LinijaRazdvajanja';

const POPULARNE_RUTE = [
  { polazna: 'Beograd', odredisna: 'Novi Sad' },
  { polazna: 'Beograd', odredisna: 'Niš' },
  { polazna: 'Novi Sad', odredisna: 'Subotica' },
  { polazna: 'Beograd', odredisna: 'Kragujevac' },
];

function inicijali(ime: string, prezime: string) {
  return `${ime.charAt(0)}${prezime.charAt(0)}`.toUpperCase();
}

function relativniDatum(iso: string) {
  const datum = new Date(iso);
  const sada = new Date();
  const danas = new Date(sada.getFullYear(), sada.getMonth(), sada.getDate());
  const ciljniDan = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate());
  const razlikaDana = Math.round((ciljniDan.getTime() - danas.getTime()) / (1000 * 60 * 60 * 24));

  const vreme = datum.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });

  if (razlikaDana === 0) return `Danas u ${vreme}`;
  if (razlikaDana === 1) return `Sutra u ${vreme}`;
  return `${datum.toLocaleDateString('sr-RS', { day: 'numeric', month: 'short' })} u ${vreme}`;
}

export default function ListaVoznjiScreen({ navigation }: any) {
  const [voznje, setVoznje] = useState<Voznja[]>([]);
  const [polaznaLokacija, setPolaznaLokacija] = useState('');
  const [odredisnaLokacija, setOdredisnaLokacija] = useState('');
  const [ucitava, setUcitava] = useState(true);
  const [osvezavanje, setOsvezavanje] = useState(false);

  const ucitajVoznje = async (polazna: string, odredisna: string) => {
    try {
      const podaci = await preuzmiVoznje({
        polaznaLokacija: polazna || undefined,
        odredisnaLokacija: odredisna || undefined,
      });
      setVoznje(podaci);
    } catch (err) {
      console.error(err);
    } finally {
      setUcitava(false);
      setOsvezavanje(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPolaznaLokacija('');
      setOdredisnaLokacija('');
      setUcitava(true);
      ucitajVoznje('', '');
    }, [])
  );

  const pretrazi = () => {
    setUcitava(true);
    ucitajVoznje(polaznaLokacija, odredisnaLokacija);
  };

  const izaberiPopularnuRutu = (polazna: string, odredisna: string) => {
    setPolaznaLokacija(polazna);
    setOdredisnaLokacija(odredisna);
    setUcitava(true);
    ucitajVoznje(polazna, odredisna);
  };

  const ocistiPretragu = () => {
    setPolaznaLokacija('');
    setOdredisnaLokacija('');
    setUcitava(true);
    ucitajVoznje('', '');
  };

  const naOsvezavanje = () => {
    setPolaznaLokacija('');
    setOdredisnaLokacija('');
    setOsvezavanje(true);
    ucitajVoznje('', '');
  };

  const gradovi = new Set<string>();
  voznje.forEach((v) => {
    gradovi.add(v.polaznaLokacija);
    gradovi.add(v.odredisnaLokacija);
  });

  const imaAktivnuPretragu = polaznaLokacija !== '' || odredisnaLokacija !== '';

  return (
    <View className="flex-1 bg-bg">
      <HeaderMobile podnaslov="Vožnje" />

      <FlatList
        data={voznje}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={osvezavanje} onRefresh={naOsvezavanje} tintColor="#4c6ef5" />}
        ListHeaderComponent={
          <View className="mb-4">
            <View className="mt-1">
              <LinijaRazdvajanja />
            </View>

            <Text className="font-medium text-xs text-textsoft uppercase mb-2">Popularne rute</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
              <View className="flex-row gap-2">
                {POPULARNE_RUTE.map((ruta) => (
                  <TouchableOpacity
                    key={`${ruta.polazna}-${ruta.odredisna}`}
                    onPress={() => izaberiPopularnuRutu(ruta.polazna, ruta.odredisna)}
                    className="bg-surface border border-border rounded-full px-3.5 py-2"
                  >
                    <Text className="text-xs text-text">
                      {ruta.polazna} → {ruta.odredisna}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View className="flex-row gap-3 mb-6">
              <View className="flex-1 bg-surface border border-border rounded-lg px-3 py-3 items-center">
                <Text className="font-bold text-xl text-text">{voznje.length}</Text>
                <Text className="text-xs text-textsoft">aktivnih vožnji</Text>
              </View>
              <View className="flex-1 bg-surface border border-border rounded-lg px-3 py-3 items-center">
                <Text className="font-bold text-xl text-text">{gradovi.size}</Text>
                <Text className="text-xs text-textsoft">gradova povezano</Text>
              </View>
            </View>

            <View
              className="bg-surface border-2 border-accent/15 rounded-xl p-3 mb-2"
              style={{
                shadowColor: '#4c6ef5',
                shadowOpacity: 0.12,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
                zIndex: 20,
              }}
            >
              {imaAktivnuPretragu && (
                <TouchableOpacity onPress={ocistiPretragu} className="self-end mb-1">
                  <Text className="text-xs text-textsoft">Očisti pretragu ✕</Text>
                </TouchableOpacity>
              )}
              <View className="flex-row gap-2 mb-2">
                <AutoInputGrad vrednost={polaznaLokacija} naPromenu={setPolaznaLokacija} placeholder="Odakle krećeš" />
                <AutoInputGrad vrednost={odredisnaLokacija} naPromenu={setOdredisnaLokacija} placeholder="Gde ideš" />
              </View>
              <TouchableOpacity onPress={pretrazi} className="bg-accent py-2.5 rounded-md items-center">
                <Text className="text-white font-semibold">Pretraži</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-textsoft mt-5 mb-1">
              {voznje.length} {voznje.length === 1 ? 'vožnja' : 'vožnji'} pronađeno
            </Text>
          </View>
        }
        ListEmptyComponent={
          !ucitava ? (
            <View className="border border-dashed border-border rounded-lg py-10 items-center">
              <Text className="text-textsoft text-sm">Nema vožnji koje odgovaraju pretrazi</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('DetaljiVoznje', { id: item.id })}
            className="bg-surface border border-border rounded-lg p-4"
          >
            <View className="flex-row justify-between items-start mb-2">
              <RutaLinijaMobile polazna={item.polaznaLokacija} odredisna={item.odredisnaLokacija} />
              <Text className="font-semibold text-text">{item.cenaPoMestu} RSD</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-6 h-6 rounded-full bg-accent/10 items-center justify-center">
                  <Text className="text-accent text-xs font-semibold">
                    {inicijali(item.vozac.ime, item.vozac.prezime)}
                  </Text>
                </View>
                <Text className="text-textsoft text-sm">
                  {item.vozac.ime} {item.vozac.prezime}
                </Text>
              </View>
              <Text className="text-xs text-teal font-medium">{item.brojSlobodnihMesta} mesta</Text>
            </View>

            <Text className="text-textsoft text-xs mt-2">{relativniDatum(item.datumVremePolaska)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}