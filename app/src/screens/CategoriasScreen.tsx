import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View  } from "react-native";

type CategoriaParams = {
  nombre : string;
};

export default function CategoriasScreen(): import("react").JSX.Element {
  const { nombre } = useLocalSearchParams<CategoriaParams>();
  
  return (
   <View style={styles.container}>
      <Stack.Screen options={{ title: nombre }} />
      <Text style={styles.title}>Categoria</Text>
      <Text style={styles.value}>{nombre}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 18,
        marginTop: 10,
    },
});