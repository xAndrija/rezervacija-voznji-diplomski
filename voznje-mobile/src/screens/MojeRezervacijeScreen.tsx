import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { preuzmiMojeRezervacije, otkaziRezervaciju, type Rezervacija } from '../api/reservations';
import RutaLinijaMobile from '../components/RutaLinijaMobile';
import StatusOznakaMobile from '../components/StatusOznakaMobile';
import HeaderMobile from '../components/HeaderMobile';

type StavkaListe =
  | { tip: 'naslov'; tekst: string }
  | { tip: 'prazno'; tekst: string }
  | { tip: 'rezervacija'; podaci: Rezervacija };

export default function MojeRezervacijeScreen() {
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [osvezavanje, setOsvezavanje] = useState(false);
  const [otkazujemId, setOtkazujemId] = useState<number | null>(null);

  const ucitajRezervacije = async () => {
    try {
      const podaci = await preuzmiMojeRezervacije();
      setRezervacije(podaci);
    } catch (err) {
      console.error(err);
    } finally {
      setUcitava(false);
      setOsvezavanje(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      ucitajRezervacije();
    }, [])
  );

  const otkazi = async (id: number) => {
    setOtkazujemId(id);
    try {
      await otkaziRezervaciju(id);
      ucitajRezervacije();
    } catch (err) {
      console.error(err);
    } finally {
      setOtkazujemId(null);
    }
  };

  const naOsvezavanje = () => {
    setOsvezavanje(true);
    ucitajRezervacije();
  };

  const aktivne = rezervacije.filter((r) => r.status === 'POTVRDJENA');
  const otkazane = rezervacije.filter((r) => r.status !== 'POTVRDJENA');

  const stavke: StavkaListe[] = [
    { tip: 'naslov', tekst: `Aktivne (${aktivne.length})` },
    ...(aktivne.length === 0
      ? [{ tip: 'prazno' as const, tekst: 'Nemaš aktivnih rezervacija' }]
      : aktivne.map((r) => ({ tip: 'rezervacija' as const, podaci: r }))),
    { tip: 'naslov', tekst: `Otkazane (${otkazane.length})` },
    ...(otkazane.length === 0
      ? [{ tip: 'prazno' as const, tekst: 'Nemaš otkazanih rezervacija' }]
      : otkazane.map((r) => ({ tip: 'rezervacija' as const, podaci: r }))),
  ];

  return (
    <View className="flex-1 bg-bg">
      <HeaderMobile podnaslov="Moje rezervacije" />

      <FlatList
        data={rezervacije.length === 0 ? [] : stavke}
        keyExtractor={(item, index) =>
          item.tip === 'rezervacija' ? String(item.podaci.id) : `${item.tip}-${index}`
        }
        contentContainerStyle={{ padding: 16, gap: 10 }}
        refreshControl={<RefreshControl refreshing={osvezavanje} onRefresh={naOsvezavanje} tintColor="#4c6ef5" />}
        ListEmptyComponent={
          !ucitava ? (
            <View className="border border-dashed border-border rounded-lg py-14 items-center">
              <Text className="text-textsoft text-sm">Nemaš nijednu rezervaciju</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          if (item.tip === 'naslov') {
            return (
              <Text className="font-semibold text-sm text-textsoft uppercase mt-2 mb-1">{item.tekst}</Text>
            );
          }

          if (item.tip === 'prazno') {
            return (
              <View className="border border-dashed border-border rounded-lg py-6 items-center mb-1">
                <Text className="text-textsoft text-sm">{item.tekst}</Text>
              </View>
            );
          }

          const rez = item.podaci;
          return (
            <View className="bg-surface border border-border rounded-lg p-4">
              <View className="flex-row justify-between items-start mb-2">
                {rez.voznja && (
                  <RutaLinijaMobile polazna={rez.voznja.polaznaLokacija} odredisna={rez.voznja.odredisnaLokacija} />
                )}
                <StatusOznakaMobile status={rez.status} />
              </View>

              {rez.voznja?.datumVremePolaska && (
                <Text className="text-textsoft text-sm mb-3">
                  {new Date(rez.voznja.datumVremePolaska).toLocaleString('sr-RS')}
                </Text>
              )}

              <Text className="text-textsoft text-sm mb-3">{rez.brojRezervisanihMesta} mesta</Text>

              {rez.status === 'POTVRDJENA' && (
                <TouchableOpacity
                  onPress={() => otkazi(rez.id)}
                  disabled={otkazujemId === rez.id}
                  className="self-end"
                >
                  <Text className="text-danger text-sm font-medium">
                    {otkazujemId === rez.id ? 'Otkazujem...' : 'Otkaži rezervaciju'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}