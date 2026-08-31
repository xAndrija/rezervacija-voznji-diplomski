import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { preuzmiMojeVoznjeKaoVozac, obrisiVoznju, otkaziVoznju } from '../api/rides';
import RutaLinijaMobile from '../components/RutaLinijaMobile';
import StatusOznakaMobile from '../components/StatusOznakaMobile';
import SeatIndikatorMobile from '../components/SeatIndikatorMobile';

function inicijali(ime: string, prezime: string) {
  return `${ime.charAt(0)}${prezime.charAt(0)}`.toUpperCase();
}

type StavkaListe =
  | { tip: 'naslov'; tekst: string }
  | { tip: 'prazno'; tekst: string }
  | { tip: 'voznja'; podaci: any };

export default function MojeVoznjeScreen({ navigation }: any) {
  const [voznje, setVoznje] = useState<any[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [osvezavanje, setOsvezavanje] = useState(false);
  const [akcijaId, setAkcijaId] = useState<number | null>(null);

  const ucitajVoznje = async () => {
    try {
      const podaci = await preuzmiMojeVoznjeKaoVozac();
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
      ucitajVoznje();
    }, [])
  );

  const naOsvezavanje = () => {
    setOsvezavanje(true);
    ucitajVoznje();
  };

  const obrisi = (id: number) => {
    Alert.alert('Obriši vožnju', 'Da li si siguran da želiš da obrišeš ovu vožnju?', [
      { text: 'Otkaži', style: 'cancel' },
      {
        text: 'Obriši',
        style: 'destructive',
        onPress: async () => {
          setAkcijaId(id);
          try {
            await obrisiVoznju(id);
            ucitajVoznje();
          } catch (err) {
            console.error(err);
          } finally {
            setAkcijaId(null);
          }
        },
      },
    ]);
  };

  const otkazi = (id: number) => {
    Alert.alert('Otkaži vožnju', 'Svi putnici će izgubiti rezervaciju. Da li si siguran?', [
      { text: 'Ne', style: 'cancel' },
      {
        text: 'Otkaži vožnju',
        style: 'destructive',
        onPress: async () => {
          setAkcijaId(id);
          try {
            await otkaziVoznju(id);
            ucitajVoznje();
          } catch (err) {
            console.error(err);
          } finally {
            setAkcijaId(null);
          }
        },
      },
    ]);
  };

  const aktivne = voznje.filter((v) => v.status === 'AKTIVNA');
  const neaktivne = voznje.filter((v) => v.status !== 'AKTIVNA');

  const stavke: StavkaListe[] = [
    { tip: 'naslov', tekst: `Aktivne (${aktivne.length})` },
    ...(aktivne.length === 0
      ? [{ tip: 'prazno' as const, tekst: 'Nemaš aktivnih vožnji' }]
      : aktivne.map((v) => ({ tip: 'voznja' as const, podaci: v }))),
    { tip: 'naslov', tekst: `Neaktivne (${neaktivne.length})` },
    ...(neaktivne.length === 0
      ? [{ tip: 'prazno' as const, tekst: 'Nemaš neaktivnih vožnji' }]
      : neaktivne.map((v) => ({ tip: 'voznja' as const, podaci: v }))),
  ];

  return (
    <View className="flex-1 bg-bg">
      <View className="px-4 pt-4 pb-2 flex-row justify-between items-center">
        <Text className="text-textsoft text-sm">
          {voznje.length} {voznje.length === 1 ? 'vožnja' : 'vožnji'} ukupno
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('KreirajVoznju')}
          className="bg-accent px-3.5 py-2 rounded-md"
        >
          <Text className="text-white text-sm font-medium">+ Nova vožnja</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={voznje.length === 0 ? [] : stavke}
        keyExtractor={(item, index) =>
          item.tip === 'voznja' ? String(item.podaci.id) : `${item.tip}-${index}`
        }
        contentContainerStyle={{ padding: 16, gap: 10 }}
        refreshControl={<RefreshControl refreshing={osvezavanje} onRefresh={naOsvezavanje} tintColor="#4c6ef5" />}
        ListEmptyComponent={
          !ucitava ? (
            <View className="border border-dashed border-border rounded-lg py-14 items-center">
              <Text className="text-textsoft text-sm">Nemaš nijednu kreiranu vožnju</Text>
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

          const voznja = item.podaci;
          const brojRezervacija = voznja.rezervacije?.length || 0;
          const zauzetaMesta = voznja.rezervacije?.reduce(
            (zbir: number, r: any) => zbir + r.brojRezervisanihMesta,
            0
          ) || 0;
          const imaRezervacije = brojRezervacija > 0;
          const zarada = zauzetaMesta * Number(voznja.cenaPoMestu);

          return (
            <View className="bg-surface border border-border rounded-lg overflow-hidden">
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <RutaLinijaMobile polazna={voznja.polaznaLokacija} odredisna={voznja.odredisnaLokacija} />
                  <StatusOznakaMobile status={voznja.status} />
                </View>

                <Text className="text-textsoft text-sm mb-3">
                  {new Date(voznja.datumVremePolaska).toLocaleString('sr-RS')}
                </Text>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <SeatIndikatorMobile ukupno={voznja.brojSlobodnihMesta} zauzeto={zauzetaMesta} />
                    <Text className="text-xs text-textsoft">{zauzetaMesta}/{voznja.brojSlobodnihMesta}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-textsoft">Zarada</Text>
                    <Text className="font-semibold text-text">{zarada || 0} RSD</Text>
                  </View>
                </View>
              </View>

              {imaRezervacije && (
                <View className="px-4 py-3 bg-bg border-t border-border">
                  <Text className="text-xs text-textsoft mb-2">Putnici</Text>
                  <View className="gap-2">
                    {voznja.rezervacije.map((rez: any) => (
                      <View key={rez.id} className="flex-row items-center gap-2.5">
                        <View className="w-7 h-7 rounded-full bg-accent/10 items-center justify-center">
                          <Text className="text-accent text-xs font-semibold">
                            {inicijali(rez.korisnik.ime, rez.korisnik.prezime)}
                          </Text>
                        </View>
                        <Text className="text-sm text-text">
                          {rez.korisnik.ime} {rez.korisnik.prezime}
                          <Text className="text-textsoft"> · {rez.brojRezervisanihMesta} mesta</Text>
                          {rez.korisnik.telefon ? (
                            <Text className="text-textsoft"> · {rez.korisnik.telefon}</Text>
                          ) : null}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {voznja.status === 'AKTIVNA' && (
                <View className="px-4 py-3 bg-bg border-t border-border items-end">
                  <TouchableOpacity
                    onPress={() => (imaRezervacije ? otkazi(voznja.id) : obrisi(voznja.id))}
                    disabled={akcijaId === voznja.id}
                  >
                    <Text className={`text-sm font-medium ${imaRezervacije ? 'text-accent' : 'text-danger'}`}>
                      {akcijaId === voznja.id ? 'Sačekaj...' : imaRezervacije ? 'Otkaži vožnju' : 'Obriši vožnju'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}