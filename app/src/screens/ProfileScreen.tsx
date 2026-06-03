import ParallaxScrollView from '@/components/ParallaxScrollView';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';


export default function ProfileScreen() {
 
  return (
    <ScrollView style={styles.container}>
      {/* Header con la imagen de perfil */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Juan Pérez</Text>
        <Text style={styles.email}>juan.perez@example.com</Text>
      </View>

      {/* Información adicional */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <Text style={styles.infoText}>Teléfono: +1 234 567 890</Text>
        <Text style={styles.infoText}>Ubicación: Ciudad de México, México</Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]}>
          <Text style={[styles.buttonText, styles.logoutText]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#1D3D47',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#fff',
  },
  infoSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  actionSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
  logoutText: {
    color: '#fff',
  },
});
