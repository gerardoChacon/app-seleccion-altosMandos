import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 350;
const wp = (pct) => (screenWidth * pct) / 100;

const APTITUD_COLORS = ['#f9d2d2', '#f9e7c2', '#d2f1e6', '#e2e3fb', '#dde8f9', '#fce4f3'];

export default function VacanteDetalleScreen({ navigation, route }) {
  const { vacante, usuario } = route?.params ?? {};

  if (!vacante) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#1e2d3d" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Detalle de Vacante</Text>
        </View>
        <View style={styles.centered}>
          <Text style={{ color: '#6b7d8e' }}>No se encontró la vacante.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const aptitudes = vacante.aptitudes ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1e2d3d" />
        </TouchableOpacity>
        <Text style={styles.pageTitle} numberOfLines={1}>
          {vacante.puesto?.nombre_puesto ?? 'Detalle de Vacante'}
        </Text>
      </View>

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Tarjeta principal */}
        <View style={styles.mainCard}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="business" size={36} color="#5b7290" />
          </View>
          <Text style={styles.puestoTitle}>{vacante.puesto?.nombre_puesto ?? ''}</Text>
          <Text style={styles.areaText}>{vacante.area?.nombre_area ?? ''}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="calendar-today" size={15} color="#6b7d8e" />
              <Text style={styles.metaText}>{vacante.fecha_apertura}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Activa</Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        {vacante.descripcion ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descripcionText}>{vacante.descripcion}</Text>
          </View>
        ) : null}

        {/* Aptitudes requeridas */}
        {aptitudes.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Aptitudes requeridas</Text>
            {aptitudes.map((apt, idx) => (
              <View
                key={apt.id_aptitud}
                style={[styles.aptitudItem, { backgroundColor: APTITUD_COLORS[idx % APTITUD_COLORS.length] }]}
              >
                <Text style={styles.aptitudLabel}>{apt.nombre_aptitud}</Text>
                <Text style={styles.aptitudPct}>{apt.pivot?.porcentaje_minimo ?? 70}% mín.</Text>
              </View>
            ))}
          </View>
        )}

        {/* Botón postularse / ver evaluación */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ResultadoEvaluacion', { usuario })}
        >
          <Text style={styles.primaryBtnText}>Ver mi evaluación</Text>
        </TouchableOpacity>

      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  pageTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '700',
    color: '#1e2d3d',
    flex: 1,
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
  content: {
    padding: 16,
    gap: 14,
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: wp(5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  puestoTitle: {
    fontSize: isSmallScreen ? 17 : 19,
    fontWeight: '700',
    color: '#1e2d3d',
    textAlign: 'center',
    marginBottom: 4,
  },
  areaText: {
    fontSize: 14,
    color: '#6b7d8e',
    textAlign: 'center',
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6b7d8e',
  },
  badge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#0d7a5f',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: '700',
    color: '#1e2d3d',
    marginBottom: 12,
  },
  descripcionText: {
    fontSize: 14,
    color: '#4a5e72',
    lineHeight: 22,
  },
  aptitudItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  aptitudLabel: {
    fontSize: 13,
    color: '#1e2d3d',
    fontWeight: '500',
  },
  aptitudPct: {
    fontSize: 13,
    color: '#1e2d3d',
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#5b7290',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
