// Importa las bibliotecas necesarias
import React from 'react';
import { View, Text, Button } from 'react-native';

// Define el componente de la pantalla de inicio
const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>¡Bienvenido a la pantalla de inicio!</Text>
      <Button
        title="Ir al Perfil"
        onPress={() => navigation.navigate('perfil')}
      />


      <Button
        title="Ir a leer un codigo"
        onPress={() => navigation.navigate('code')}
      />


      <Button
        title="Ir a buscar un elemento por su nombre"
        onPress={() => navigation.navigate('search')}
      />
    </View>
  );
};

// Exporta el componente
export default HomeScreen;
