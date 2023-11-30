import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View } from 'react-native';
import {
  useNavigation,
} from "@react-navigation/native";

import  AppNavigation  from './src/navigation/AppNavigator';
export default function App() {
 

  return <AppNavigation />;

};
