import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaVoznjiScreen from '../screens/ListaVoznjiScreen';
import DetaljiVoznjeScreen from '../screens/DetaljiVoznjeScreen';

const Stack = createNativeStackNavigator();

export default function VoznjeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTintColor: '#4c6ef5',
        headerTitleStyle: { fontSize: 17, fontWeight: '600', color: '#16181d' },
        headerStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen name="ListaVoznji" component={ListaVoznjiScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetaljiVoznje" component={DetaljiVoznjeScreen} options={{ title: 'Detalji vožnje' }} />
    </Stack.Navigator>
  );
}