import React from 'react';
import { View, Text, Button } from 'react-native';

const SearchBar = ( {navigation}) => {
  // Lógica del buscador

  return (
    <View>
      <Text>Buscador</Text>
      {/* Puedes agregar aquí la lógica del buscador */}


      <Button
        title="Volver a Inicio"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default SearchBar;
