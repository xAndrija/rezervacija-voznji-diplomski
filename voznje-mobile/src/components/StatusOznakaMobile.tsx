import { View, Text } from 'react-native';

const STILOVI: Record<string, { bg: string; text: string }> = {
  AKTIVNA: { bg: 'bg-teal/10', text: 'text-teal' },
  OTKAZANA: { bg: 'bg-dangersoft', text: 'text-danger' },
  ZAVRSENA: { bg: 'bg-border', text: 'text-textsoft' },
  POTVRDJENA: { bg: 'bg-teal/10', text: 'text-teal' },
};

export default function StatusOznakaMobile({ status }: { status: string }) {
  const stil = STILOVI[status] || { bg: 'bg-border', text: 'text-textsoft' };
  return (
    <View className={`px-2 py-0.5 rounded-full ${stil.bg}`}>
      <Text className={`text-xs font-medium ${stil.text}`}>{status}</Text>
    </View>
  );
}