// Importa las bibliotecas necesarias
import React from 'react';
import { View, Text, Button } from 'react-native';

// Define el componente de la pantalla de perfil

const ProfileScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Esta es la pantalla de perfil</Text>
      <Button
        title="Volver a Inicio"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

// Exporta el componente
export default ProfileScreen;
