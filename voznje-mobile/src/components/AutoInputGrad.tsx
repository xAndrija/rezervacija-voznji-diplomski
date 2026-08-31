import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GRADOVI_SRBIJE } from '../constants/gradovi';

interface Props {
  vrednost: string;
  naPromenu: (grad: string) => void;
  placeholder: string;
}

export default function AutoInputGrad({ vrednost, naPromenu, placeholder }: Props) {
  const [otvoreno, setOtvoreno] = useState(false);
  const [pretraga, setPretraga] = useState('');

  const filtrirano =
    pretraga.length > 0
      ? GRADOVI_SRBIJE.filter((grad) => grad.toLowerCase().startsWith(pretraga.toLowerCase()))
      : GRADOVI_SRBIJE;

  const otvoriModal = () => {
    setPretraga(vrednost);
    setOtvoreno(true);
  };

  const izaberi = (grad: string) => {
    naPromenu(grad);
    setOtvoreno(false);
  };

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={otvoriModal}
        className="bg-bg border border-border rounded-md px-3 py-2.5"
      >
        <Text className={vrednost ? 'text-text' : 'text-textsoft'} numberOfLines={1}>
          {vrednost || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={otvoreno} animationType="slide" onRequestClose={() => setOtvoreno(false)}>
        <View className="flex-1 bg-bg pt-16">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="font-bold text-xl text-text">Izaberi grad</Text>
            <TouchableOpacity onPress={() => setOtvoreno(false)}>
              <Ionicons name="close" size={26} color="#16181d" />
            </TouchableOpacity>
          </View>

          <View className="px-4 mb-2">
            <TextInput
              placeholder="Pretraži gradove..."
              value={pretraga}
              onChangeText={setPretraga}
              autoFocus
              className="bg-surface border border-border rounded-md px-3 py-2.5 text-text"
            />
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            {filtrirano.length === 0 ? (
              <Text className="text-textsoft text-sm text-center mt-6">Nema rezultata</Text>
            ) : (
              filtrirano.map((grad, index) => (
                <TouchableOpacity
                  key={grad}
                  onPress={() => izaberi(grad)}
                  className={`py-3.5 ${index < filtrirano.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <Text className="text-text">{grad}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}