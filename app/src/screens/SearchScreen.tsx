import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator } from "react-native";

export default function BuscarProducto() {
  const [codigo, setCodigo] = useState("");
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


const API_URL = "http://127.0.0.1:8000";
  const buscarProducto = () => {
    setLoading(true);
    setError(null);
    setProducto(null);

    fetch(`${API_URL}/producto/rnpa/${codigo}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((data) => {
        if (data.disponible) {
          setProducto(data.producto);
        } else {
          setError("Producto no disponible");
        }
      })
      .catch(() => {
        setError("Producto no encontrado o error de conexión");
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Buscar producto por RNPA</Text>

      <TextInput
        placeholder="Ej: RNPA123"
        value={codigo}
        onChangeText={setCodigo}
        style={{
          borderWidth: 1,
          marginVertical: 10,
          padding: 8,
        }}
      />

      <Button title="Buscar" onPress={buscarProducto} />

      {loading && <ActivityIndicator size="large" />}

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {producto && (
        <View>
          <Text>Nombre: {producto.nombre}</Text>
          <Text>Precio: ${producto.precio}</Text>
        </View>
      )}
    </View>
  );
}