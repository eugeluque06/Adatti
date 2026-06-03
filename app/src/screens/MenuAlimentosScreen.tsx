import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native';
import React from 'react';


export default function MenuAlimentosScreen( { navigation }) {
  return (
    <ScrollView>
    <ParallaxScrollView
    headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    headerImage={
      <><Image
        source={require('@/assets/images/sin_gluten_legal-01.png')}
        style={styles.SinGlutenLogo} />
       </>

    }>
     
    <TouchableOpacity style={styles.buton} onPress={() =>  navigation.navigate('Scanner')}  >
       <Text> Scanea un codigo </Text>
     </TouchableOpacity>


     <TouchableOpacity style={styles.buton} onPress={() =>  navigation.navigate('Search')}  >
       <Text> buscar por codigo </Text>
     </TouchableOpacity>

    <TouchableOpacity style={styles.buton} onPress={() =>  navigation.navigate('Carga')}  >
       <Text> carga un alimento </Text>
     </TouchableOpacity>

    <TouchableOpacity style={styles.buton} onPress={() =>  navigation.navigate('categoria')}  >
       <Text> categorias de alimentos  </Text>
     </TouchableOpacity>

  </ParallaxScrollView>
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  SinGlutenLogo: {
    height: 300,
    width: 300,
    left: 50,
    alignItems: 'center',
    position: 'absolute',
  },
  buton: {
    
    alignItems: 'center',
    backgroundColor: '#6495ed',
    padding: 10,
  },
});
