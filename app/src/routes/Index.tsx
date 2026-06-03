import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Homescreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScannerScreen from '../screens/ScannerScreen';
import SearchScreen from '../screens/SearchScreen';
import AlimentosScreen from '../screens/AlimentosScreen';
import CargaScreen from '../screens/CargaScreen';
import MenuAlimentosScreen from '../screens/MenuAlimentosScreen';
import LocalScreen from '../screens/LocalScreen';
import CategoriasScreen from '../screens/CategoriasScreen';
import InfoAlimentoScreen from '../screens/InfoAlimentoScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName='inicio'>
      <Stack.Screen name="inicio" component={HomeScreen} />
      <Stack.Screen name="Menu Alimentos" component={MenuAlimentosScreen} />
      <Stack.Screen name="resultado Alimentos" component={InfoAlimentoScreen} />
      <Stack.Screen name="Carga" component={CargaScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ApiDataScreen" component={AlimentosScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="categoria" component={CategoriasScreen} />
    </Stack.Navigator>
  );
}
