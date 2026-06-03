

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AppNavigator from '../src/routes/Index';

import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

export default function App() {
  return (
    <AppNavigator />

  )
}