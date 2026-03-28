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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

export default function RecuperarContrasenaScreen({ navigation }) {
  // paso 1: email  |  paso 2: código  |  paso 3: nueva contraseña
  const [paso,          setPaso]          = useState(1);
  const [email,         setEmail]         = useState('');
  const [codigo,        setCodigo]        = useState('');
  const [nuevaPass,     setNuevaPass]     = useState('');
  const [confirmaPass,  setConfirmaPass]  = useState('');
  const [loading,       setLoading]       = useState(false);

  async function handleEnviarCodigo() {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu correo electrónico');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { correo: email.trim().toLowerCase() });
      setPaso(2);
      Alert.alert('Código Enviado', 'Se ha enviado un código de verificación a tu correo.');
    } catch (err) {
      Alert.alert('Error', err.message ?? 'No se pudo enviar el código');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerificarCodigo() {
    if (!codigo.trim()) {
      Alert.alert('Error', 'Por favor, ingresa el código de verificación');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/verify-code', { correo: email.trim().toLowerCase(), codigo });
      setPaso(3);
    } catch (err) {
      Alert.alert('Error', err.message ?? 'Código inválido o expirado');
    } finally {
      setLoading(false);
    }
  }

  async function handleRestablecerContrasena() {
    if (!nuevaPass || nuevaPass !== confirmaPass) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        correo:                 email.trim().toLowerCase(),
        codigo,
        nueva_contrasena:       nuevaPass,
        nueva_contrasena_confirmation: confirmaPass,
      });
      Alert.alert(
        'Contraseña Restablecida',
        'Tu contraseña ha sido restablecida exitosamente.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Error', err.message ?? 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#2d3e50" />
            </TouchableOpacity>

            <Text style={styles.title}>RECUPERAR{'\n'}CONTRASEÑA</Text>

            <View style={styles.avatarWrapper}>
              <MaterialIcons name="account-circle" size={48} color="#2d3e50" />
            </View>

            {/* ── Paso 1: correo ── */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo"
                placeholderTextColor="#6b7d8e"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={paso === 1}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, paso !== 1 && styles.buttonDisabled]}
              onPress={handleEnviarCodigo}
              disabled={paso !== 1 || loading}
            >
              {loading && paso === 1
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Enviar código</Text>
              }
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* ── Paso 2: código ── */}
            <Text style={styles.hint}>Ingresa el código que se envió a tu correo</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, paso < 2 && styles.inputDisabled]}
                placeholder="Código"
                placeholderTextColor="#6b7d8e"
                value={codigo}
                onChangeText={setCodigo}
                editable={paso === 2}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, paso !== 2 && styles.buttonDisabled]}
              onPress={handleVerificarCodigo}
              disabled={paso !== 2 || loading}
            >
              {loading && paso === 2
                ? <ActivityIndicator color="#fff" />
                : <Text style={[styles.buttonText, paso !== 2 && styles.buttonTextDisabled]}>Verificar código</Text>
              }
            </TouchableOpacity>

            {/* ── Paso 3: nueva contraseña ── */}
            {paso === 3 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.hint}>Ingresa tu nueva contraseña</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#6b7d8e"
                    value={nuevaPass}
                    onChangeText={setNuevaPass}
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#6b7d8e"
                    value={confirmaPass}
                    onChangeText={setConfirmaPass}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleRestablecerContrasena}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>Restablecer contraseña</Text>
                  }
                </TouchableOpacity>
              </>
            )}
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
    shadowOffset: { width: 0, height: 8 },
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
