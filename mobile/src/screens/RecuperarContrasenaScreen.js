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

export default function RecuperarContrasenaScreen({ navigation }) {
  // useState guarda si el usuario ya envio el codigo o no
  // false = aun no envio, true = ya envio y mostramos el campo codigo
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');

  const handleEnviarCodigo = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu correo electrónico');
      return;
    }

    // Simular envío de código
    setCodigoEnviado(true);
    Alert.alert(
      'Código Enviado',
      'Se ha enviado un código de verificación a tu correo electrónico.'
    );
  };

  const handleEntrar = () => {
    if (!codigo.trim()) {
      Alert.alert('Error', 'Por favor, ingresa el código de verificación');
      return;
    }

    Alert.alert(
      'Contraseña Restablecida',
      'Tu contraseña ha sido restablecida exitosamente.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleVolver = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {/* Botón volver */}
            <TouchableOpacity style={styles.backButton} onPress={handleVolver}>
              <MaterialIcons name="arrow-back" size={24} color="#2d3e50" />
            </TouchableOpacity>

            {/* Título */}
            <Text style={styles.title}>RECUPERAR{'\n'}CONTRASEÑA</Text>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <MaterialIcons name="account-circle" size={48} color="#2d3e50" />
            </View>

            {/* Sección 1: Ingresar correo */}
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

            {/* Botón enviar código */}
            <TouchableOpacity style={styles.button} onPress={handleEnviarCodigo}>
              <Text style={styles.buttonText}>Enviar código</Text>
            </TouchableOpacity>

            {/* Línea divisora */}
            <View style={styles.divider} />

            {/* Sección 2: Ingresar código */}
            <Text style={styles.hint}>Ingresa el código que se envió a tu correo</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  !codigoEnviado && styles.inputDisabled
                ]}
                placeholder="Codigo"
                placeholderTextColor="#6b7d8e"
                value={codigo}
                onChangeText={setCodigo}
                editable={codigoEnviado}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {/* Botón entrar */}
            <TouchableOpacity
              style={[
                styles.button,
                !codigoEnviado && styles.buttonDisabled
              ]}
              onPress={handleEntrar}
              disabled={!codigoEnviado}
            >
              <Text style={[
                styles.buttonText,
                !codigoEnviado && styles.buttonTextDisabled
              ]}>
                Entrar
              </Text>
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
  },
  title: {
    color: '#1e2d3d',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#c9d4e0',
    fontSize: 14,
    color: '#3a4a5c',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  inputDisabled: {
    backgroundColor: '#b0c0d0',
    opacity: 0.6,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#5b7290',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#98a8b8',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#9aaec0',
    marginVertical: 12,
  },
  hint: {
    fontSize: 12,
    color: '#2d3e50',
    alignSelf: 'flex-start',
    marginBottom: 8,
    opacity: 0.85,
  },
});