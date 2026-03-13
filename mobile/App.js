import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RecuperarContrasenaScreen from './src/screens/RecuperarContrasenaScreen';
// import VacantesScreen from './src/screens/VacantesScreen';
// import ResultadoEvaluacionScreen from './src/screens/ResultadoEvaluacionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Oculta el header por defecto para mejor control del diseño
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Iniciar Sesión',
          }}
        />
        <Stack.Screen
          name="RecuperarContrasena"
          component={RecuperarContrasenaScreen}
          options={{
            title: 'Recuperar Contraseña',
          }}
        />
        {/* Pantallas adicionales disponibles pero no conectadas aún */}
        {/*
        <Stack.Screen
          name="Vacantes"
          component={VacantesScreen}
          options={{
            title: 'Vacantes Disponibles',
          }}
        />
        <Stack.Screen
          name="ResultadoEvaluacion"
          component={ResultadoEvaluacionScreen}
          options={{
            title: 'Resultados de Evaluación',
          }}
        />
        <Stack.Screen name="VacanteDetalle" component={VacanteDetalleScreen} />
        */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
