import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 350;

export default function VacantesScreen({ navigation, route }) {
  const usuario = route?.params?.usuario;

  const [vacantes, setVacantes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    api.get('/vacantes?estatus=disponible&per_page=50')
      .then((res) => setVacantes(res.data.data ?? []))
      .catch((err) => setError(err.message ?? 'Error al cargar vacantes'))
      .finally(() => setLoading(false));
  }, []);

  function handleVerDetalle(vacante) {
    navigation.navigate('VacanteDetalle', { vacante, usuario });
  }

  function handleVerResultados() {
    navigation.navigate('ResultadoEvaluacion', { usuario });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Vacantes Disponibles</Text>
        <TouchableOpacity style={styles.resultBtn} onPress={handleVerResultados}>
          <MaterialIcons name="assessment" size={22} color="#5b7290" />
          <Text style={styles.resultBtnText}>Mi evaluación</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5b7290" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {vacantes.length === 0 ? (
            <Text style={styles.emptyText}>No hay vacantes disponibles.</Text>
          ) : (
            vacantes.map((v) => (
              <TouchableOpacity
                key={v.id_vacante}
                style={styles.card}
                onPress={() => handleVerDetalle(v)}
                activeOpacity={0.85}
              >
                <View style={styles.cardTop}>
                  <View style={styles.logoCircle}>
                    <MaterialIcons name="business" size={28} color="#5b7290" />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {v.puesto?.nombre_puesto ?? 'Sin título'}
                    </Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {v.descripcion ?? v.area?.nombre_area ?? ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.fecha}>{v.fecha_apertura?.slice(0, 10).split('-').reverse().join('/')}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Activa</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  pageTitle: {
    fontSize: isSmallScreen ? 17 : 20,
    fontWeight: '700',
    color: '#1e2d3d',
    flex: 1,
  },
  resultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#eef2f7',
  },
  resultBtnText: {
    fontSize: 13,
    color: '#5b7290',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#d0d7e0',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7d8e',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '700',
    color: '#1e2d3d',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: isSmallScreen ? 12 : 13,
    color: '#6b7d8e',
    lineHeight: 18,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
    paddingTop: 10,
  },
  fecha: {
    fontSize: 12,
    color: '#6b7d8e',
  },
  badge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#0d7a5f',
    fontWeight: '600',
  },
});
