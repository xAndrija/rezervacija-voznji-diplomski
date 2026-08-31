import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function HeaderMobile({ podnaslov }: { podnaslov: string }) {
  const { korisnik } = useAuth();
  const inicijali = korisnik
    ? `${korisnik.ime.charAt(0)}${korisnik.prezime.charAt(0)}`.toUpperCase()
    : '?';

  return (
    <SafeAreaView edges={['top']} className="bg-bg border-b border-border">
      <View className="px-6 pt-2 pb-2 flex-row items-center justify-between">
        <View>
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-2xl text-text tracking-tight">Convoy</Text>
            <View className="w-2 h-2 rounded-full bg-accent" />
          </View>
          <Text className="font-medium text-xs text-textsoft mt-0.5">{podnaslov}</Text>
        </View>

        <View className="w-9 h-9 rounded-full bg-accent/10 items-center justify-center">
          <Text className="text-accent text-xs font-bold">{inicijali}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}