// App.js (tu pantalla de cámara)
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function App({ navigation }) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (permission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>necesitamos permiso para acceder a la camara</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Función para manejar el escaneo
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      'Código escaneado',
      `Código: ${data}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setScanned(false)
        },
        {
          text: 'Consultar',
          onPress: () => {
            // Navegar a la pantalla de resultados con el código escaneado
            navigation.navigate('Resultado Alimentos', { barcode: data });
            setScanned(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <CameraView 
          style={styles.camera} 
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code39', 'code128']
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Voltear Cámara</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
        
      </View>
       
      <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
          Enfoca el código de barras del producto en el marco
        </Text>    
        {scanned && (
          <TouchableOpacity 
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanText}>Tocar para escanear de nuevo</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.buton1} onPress={() => navigation.navigate('Menu Alimentos')}>
        <Text>Sección Alimentos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buton} onPress={() => navigation.navigate('Resultado Alimentos', { barcode: '' })}>
        <Text>Buscar Alimento Manual</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    height: 300,
    width: 300,
    alignItems: 'center',
    backgroundColor: '#6495ed',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  frame: {
    height: 320,
    width: 320,
    position: "absolute",
    top: "10%",
    left: "10%",
    right: "10%",
    bottom: "10%",
    borderWidth: 2,
    borderColor: "#6495ed",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buton: {
    position: 'absolute',
    margin: 16,
    bottom: 0,
    backgroundColor: '#6495ed',
    padding: 10,
    right: 0,
    borderRadius: 5
  },
  buton1: {
    position: 'absolute',
    margin: 16,
    bottom: 0,
    backgroundColor: '#6495ed',
    padding: 10,
    left: 0,
    borderRadius: 5
  },
  instructions: {
    position: 'absolute',
    top: '45%',
    alignItems: 'center',
    width: '100%'
  },
  instructionsText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100
  },
  rescanButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#6495ed',
    borderRadius: 5
  },
  rescanText: {
    color: 'white',
    fontWeight: 'bold'
  }
});