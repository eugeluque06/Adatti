import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './screens/HomeScreen';
import BarcodeScanner from './screens/BarcodeScanner';
import SearchBar from './screens/SearchBar';

// Configura la navegación
const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    BarcodeScanner: BarcodeScanner,
    Search: SearchBar,
  },
  {
    initialRouteName: 'Home',
  }
);

// Crea el contenedor de la aplicación
const AppContainer = createAppContainer(AppNavigator);

// Define el componente principal de la aplicación
const App = () => {
  return <AppContainer />;
};

export default App;
