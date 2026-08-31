import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import HeaderMobile from '../components/HeaderMobile';

export default function ProfilScreen({ navigation }: any) {
  const { korisnik, izlogujSe } = useAuth();

  const inicijali = korisnik
    ? `${korisnik.ime.charAt(0)}${korisnik.prezime.charAt(0)}`.toUpperCase()
    : '?';

  const potvrdiOdjavu = () => {
    Alert.alert('Odjava', 'Da li sigurno želiš da se odjaviš?', [
      { text: 'Otkaži', style: 'cancel' },
      { text: 'Odjavi se', style: 'destructive', onPress: izlogujSe },
    ]);
  };

  return (
    <View className="flex-1 bg-bg">
      <HeaderMobile podnaslov="Profil" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-surface border border-border rounded-lg p-6 items-center mb-4">
          <View className="w-20 h-20 rounded-full bg-accent/10 items-center justify-center mb-3">
            <Text className="text-accent font-bold text-2xl">{inicijali}</Text>
          </View>
          <Text className="font-bold text-lg text-text">{korisnik?.ime} {korisnik?.prezime}</Text>
          <Text className="text-textsoft text-sm mb-2">{korisnik?.email}</Text>
          {korisnik?.telefon ? (
            <Text className="text-textsoft text-sm mb-2">{korisnik.telefon}</Text>
          ) : null}
          <View className="bg-bg border border-border px-3 py-1 rounded-full mt-1">
            <Text className="text-xs text-textsoft font-medium">
              {korisnik?.uloga === 'VOZAC' ? 'Vozač' : 'Putnik'}
            </Text>
          </View>
        </View>

        {korisnik?.uloga === 'VOZAC' && (
          <View className="bg-surface border border-border rounded-lg overflow-hidden mb-4">
            <TouchableOpacity
              onPress={() => navigation.navigate('MojeVoznje')}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name="car-outline" size={20} color="#16181d" />
                <Text className="text-text font-medium">Moje vožnje</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={potvrdiOdjavu}
          className="bg-dangersoft py-3.5 rounded-md items-center flex-row justify-center gap-2"
        >
          <Ionicons name="log-out-outline" size={18} color="#d1435f" />
          <Text className="text-danger font-semibold">Odjava</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}