import { View, Text } from 'react-native';

interface Props {
  polazna: string;
  odredisna: string;
}

export default function RutaLinijaMobile({ polazna, odredisna }: Props) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="font-semibold text-text text-base">{polazna}</Text>
      <View className="flex-row items-center gap-1">
        <View className="w-1.5 h-1.5 rounded-full bg-accent" />
        <View className="w-4 h-px bg-border" />
        <View className="w-1.5 h-1.5 rounded-full bg-teal" />
      </View>
      <Text className="font-semibold text-text text-base">{odredisna}</Text>
    </View>
  );
}