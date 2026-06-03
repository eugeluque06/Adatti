import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native';
import ProfileScreen from './ProfileScreen';
import React from 'react';


export default function HomeScreen( { navigation }) {
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
     
    
     <TouchableOpacity style={styles.buton} onPress={() =>  navigation.navigate('Profile')}  >
       <Text> Perfil de usuario </Text>
     </TouchableOpacity>

     <TouchableOpacity style={styles.buton} onPress={() => navigation.navigate('Menu Alimentos')}  >
          <Text> Seccion Alimentos  </Text>
     </TouchableOpacity>
     <TouchableOpacity style={styles.buton} onPress={() => navigation.navigate('Locales')}  >
          <Text> locales   </Text>
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
