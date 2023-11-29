// Importa las bibliotecas necesarias
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Importa los componentes de las pantallas
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

// Define el navegador de la aplicación
const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

// Crea el contenedor de la aplicación
const AppContainer = createAppContainer(AppNavigator);

// Exporta el contenedor de la aplicación
export default AppContainer;
