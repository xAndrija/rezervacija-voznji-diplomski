import { View } from 'react-native';

export default function LinijaRazdvajanja() {
  const brojCrtica = 24;

  return (
    <View className="flex-row items-center justify-between mb-5">
      <View className="w-2 h-2 rounded-full bg-accent" />
      <View className="flex-1 flex-row items-center justify-between mx-2">
        {Array.from({ length: brojCrtica }).map((_, i) => (
          <View key={i} className="w-1.5 h-0.5 rounded-full bg-accent/40" />
        ))}
      </View>
      <View className="w-2 h-2 rounded-full bg-teal" />
    </View>
  );
}