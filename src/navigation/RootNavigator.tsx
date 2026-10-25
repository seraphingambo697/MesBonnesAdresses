import React from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { AddressesProvider } from '../context/AddressesContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { MapScreen } from '../screens/MapScreen';
import { AddressesScreen } from '../screens/AddressesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AddressDetailScreen } from '../screens/AddressDetailScreen';
import { AuthStackParamList, AppTabParamList, AppStackParamList } from './types';
import { colors } from '../theme';
import { CreateAddressScreen } from '../screens/CreateAddressScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

const tabIcon = (emoji: string) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Carte',
          headerShown: false,
          tabBarIcon: tabIcon('🗺️'),
          tabBarButtonTestID: 'tab-map',
        }}
      />
      <Tab.Screen
        name="Addresses"
        component={AddressesScreen}
        options={{ title: 'Adresses', tabBarIcon: tabIcon('📋'), tabBarButtonTestID: 'tab-addresses' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarIcon: tabIcon('👤'), tabBarButtonTestID: 'tab-profile' }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) return <LoadingScreen />;

  if (!user) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
      </AuthStack.Navigator>
    );
  }

  return (
    <AddressesProvider>
      <AppStack.Navigator>
        <AppStack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
        <AppStack.Screen
          name="CreateAddress"
          component={CreateAddressScreen}
          options={{ title: 'Nouvelle adresse', presentation: 'modal' }}
        />
        <AppStack.Screen name="AddressDetail" component={AddressDetailScreen} options={{ title: 'Adresse' }} />
      </AppStack.Navigator>
    </AddressesProvider>
  );
}