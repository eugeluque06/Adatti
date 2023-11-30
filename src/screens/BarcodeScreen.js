import React from 'react';
import { View, Text, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

  const BarcodeScanner = ({ navigation}) => {
  // Lógica del lector de códigos de barras

  return (
    <View>
      <Text>Lector de Códigos de Barras</Text>
      {/* Puedes agregar aquí la lógica del lector de códigos de barras */}

      <Button
        title="Volver a Inicio"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default BarcodeScanner;
