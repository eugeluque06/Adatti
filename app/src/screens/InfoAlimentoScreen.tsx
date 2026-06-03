import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";


export default function ProductoScreen() {
  const [loading, setLoading] = useState(true);
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
const API_URL = "http://127.0.0.1:8000";


  useEffect(() => {
    fetch(API_URL) // ⚠️ cambiar por tu IP
      .then((res) => res.json())
      .then((data) => {
        if (data.disponible) {
          setProducto(data.producto);
        } else {
          setError("Producto no disponible");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error al conectar con el servidor");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <Text>Nombre: {producto.nombre}</Text>
      <Text>marca: {producto.marca}</Text>
      <Text>RNPA: {producto.rnpa}</Text>
      <Text>Categoria: {producto.categoria}</Text>  
      <Text>tipo_prodcuto: {producto.tipo_producto}</Text>
      <Text>descripcion: {producto.descripcion}</Text>
    </View>
  );
}