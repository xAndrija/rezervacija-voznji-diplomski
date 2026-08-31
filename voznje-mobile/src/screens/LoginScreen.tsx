import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ulogujKorisnika } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');
  const [ucitava, setUcitava] = useState(false);

  const { ulogujSe } = useAuth();

  const posaljiFormu = async () => {
    setGreska('');
    setUcitava(true);
    try {
      const podaci = await ulogujKorisnika({ email, lozinka });
      await ulogujSe(podaci.token, podaci.korisnik);
    } catch (err: any) {
      setGreska(err.response?.data?.error || 'Greška pri prijavljivanju');
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6" keyboardShouldPersistTaps="handled">
          <View className="items-center mb-8">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="font-bold text-3xl text-text tracking-tight">Convoy</Text>
              <View className="w-2.5 h-2.5 rounded-full bg-accent" />
            </View>
            <Text className="text-textsoft text-sm">Deli put, deli priču</Text>
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
            <Text className="font-bold text-lg text-text mb-1">Dobrodošao nazad</Text>
            <Text className="text-textsoft text-sm mb-5">Prijavi se da nastaviš putovanje</Text>

            {greska ? (
              <View className="bg-dangersoft p-3 rounded-md mb-4">
                <Text className="text-danger text-sm">{greska}</Text>
              </View>
            ) : null}

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
              className="bg-bg border border-border rounded-md px-3 py-3 mb-6 text-text"
            />

            <TouchableOpacity
              onPress={posaljiFormu}
              disabled={ucitava}
              className="bg-accent py-3 rounded-md items-center"
            >
              <Text className="text-white font-semibold">
                {ucitava ? 'Prijavljivanje...' : 'Prijavi se'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Registracija')} className="mt-6">
            <Text className="text-textsoft text-center text-sm">
              Nemaš nalog? <Text className="text-accent font-semibold">Registruj se</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}