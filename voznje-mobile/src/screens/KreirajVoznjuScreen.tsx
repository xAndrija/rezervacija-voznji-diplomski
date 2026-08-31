import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { kreirajVoznju } from '../api/rides';
import AutoInputGrad from '../components/AutoInputGrad';

export default function KreirajVoznjuScreen({ navigation }: any) {
  const [polaznaLokacija, setPolaznaLokacija] = useState('');
  const [odredisnaLokacija, setOdredisnaLokacija] = useState('');
  const [datum, setDatum] = useState(new Date());
  const [prikaziDatum, setPrikaziDatum] = useState(false);
  const [prikaziVreme, setPrikaziVreme] = useState(false);
  const [brojSlobodnihMesta, setBrojSlobodnihMesta] = useState('1');
  const [cenaPoMestu, setCenaPoMestu] = useState('');
  const [greska, setGreska] = useState('');
  const [ucitava, setUcitava] = useState(false);

  const otvoriDatum = () => {
    Keyboard.dismiss();
    setPrikaziVreme(false);
    setPrikaziDatum(true);
  };

  const otvoriVreme = () => {
    Keyboard.dismiss();
    setPrikaziDatum(false);
    setPrikaziVreme(true);
  };

  const posaljiFormu = async () => {
    setGreska('');
    setUcitava(true);
    try {
      await kreirajVoznju({
        polaznaLokacija,
        odredisnaLokacija,
        datumVremePolaska: datum.toISOString(),
        brojSlobodnihMesta: Number(brojSlobodnihMesta),
        cenaPoMestu: Number(cenaPoMestu),
      });
      navigation.goBack();
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri kreiranju vožnje');
    } finally {
      setUcitava(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        {greska ? (
          <View className="bg-dangersoft p-3 rounded-md mb-4">
            <Text className="text-danger text-sm">{greska}</Text>
          </View>
        ) : null}

        <Text className="text-sm text-textsoft mb-1">Polazna lokacija</Text>
        <View className="mb-4" style={{ zIndex: 20 }}>
          <AutoInputGrad vrednost={polaznaLokacija} naPromenu={setPolaznaLokacija} placeholder="Izaberi ili ukucaj grad" />
        </View>

        <Text className="text-sm text-textsoft mb-1">Odredišna lokacija</Text>
        <View className="mb-4" style={{ zIndex: 10 }}>
          <AutoInputGrad vrednost={odredisnaLokacija} naPromenu={setOdredisnaLokacija} placeholder="Izaberi ili ukucaj grad" />
        </View>

        <View className="mb-2" style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text className="text-sm text-textsoft mb-1">Datum polaska</Text>
            <TouchableOpacity
              onPress={otvoriDatum}
              className={`bg-surface border rounded-md px-3 py-3 ${prikaziDatum ? 'border-accent' : 'border-border'}`}
            >
              <Text className="text-text" numberOfLines={1}>{datum.toLocaleDateString('sr-RS')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text className="text-sm text-textsoft mb-1">Vreme polaska</Text>
            <TouchableOpacity
              onPress={otvoriVreme}
              className={`bg-surface border rounded-md px-3 py-3 ${prikaziVreme ? 'border-accent' : 'border-border'}`}
            >
              <Text className="text-text" numberOfLines={1}>
                {datum.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {prikaziDatum && (
          <View className="bg-surface border border-border rounded-md mb-4 overflow-hidden">
            <DateTimePicker
              value={datum}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant="light"
              textColor="#16181d"
              onChange={(_, izabran) => {
                if (Platform.OS === 'android') setPrikaziDatum(false);
                if (izabran) setDatum(izabran);
              }}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => setPrikaziDatum(false)}
                className="bg-accent py-2.5 items-center"
              >
                <Text className="text-white font-semibold">Gotovo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {prikaziVreme && (
          <View className="bg-surface border border-border rounded-md mb-4 overflow-hidden">
            <DateTimePicker
              value={datum}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant="light"
              textColor="#16181d"
              onChange={(_, izabran) => {
                if (Platform.OS === 'android') setPrikaziVreme(false);
                if (izabran) setDatum(izabran);
              }}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => setPrikaziVreme(false)}
                className="bg-accent py-2.5 items-center"
              >
                <Text className="text-white font-semibold">Gotovo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 12 }} className="mb-6 mt-2">
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text className="text-sm text-textsoft mb-1">Broj mesta</Text>
            <TextInput
              value={brojSlobodnihMesta}
              onChangeText={setBrojSlobodnihMesta}
              keyboardType="number-pad"
              className="bg-surface border border-border rounded-md px-3 py-3 text-text"
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text className="text-sm text-textsoft mb-1">Cena (RSD)</Text>
            <TextInput
              value={cenaPoMestu}
              onChangeText={setCenaPoMestu}
              keyboardType="number-pad"
              className="bg-surface border border-border rounded-md px-3 py-3 text-text"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={posaljiFormu}
          disabled={ucitava}
          className="bg-accent py-3 rounded-md items-center"
        >
          <Text className="text-white font-semibold">
            {ucitava ? 'Kreiranje...' : 'Kreiraj vožnju'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}