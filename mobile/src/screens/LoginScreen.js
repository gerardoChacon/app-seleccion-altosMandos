import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
    // Aquí implementar la lógica de login
    console.log('Login attempt:', { email, password });
  };

  const handleForgotPassword = () => {
    // Navegación a pantalla de recuperar contraseña
    navigation && navigation.navigate('RecuperarContrasena');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* Título */}
            <Text style={styles.title}>LOGIN</Text>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <MaterialIcons name="account-circle" size={48} color="#2d3e50" />
            </View>

            {/* Campo de correo */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo"
                placeholderTextColor="#6b7d8e"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Campo de contraseña */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#6b7d8e"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            {/* Enlace recuperar contraseña */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
            </TouchableOpacity>

            {/* Botón entrar */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaf0',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#7a8ea8',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    color: '#1e2d3d',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#c9d4e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#c9d4e0',
    fontSize: 14,
    color: '#3a4a5c',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginBottom: 28,
  },
  forgotPassword: {
    fontSize: 12,
    color: '#2d3e50',
    opacity: 0.85,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#5b7290',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});