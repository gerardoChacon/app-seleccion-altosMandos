import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const wp = (pct) => (screenWidth * pct) / 100;
const hp = (pct) => (screenHeight * pct) / 100;
const isSmallScreen = screenWidth < 350;

const APTITUD_COLORS = ['#f9d2d2', '#f9e7c2', '#d2f1e6', '#e2e3fb'];

const getEstadoVisual = (estado) => {
  switch (estado) {
    case 'aprobado':      return { backgroundColor: '#d1fae5', color: '#0d7a5f', label: 'Aprobado' };
    case 'en_evaluacion': return { backgroundColor: '#fef3c7', color: '#d97706', label: 'En Proceso' };
    case 'rechazado':     return { backgroundColor: '#fee2e2', color: '#dc2626', label: 'Rechazado' };
    default:              return { backgroundColor: '#f0f4f8', color: '#6b7d8e', label: 'Pendiente' };
  }
};

const getScoreColor = (score) => {
  if (score >= 90) return '#0d7a5f';
  if (score >= 75) return '#d97706';
  return '#dc2626';
};

const getMensaje = (score) => {
  if (score >= 90) return '¡Excelente!';
  if (score >= 75) return '¡Bien!';
  return 'En desarrollo';
};

export default function ResultadoEvaluacionScreen({ navigation, route }) {
  const usuario = route?.params?.usuario;

  const [empleado, setEmpleado] = useState(null);
  const [matches,  setMatches]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    // Response shape: { success, data: { empleado, matches } }
    api.get('/mi-evaluacion')
      .then((res) => {
        setEmpleado(res.data?.empleado ?? null);
        setMatches(res.data?.matches ?? []);
      })
      .catch((err) => setError(err.message ?? 'Error al cargar la evaluación'))
      .finally(() => setLoading(false));
  }, []);

  const aptitudes   = empleado?.aptitudes ?? [];
  const puntajeTotal = aptitudes.length > 0
    ? Math.round(aptitudes.reduce((s, a) => s + Number(a.pivot?.porcentaje_obtenido ?? 0), 0) / aptitudes.length)
    : null;

  const primerMatch   = matches[0] ?? null;
  const estadoVisual  = primerMatch ? getEstadoVisual(primerMatch.estado_proceso) : null;

  const nombre = empleado
    ? `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno ?? ''}`.trim()
    : (usuario?.nombre ?? 'Usuario');

  const sinEvaluacion = !empleado || aptitudes.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1e2d3d" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Resultados de Evaluación</Text>
      </View>

      <View style={styles.divider} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5b7290" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <MaterialIcons name="error-outline" size={48} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : sinEvaluacion ? (
        <View style={styles.centered}>
          <MaterialIcons name="lock-outline" size={56} color="#c9d4e0" />
          <Text style={styles.emptyTitle}>Sin evaluación registrada</Text>
          <Text style={styles.emptyText}>
            Aún no tienes resultados de evaluación disponibles.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Perfil */}
          <View style={styles.profileCard}>
            <MaterialIcons
              name="account-circle"
              size={isSmallScreen ? 82 : 92}
              color="#7c9bcf"
              style={styles.profileAvatar}
            />
            <Text style={styles.profileName}>{nombre}</Text>
            {empleado.puesto?.nombre_puesto ? (
              <Text style={styles.profileRole}>{empleado.puesto.nombre_puesto}</Text>
            ) : null}
            <View style={styles.infoDivider} />
            {empleado.area?.nombre_area ? (
              <View style={styles.infoRow}>
                <MaterialIcons name="apartment" size={16} color="#6b7d8e" />
                <Text style={styles.infoText}>Departamento: {empleado.area.nombre_area}</Text>
              </View>
            ) : null}
            {empleado.fecha_nacimiento ? (
              <View style={styles.infoRow}>
                <MaterialIcons name="cake" size={16} color="#6b7d8e" />
                <Text style={styles.infoText}>Nacimiento: {empleado.fecha_nacimiento}</Text>
              </View>
            ) : null}
            {empleado.correo ? (
              <View style={styles.infoRow}>
                <MaterialIcons name="mail-outline" size={16} color="#6b7d8e" />
                <Text style={styles.infoText}>{empleado.correo}</Text>
              </View>
            ) : null}
          </View>

          {/* Resultado */}
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Tu Resultado</Text>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>{puntajeTotal}</Text>
              <Text style={styles.scoreSub}>de 100</Text>
            </View>

            {estadoVisual ? (
              <View style={[styles.estadoBadge, { backgroundColor: estadoVisual.backgroundColor }]}>
                <Text style={[styles.estadoText, { color: estadoVisual.color }]}>
                  {estadoVisual.label}
                </Text>
              </View>
            ) : null}

            <Text style={[styles.resultState, { color: getScoreColor(puntajeTotal) }]}>
              {getMensaje(puntajeTotal)}
            </Text>

            <Text style={styles.resultDescription}>
              Promedio calculado sobre {aptitudes.length} aptitud{aptitudes.length !== 1 ? 'es' : ''} evaluadas.
            </Text>
          </View>

          {/* Resumen de aptitudes */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen de Indicadores</Text>
            {aptitudes.slice(0, 4).map((apt, idx) => (
              <View
                key={apt.id_aptitud}
                style={[styles.summaryItem, { backgroundColor: APTITUD_COLORS[idx % APTITUD_COLORS.length] }]}
              >
                <Text style={styles.summaryLabel}>{apt.nombre_aptitud}</Text>
                <Text style={styles.summaryValue}>{apt.pivot?.porcentaje_obtenido ?? 0} / 100</Text>
              </View>
            ))}
          </View>

          {/* Compatibilidad con vacantes */}
          {matches.length > 0 ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Compatibilidad con Vacantes</Text>
              {matches.map((m) => (
                <View key={m.id_match} style={styles.matchItem}>
                  <Text style={styles.matchPuesto} numberOfLines={1}>
                    {m.vacante?.puesto?.nombre_puesto ?? 'Vacante'}
                  </Text>
                  <Text style={styles.matchPct}>{m.porcentaje_compatibilidad}%</Text>
                </View>
              ))}
            </View>
          ) : null}

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
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: '#ffffff',
  },
  backButton: {
    marginRight: wp(4),
    padding: wp(1),
  },
  pageTitle: {
    fontSize: isSmallScreen ? 18 : 20,
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
    paddingHorizontal: wp(6),
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '700',
    color: '#1e2d3d',
    marginTop: hp(1.5),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#6b7d8e',
    marginTop: hp(1),
    textAlign: 'center',
    lineHeight: isSmallScreen ? 18 : 20,
    maxWidth: wp(80),
  },
  content: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(4),
    gap: 14,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp(5),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  profileAvatar: {
    alignSelf: 'center',
    marginBottom: hp(1.5),
  },
  profileName: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '700',
    color: '#1e2d3d',
    textAlign: 'center',
  },
  profileRole: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#6b7d8e',
    textAlign: 'center',
    marginTop: hp(0.4),
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e5ebf1',
    marginVertical: hp(1.5),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
    gap: wp(2),
  },
  infoText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#6b7d8e',
    flex: 1,
  },
  resultCard: {
    backgroundColor: '#6f79e7',
    borderRadius: wp(5),
    padding: wp(6),
    alignItems: 'center',
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '700',
    marginBottom: hp(2),
  },
  scoreCircle: {
    width: isSmallScreen ? wp(28) : wp(26),
    height: isSmallScreen ? wp(28) : wp(26),
    borderRadius: isSmallScreen ? wp(14) : wp(13),
    backgroundColor: '#5a63d7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.3),
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: isSmallScreen ? 30 : 34,
    fontWeight: '700',
  },
  scoreSub: {
    color: '#d0d5ff',
    fontSize: isSmallScreen ? 12 : 13,
  },
  estadoBadge: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.7),
    borderRadius: wp(5),
    marginBottom: hp(1.2),
  },
  estadoText: {
    fontSize: isSmallScreen ? 11 : 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultState: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: '700',
    marginBottom: hp(1),
  },
  resultDescription: {
    color: '#e4e8ff',
    textAlign: 'center',
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: isSmallScreen ? 18 : 20,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp(5),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: isSmallScreen ? 17 : 19,
    fontWeight: '700',
    color: '#1e2d3d',
    marginBottom: hp(1.8),
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(3),
    marginBottom: hp(1),
  },
  summaryLabel: {
    fontSize: isSmallScreen ? 12 : 13,
    color: '#1e2d3d',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: isSmallScreen ? 12 : 13,
    color: '#1e2d3d',
    fontWeight: '700',
  },
  matchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },
  matchPuesto: {
    fontSize: 13,
    color: '#4a5e72',
    flex: 1,
    marginRight: 8,
  },
  matchPct: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e2d3d',
  },
});
