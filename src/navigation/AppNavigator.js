// Importa las bibliotecas necesarias

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
// Importa los componentes de las pantallas
import HomeScreen from '../screens/ HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BarcodeScanner from "../screens/BarcodeScreen";
import SearchBar from "../screens/SearchBar";

// Define el navegador de la aplicación
const Tab = createStackNavigator();

const TabNavigator = () => (
    <Tab.Navigator>
      
      <Tab.Screen
        name = "Home"
        component = {HomeScreen}
      />
      
      <Tab.Screen
        name = "perfil"
        component = {ProfileScreen}
      />

      <Tab.Screen
        name = "code"
        component = {BarcodeScanner}
      />

      <Tab.Screen
        name = "search"
        component = {SearchBar}
      />

    </Tab.Navigator>
);

const AppNavigation = () => (
  <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
);

// Exporta el contenedor de la aplicación
export default AppNavigation;
