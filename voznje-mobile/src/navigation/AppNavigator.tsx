import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VoznjeStack from './VoznjeStack';
import MojeRezervacijeScreen from '../screens/MojeRezervacijeScreen';
import ProfilStack from './ProfilStack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4c6ef5',
        tabBarInactiveTintColor: '#6b7280',
        tabBarIcon: ({ focused, color, size }) => {
          let ikona: keyof typeof Ionicons.glyphMap = focused ? 'car' : 'car-outline';

          if (route.name === 'Rezervacije') {
            ikona = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Profil') {
            ikona = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={ikona} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Vožnje" component={VoznjeStack} />
      <Tab.Screen name="Rezervacije" component={MojeRezervacijeScreen} />
      <Tab.Screen name="Profil" component={ProfilStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token, ucitavanje } = useAuth();

  if (ucitavanje) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color="#4c6ef5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Glavno" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Prijava" component={LoginScreen} />
            <Stack.Screen name="Registracija" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}