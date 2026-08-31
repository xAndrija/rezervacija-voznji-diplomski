import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilScreen from '../screens/ProfilScreen';
import MojeVoznjeScreen from '../screens/MojeVoznjeScreen';
import KreirajVoznjuScreen from '../screens/KreirajVoznjuScreen';

const Stack = createNativeStackNavigator();

export default function ProfilStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: '#4c6ef5',
        headerTitleStyle: { fontSize: 17, fontWeight: '600', color: '#16181d' },
        headerStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen name="ProfilGlavno" component={ProfilScreen} options={{ headerShown: false, title: 'Profil' }} />
      <Stack.Screen name="MojeVoznje" component={MojeVoznjeScreen} options={{ title: 'Moje vožnje' }} />
      <Stack.Screen name="KreirajVoznju" component={KreirajVoznjuScreen} options={{ title: 'Nova vožnja' }} />
    </Stack.Navigator>
  );
}