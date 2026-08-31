import { View } from 'react-native';

interface Props {
  ukupno: number;
  zauzeto: number;
}

export default function SeatIndikatorMobile({ ukupno, zauzeto }: Props) {
  return (
    <View className="flex-row items-center gap-1.5">
      {Array.from({ length: ukupno }).map((_, i) => (
        <View
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < zauzeto ? 'bg-accent' : 'bg-border'}`}
        />
      ))}
    </View>
  );
}