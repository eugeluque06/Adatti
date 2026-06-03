// screens/GlutenCheckScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const AlimentosScreen = () => {
  const [barcode, setBarcode] = useState('3017620422003'); // Nutella de ejemplo
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // Ejemplos de códigos de barras para probar
  const sampleBarcodes = [
    { code: '3017620422003', name: 'Nutella' },
    { code: '5449000000996', name: 'Coca-Cola' },
    { code: '8076809515612', name: 'Barilla Pasta' },
    { code: '8410031964907', name: 'Fanta Naranja' },
    { code: '8480000341204', name: 'Lays Patatas' }
  ];

  // Función para analizar si es apto para celíacos
  const analyzeGlutenStatus = (productData) => {
    const analysis = {
      isGlutenFree: false,
      confidence: 'low',
      reasons: [],
      warnings: [],
      safeIngredients: [],
      riskyIngredients: [],
      labels: [],
      certifications: []
    };

    // 1. Verificar etiquetas explícitas
    if (productData.labels_tags) {
      analysis.labels = productData.labels_tags;
      
      const glutenFreeLabels = productData.labels_tags.filter(label => 
        label.toLowerCase().includes('gluten-free') ||
        label.toLowerCase().includes('sin-gluten') ||
        label.toLowerCase().includes('sin_gluten') ||
        label.toLowerCase().includes('sans-gluten') ||
        label.toLowerCase().includes('celiac') ||
        label.toLowerCase().includes('celíaco')
      );

      if (glutenFreeLabels.length > 0) {
        analysis.isGlutenFree = true;
        analysis.confidence = 'high';
        analysis.reasons.push('Tiene etiqueta sin gluten certificada');
        analysis.certifications = glutenFreeLabels;
      }
    }

    // 2. Verificar alérgenos
    if (productData.allergens_tags) {
      const glutenAllergens = productData.allergens_tags.filter(allergen => 
        allergen.includes('gluten') ||
        allergen.includes('trigo') ||
        allergen.includes('cebada') ||
        allergen.includes('centeno') ||
        allergen.includes('avena')
      );

      if (glutenAllergens.length > 0) {
        analysis.isGlutenFree = false;
        analysis.confidence = 'high';
        analysis.warnings.push('Contiene alérgenos con gluten');
        analysis.riskyIngredients.push(...glutenAllergens.map(a => a.replace('en:', '')));
      }
    }

    // 3. Verificar trazas
    if (productData.traces_tags) {
      const glutenTraces = productData.traces_tags.filter(trace => 
        trace.includes('gluten')
      );

      if (glutenTraces.length > 0) {
        analysis.isGlutenFree = false;
        analysis.confidence = analysis.confidence === 'low' ? 'medium' : analysis.confidence;
        analysis.warnings.push('Puede contener trazas de gluten');
      }
    }

    // 4. Analizar ingredientes
    if (productData.ingredients_text) {
      const ingredientsText = productData.ingredients_text.toLowerCase();
      
      // Ingredientes que contienen gluten
      const glutenIngredients = [
        'trigo', 'wheat', 'blé', 'weizen',
        'cebada', 'barley', 'orge', 'gerste',
        'centeno', 'rye', 'seigle', 'roggen',
        'avena', 'oats', 'avoine', 'hafer',
        'espelta', 'spelt', 'épeautre',
        'kamut', 'triticale',
        'malta', 'malt', 'malz',
        'levadura de cerveza', 'brewer\'s yeast',
        'harina', 'flour', 'farine', 'mehl',
        'sémola', 'semolina', 'semoule',
        'gluten', 'seitan', 'cuscús', 'couscous',
        'bulgur', 'pan', 'bread', 'pain', 'brot',
        'galleta', 'cookie', 'biscuit', 'keks',
        'pasta', 'macarrones', 'spaghetti',
        'salsa de soja', 'soy sauce', 'sauce soja',
        'cerveza', 'beer', 'bière', 'bier'
      ];

      const foundIngredients = glutenIngredients.filter(ingredient => 
        ingredientsText.includes(ingredient)
      );

      if (foundIngredients.length > 0) {
        analysis.isGlutenFree = false;
        analysis.confidence = 'high';
        analysis.riskyIngredients.push(...foundIngredients);
        analysis.warnings.push(`Contiene ingredientes con gluten: ${foundIngredients.join(', ')}`);
      }

      // Ingredientes generalmente seguros
      const safeIngredientsList = [
        'maíz', 'corn', 'maïs', 'mais',
        'arroz', 'rice', 'riz', 'reis',
        'quinua', 'quinoa',
        'mijo', 'millet',
        'tapioca',
        'patata', 'potato', 'pomme de terre', 'kartoffel',
        'yuca', 'cassava',
        'amaranto',
        'teff',
        'sorgo', 'sorghum'
      ];

      analysis.safeIngredients = safeIngredientsList.filter(ingredient => 
        ingredientsText.includes(ingredient)
      );
    }

    // 5. Verificar categorías de riesgo
    if (productData.categories_tags) {
      const riskyCategories = [
        'pan',
        'pasta',
        'cereales',
        'galletas',
        'bolleria',
        'cerveza',
        'salsas',
        'comida preparada'
      ];

      const foundCategories = riskyCategories.filter(category => 
        productData.categories_tags.some(tag => tag.toLowerCase().includes(category))
      );

      if (foundCategories.length > 0 && analysis.confidence === 'low') {
        analysis.confidence = 'medium';
        analysis.warnings.push(`Producto de categoría de riesgo: ${foundCategories.join(', ')}`);
      }
    }

    // 6. Si no hay información clara
    if (analysis.confidence === 'low') {
      analysis.warnings.push('Información limitada. Se recomienda verificar en el envase.');
    }

    return analysis;
  };

  // Función para buscar producto
  const searchProduct = async (inputBarcode = barcode) => {
    if (!inputBarcode.trim()) {
      Alert.alert('Error', 'Por favor ingresa un código de barras');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${inputBarcode}.json`
      );
      
      if (!response.ok) {
        throw new Error('Error al consultar la API');
      }

      const data = await response.json();
      
      if (data.status === 0) {
        throw new Error('Producto no encontrado');
      }

      const glutenAnalysis = analyzeGlutenStatus(data.product);
      
      const productInfo = {
        ...data.product,
        glutenAnalysis,
        searchedAt: new Date().toISOString()
      };

      setProduct(productInfo);
      
      // Agregar al historial
      setHistory(prev => [
        {
          barcode: inputBarcode,
          name: data.product.product_name || 'Producto sin nombre',
          brand: data.product.brands,
          isGlutenFree: glutenAnalysis.isGlutenFree,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 4) // Mantener solo los últimos 5
      ]);

    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Componente de tarjeta de estado
  const GlutenStatusCard = ({ analysis }) => {
    const getStatusConfig = () => {
      if (analysis.isGlutenFree) {
        return {
          title: 'APTÓ PARA CELÍACOS',
          subtitle: 'Este producto no contiene gluten',
          color: '#10B981',
          icon: 'check-circle',
          bgColor: '#D1FAE5',
          iconColor: '#047857'
        };
      } else {
        return {
          title: 'NO APTÓ PARA CELÍACOS',
          subtitle: 'Contiene o puede contener gluten',
          color: '#EF4444',
          icon: 'exclamation-circle',
          bgColor: '#FEE2E2',
          iconColor: '#B91C1C'
        };
      }
    };

    const config = getStatusConfig();

    return (
      <View style={[styles.statusCard, { backgroundColor: config.bgColor }]}>
        <View style={styles.statusHeader}>
          <FontAwesome5 name={config.icon} size={32} color={config.iconColor} />
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, { color: config.color }]}>
              {config.title}
            </Text>
            <Text style={styles.statusSubtitle}>{config.subtitle}</Text>
          </View>
        </View>

        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>
            Confianza: {analysis.confidence === 'high' ? 'ALTA' : 
                       analysis.confidence === 'medium' ? 'MEDIA' : 'BAJA'}
          </Text>
        </View>
      </View>
    );
  };

  // Componente de detalles
  const ProductDetails = () => {
    if (!product) return null;

    return (
      <Modal
        visible={showDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles del Análisis</Text>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailsList}>
              {/* Razones */}
              {product.glutenAnalysis.reasons.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    <Ionicons name="checkmark-done" size={16} color="#10B981" /> 
                    Razones para considerar seguro:
                  </Text>
                  {product.glutenAnalysis.reasons.map((reason, index) => (
                    <Text key={index} style={styles.detailItem}>• {reason}</Text>
                  ))}
                </View>
              )}

              {/* Advertencias */}
              {product.glutenAnalysis.warnings.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionTitle, { color: '#EF4444' }]}>
                    <Ionicons name="warning" size={16} color="#EF4444" /> 
                    Advertencias:
                  </Text>
                  {product.glutenAnalysis.warnings.map((warning, index) => (
                    <Text key={index} style={styles.detailItem}>• {warning}</Text>
                  ))}
                </View>
              )}

              {/* Ingredientes riesgosos */}
              {product.glutenAnalysis.riskyIngredients.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    <Ionicons name="alert-circle" size={16} color="#F59E0B" /> 
                    Ingredientes con gluten detectados:
                  </Text>
                  {product.glutenAnalysis.riskyIngredients.map((ing, index) => (
                    <Text key={index} style={styles.detailItem}>• {ing}</Text>
                  ))}
                </View>
              )}

              {/* Ingredientes seguros */}
              {product.glutenAnalysis.safeIngredients.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    <Ionicons name="shield-checkmark" size={16} color="#10B981" /> 
                    Ingredientes sin gluten:
                  </Text>
                  {product.glutenAnalysis.safeIngredients.map((ing, index) => (
                    <Text key={index} style={styles.detailItem}>• {ing}</Text>
                  ))}
                </View>
              )}

              {/* Etiquetas */}
              {product.glutenAnalysis.labels.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    <MaterialIcons name="label" size={16} color="#6366F1" /> 
                    Etiquetas del producto:
                  </Text>
                  <View style={styles.tagsContainer}>
                    {product.glutenAnalysis.labels.map((label, index) => {
                      const cleanLabel = label.replace('en:', '').replace('es:', '');
                      return (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{cleanLabel}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Información general */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  <Ionicons name="information-circle" size={16} color="#6366F1" /> 
                  Información del producto:
                </Text>
                <Text style={styles.detailItem}>• Código: {product.code}</Text>
                {product.brands && (
                  <Text style={styles.detailItem}>• Marca: {product.brands}</Text>
                )}
                {product.quantity && (
                  <Text style={styles.detailItem}>• Cantidad: {product.quantity}</Text>
                )}
                {product.stores && (
                  <Text style={styles.detailItem}>• Tiendas: {product.stores}</Text>
                )}
                {product.countries && (
                  <Text style={styles.detailItem}>• País: {product.countries}</Text>
                )}
              </View>

              {/* Descargo de responsabilidad */}
              <View style={styles.disclaimer}>
                <Text style={styles.disclaimerTitle}>⚠️ IMPORTANTE</Text>
                <Text style={styles.disclaimerText}>
                  Esta información es proporcionada como referencia. Siempre verifica 
                  la información en el envase del producto y consulta con tu médico 
                  si tienes dudas. Los fabricantes pueden cambiar sus recetas.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="food-bank" size={32} color="#10B981" />
          <Text style={styles.headerTitle}>GlutenCheck</Text>
          <Text style={styles.headerSubtitle}>Verificador para Celíacos</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Buscador */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Consultar Producto</Text>
          <Text style={styles.sectionSubtitle}>
            Escanea o ingresa el código de barras
          </Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ej: 3017620422003"
              value={barcode}
              onChangeText={setBarcode}
              keyboardType="numeric"
              maxLength={13}
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => searchProduct()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <MaterialIcons name="search" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Códigos de ejemplo */}
          <Text style={styles.sampleTitle}>Ejemplos para probar:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.samplesContainer}>
              {sampleBarcodes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.sampleButton}
                  onPress={() => {
                    setBarcode(item.code);
                    searchProduct(item.code);
                  }}
                >
                  <Text style={styles.sampleCode}>{item.code}</Text>
                  <Text style={styles.sampleName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Resultados */}
        {product && (
          <View style={styles.resultSection}>
            <View style={styles.productHeader}>
              {product.image_url && (
                <Image 
                  source={{ uri: product.image_url }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.product_name || 'Producto sin nombre'}
                </Text>
                {product.brands && (
                  <Text style={styles.productBrand}>{product.brands}</Text>
                )}
              </View>
            </View>

            {/* Estado gluten */}
            <GlutenStatusCard analysis={product.glutenAnalysis} />

            {/* Botón ver detalles */}
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => setShowDetails(true)}
            >
              <Text style={styles.detailsButtonText}>
                Ver análisis detallado
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
        )}

        {/* Historial */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
            {history.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => {
                  setBarcode(item.barcode);
                  searchProduct(item.barcode);
                }}
              >
                <View style={styles.historyIcon}>
                  <MaterialIcons 
                    name={item.isGlutenFree ? "check-circle" : "warning"} 
                    size={20} 
                    color={item.isGlutenFree ? "#10B981" : "#EF4444"} 
                  />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.historyBrand}>{item.brand}</Text>
                </View>
                <Text style={styles.historyBarcode}>{item.barcode}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Información importante */}
        <View style={styles.infoCard}>
          <MaterialIcons name="medical-services" size={24} color="#6366F1" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Recomendaciones importantes</Text>
            <Text style={styles.infoText}>
              • Siempre verifica la etiqueta del producto{'\n'}
              • Busca el símbolo "Sin Gluten" certificado{'\n'}
              • En caso de duda, no consumas el producto{'\n'}
              • Consulta con tu médico o nutricionista
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de detalles */}
      <ProductDetails />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerContent: {
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16
  },
  searchSection: {
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 16,
    marginRight: 8
  },
  searchButton: {
    backgroundColor: '#10B981',
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sampleTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8
  },
  samplesContainer: {
    flexDirection: 'row',
    paddingVertical: 8
  },
  sampleButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 100
  },
  sampleCode: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace'
  },
  sampleName: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
    marginTop: 4
  },
  resultSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  productInfo: {
    flex: 1
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937'
  },
  productBrand: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  statusCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B7280'
  },
  confidenceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8
  },
  confidenceText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500'
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginTop: 12
  },
  detailsButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500'
  },
  historySection: {
    marginTop: 24,
    marginBottom: 16
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  historyIcon: {
    marginRight: 12
  },
  historyInfo: {
    flex: 1
  },
  historyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937'
  },
  historyBrand: {
    fontSize: 12,
    color: '#6B7280'
  },
  historyBarcode: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace'
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24
  },
  infoContent: {
    flex: 1,
    marginLeft: 12
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 4
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18
  },
  // Estilos del modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 24
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937'
  },
  detailsList: {
    padding: 16
  },
  detailSection: {
    marginBottom: 20
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailItem: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
    marginLeft: 8
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6
  },
  tagText: {
    fontSize: 12,
    color: '#4B5563'
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 8
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16
  }
});

export default AlimentosScreen;