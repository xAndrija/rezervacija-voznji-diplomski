import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registrujKorisnika } from '../api/auth';

export default function RegisterScreen({ navigation }: any) {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [telefon, setTelefon] = useState('');
  const [uloga, setUloga] = useState<'PUTNIK' | 'VOZAC'>('PUTNIK');
  const [greska, setGreska] = useState('');
  const [ucitava, setUcitava] = useState(false);

  const posaljiFormu = async () => {
    setGreska('');
    setUcitava(true);
    try {
      await registrujKorisnika({ ime, prezime, email, lozinka, telefon, uloga });
      navigation.navigate('Prijava');
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri registraciji');
    } finally {
      setUcitava(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }} className="px-6" keyboardShouldPersistTaps="handled">
          <View className="items-center mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="font-bold text-3xl text-text tracking-tight">Convoy</Text>
              <View className="w-2.5 h-2.5 rounded-full bg-accent" />
            </View>
            <Text className="text-textsoft text-sm">Napravi nalog za manje od minuta</Text>
          </View>

          <View
            className="bg-surface border border-border rounded-xl p-5"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}
          >
            {greska ? (
              <View className="bg-dangersoft p-3 rounded-md mb-4">
                <Text className="text-danger text-sm">{greska}</Text>
              </View>
            ) : null}

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm text-textsoft mb-1">Ime</Text>
                <TextInput
                  value={ime}
                  onChangeText={setIme}
                  className="bg-bg border border-border rounded-md px-3 py-3 text-text"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-textsoft mb-1">Prezime</Text>
                <TextInput
                  value={prezime}
                  onChangeText={setPrezime}
                  className="bg-bg border border-border rounded-md px-3 py-3 text-text"
                />
              </View>
            </View>

            <Text className="text-sm text-textsoft mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-bg border border-border rounded-md px-3 py-3 mb-4 text-text"
            />

            <Text className="text-sm text-textsoft mb-1">Lozinka</Text>
            <TextInput
              value={lozinka}
              onChangeText={setLozinka}
              secureTextEntry
              className="bg-bg border border-border rounded-md px-3 py-3 mb-4 text-text"
            />

            <Text className="text-sm text-textsoft mb-1">Telefon</Text>
            <TextInput
              value={telefon}
              onChangeText={setTelefon}
              keyboardType="phone-pad"
              className="bg-bg border border-border rounded-md px-3 py-3 mb-4 text-text"
            />

            <Text className="text-sm text-textsoft mb-2">Registrujem se kao</Text>
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                onPress={() => setUloga('PUTNIK')}
                className={`flex-1 py-3 rounded-md items-center border ${
                  uloga === 'PUTNIK' ? 'bg-accent border-accent' : 'bg-bg border-border'
                }`}
              >
                <Text className={uloga === 'PUTNIK' ? 'text-white font-medium' : 'text-text'}>Putnik</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUloga('VOZAC')}
                className={`flex-1 py-3 rounded-md items-center border ${
                  uloga === 'VOZAC' ? 'bg-accent border-accent' : 'bg-bg border-border'
                }`}
              >
                <Text className={uloga === 'VOZAC' ? 'text-white font-medium' : 'text-text'}>Vozač</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={posaljiFormu}
              disabled={ucitava}
              className="bg-accent py-3 rounded-md items-center"
            >
              <Text className="text-white font-semibold">
                {ucitava ? 'Kreiranje naloga...' : 'Registruj se'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Prijava')} className="mt-6">
            <Text className="text-textsoft text-center text-sm">
              Već imaš nalog? <Text className="text-accent font-semibold">Prijavi se</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}