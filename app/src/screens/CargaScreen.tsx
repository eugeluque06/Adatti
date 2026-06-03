import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  SafeAreaView,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  IconButton,
  List,
} from 'react-native-paper';
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export default function CargaScreen({ navigation }) {
  // Estado para almacenar los datos del producto
  const [foodData, setFoodData] = useState({
    nombre: '',
    marca: '',
    RNPA: '',
    categoria: '',
    tipo_producto: '',
    descripcion: '',
  });

  // Estado para los ingredientes (lista dinámica)
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');

  // Estado para mostrar los datos
  const [showData, setShowData] = useState(false);
  const [productos, setProductos] = useState([]);

  // Manejar cambios en los inputs
  const handleInputChange = (field, value) => {
    setFoodData({
      ...foodData,
      [field]: value,
    });
  };

  // Funciones para manejar ingredientes
  const agregarIngrediente = () => {
    if (nuevoIngrediente.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un nombre de ingrediente');
      return;
    }
    
    setIngredientes([...ingredientes, { nombre: nuevoIngrediente.trim() }]);
    setNuevoIngrediente(''); // Limpiar el input
  };

  const eliminarIngrediente = (index) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes.splice(index, 1);
    setIngredientes(nuevosIngredientes);
  };

  // Validar y mostrar los datos
  const handleShowData = () => {
    if (!foodData.nombre) {
      Alert.alert('Error', 'Por favor completa al menos el nombre');
      return;
    }
    setShowData(true);
  };

  // Limpiar el formulario
  const handleClear = () => {
    setFoodData({
      nombre: '',
      marca: '',
      RNPA: '',
      categoria: '',
      tipo_producto: '',
      descripcion: '',
    });
    setIngredientes([]); // Limpiar ingredientes
    setNuevoIngrediente('');
    setShowData(false);
  };

  const handleGuardarEnAPI = async () => {
    try {
      // Validación básica
      if (!foodData.nombre) {
        Alert.alert('Error', 'El nombre es obligatorio');
        return;
      }

      // Preparar los datos para la API
      const productoData = {
        nombre: foodData.nombre,
        marca: foodData.marca || "",
        RNPA: foodData.RNPA ? parseInt(foodData.RNPA, 10) : 0,
        categoria: foodData.categoria || "",
        tipo_producto: foodData.tipo_producto || "",
        ingredientes: ingredientes, // Lista dinámica de ingredientes
        descripcion: foodData.descripcion || ""
      };

      console.log("Enviando a API:", productoData);

      const response = await axios.post(`${API_URL}/producto`, productoData);

      Alert.alert("Éxito", "Producto guardado en la API 🎉");
      console.log("Respuesta:", response.data);

      handleClear(); // limpia el formulario

    } catch (error) {
      console.error("Error completo:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        Alert.alert("Error", `Error del servidor: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.log("No response:", error.request);
        Alert.alert("Error", "No se pudo conectar con el servidor");
      } else {
        Alert.alert("Error", `Error: ${error.message}`);
      }
    }
  };

  const mostrarProducto = async () => {
    try {
      const response = await axios.get(`${API_URL}/producto`);
      console.log("PRODUCTOS:", response.data);
      setProductos(response.data);
      Alert.alert("Éxito", `Se encontraron ${response.data.length} productos`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron obtener los productos");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Title style={styles.title}>Formulario de Productos</Title>
        
        <Card style={styles.card}>
          <Card.Content>
            {/* Información básica del producto */}
            <TextInput
              label="Nombre del producto *"
              value={foodData.nombre}
              onChangeText={(text) => handleInputChange('nombre', text)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Marca"
              value={foodData.marca}
              onChangeText={(text) => handleInputChange('marca', text)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="RNPA"
              value={foodData.RNPA}
              onChangeText={(text) => handleInputChange('RNPA', text)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Categoría"
              value={foodData.categoria}
              onChangeText={(text) => handleInputChange('categoria', text)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Tipo de producto"
              value={foodData.tipo_producto}
              onChangeText={(text) => handleInputChange('tipo_producto', text)}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Descripción"
              value={foodData.descripcion}
              onChangeText={(text) => handleInputChange('descripcion', text)}
              multiline
              numberOfLines={3}
              style={styles.input}
              mode="outlined"
            />

            {/* Sección de ingredientes dinámicos */}
            <Divider style={styles.sectionDivider} />
            <Title style={styles.sectionTitle}>Ingredientes</Title>
            
            <View style={styles.ingredienteInputContainer}>
              <TextInput
                label="Nombre del ingrediente"
                value={nuevoIngrediente}
                onChangeText={setNuevoIngrediente}
                style={[styles.input, styles.ingredienteInput]}
                mode="outlined"
              />
              <Button
                mode="contained"
                onPress={agregarIngrediente}
                style={styles.agregarButton}
                icon="plus"
              >
                Agregar
              </Button>
            </View>

            {/* Lista de ingredientes agregados */}
            {ingredientes.length > 0 ? (
              <Card style={styles.ingredientesListCard}>
                <Card.Content>
                  <Text style={styles.ingredientesCount}>
                    {ingredientes.length} ingrediente{ingredientes.length !== 1 ? 's' : ''} agregado{ingredientes.length !== 1 ? 's' : ''}
                  </Text>
                  {ingredientes.map((ingrediente, index) => (
                    <View key={index} style={styles.ingredienteItem}>
                      <View style={styles.ingredienteInfo}>
                        <Text style={styles.ingredienteNumber}>{index + 1}.</Text>
                        <Text style={styles.ingredienteNombre}>
                          {ingrediente.nombre}
                        </Text>
                      </View>
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => eliminarIngrediente(index)}
                        style={styles.deleteButton}
                      />
                    </View>
                  ))}
                </Card.Content>
              </Card>
            ) : (
              <Text style={styles.noIngredientesText}>
                No hay ingredientes agregados. Agrega uno usando el campo superior.
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleShowData}
                style={[styles.button, styles.showButton]}
                disabled={!foodData.nombre}
              >
                Mostrar Datos
              </Button>
              
              <Button 
                mode="contained" 
                onPress={handleGuardarEnAPI}
                style={[styles.button, { backgroundColor: '#4CAF50' }]}
              >
                Guardar en API
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleClear}
                style={styles.button}
              >
                Limpiar
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Mostrar datos del producto */}
        {showData && (
          <Card style={[styles.card, styles.dataCard]}>
            <Card.Content>
              <Title style={styles.dataTitle}>Datos del Producto</Title>
              
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Nombre:</Text>
                <Text style={styles.dataValue}>{foodData.nombre}</Text>
              </View>
              
              {foodData.marca ? (
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Marca:</Text>
                  <Text style={styles.dataValue}>{foodData.marca}</Text>
                </View>
              ) : null}
              
              {foodData.RNPA ? (
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>RNPA:</Text>
                  <Text style={styles.dataValue}>{foodData.RNPA}</Text>
                </View>
              ) : null}
              
              {foodData.categoria ? (
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Categoría:</Text>
                  <Text style={styles.dataValue}>{foodData.categoria}</Text>
                </View>
              ) : null}
              
              {foodData.tipo_producto ? (
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Tipo:</Text>
                  <Text style={styles.dataValue}>{foodData.tipo_producto}</Text>
                </View>
              ) : null}

              {/* Mostrar ingredientes */}
              {ingredientes.length > 0 && (
                <>
                  <Divider style={styles.divider} />
                  <Text style={styles.dataLabel}>Ingredientes:</Text>
                  {ingredientes.map((ingrediente, index) => (
                    <View key={index} style={styles.dataRow}>
                      <Text style={styles.dataSubLabel}>{index + 1}.</Text>
                      <Text style={styles.dataValue}>{ingrediente.nombre}</Text>
                    </View>
                  ))}
                </>
              )}

              <Divider style={styles.divider} />

              {foodData.descripcion && (
                <>
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.dataLabel}>Descripción:</Text>
                    <Paragraph style={styles.descriptionText}>
                      {foodData.descripcion}
                    </Paragraph>
                  </View>
                </>
              )}
            </Card.Content>
          </Card>
        )}
        
        <TouchableOpacity 
          style={styles.buton} 
          onPress={() => navigation.navigate('Menu Alimentos')}
        >
          <Text>Seccion Alimentos</Text>
        </TouchableOpacity>

        <Button 
          mode="contained" 
          onPress={mostrarProducto}
          style={[styles.button, { backgroundColor: '#4CAF50', marginTop: 10 }]}
        >
          Mostrar Productos Guardados
        </Button>

        {/* Mostrar lista de productos guardados */}
        {productos.length > 0 && (
          <Card style={[styles.card, { marginTop: 16 }]}>
            <Card.Content>
              <Title style={styles.dataTitle}>Productos en API</Title>
              {productos.map((prod, index) => (
                <View key={index} style={styles.productoItem}>
                  <Text style={styles.productoNombre}>{prod.nombre}</Text>
                  <Text style={styles.productoDetalle}>
                    {prod.ingredientes?.length || 0} ingredientes
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  showButton: {
    backgroundColor: '#2196F3',
  },
  dataCard: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  dataTitle: {
    textAlign: 'center',
    color: '#2E7D32',
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  dataSubLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 30,
  },
  dataValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    marginVertical: 8,
  },
  sectionDivider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ingredienteInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredienteInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  agregarButton: {
    height: 50,
    justifyContent: 'center',
  },
  ingredientesListCard: {
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  ingredientesCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  ingredienteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  ingredienteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ingredienteNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 30,
  },
  ingredienteNombre: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    margin: 0,
  },
  noIngredientesText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 16,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buton: {
    alignItems: 'center',
    backgroundColor: '#6495ed',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  productoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  productoDetalle: {
    fontSize: 14,
    color: '#666',
  },
});