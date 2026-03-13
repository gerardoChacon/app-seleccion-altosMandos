import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Obtener dimensiones de la pantalla
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Funciones para responsividad
const wp = (percentage) => (screenWidth * percentage) / 100;
const hp = (percentage) => (screenHeight * percentage) / 100;

// Determinar si es pantalla pequeña (menos de 350px de ancho)
const isSmallScreen = screenWidth < 350;

// Datos de ejemplo de candidatos evaluados
const resultadosEvaluacion = [
  {
    id: 1,
    nombre: "María González",
    email: 'maria.gonzalez@empresa.com',
    posicion: "Director de Operaciones",
    calificacion: 95,
    estado: "Aprobado",
    fecha: "15 Feb 2026",
    avatar: null,
    competencias: ["Liderazgo", "Estrategia", "Gestión"]
  },
  {
    id: 2,
    nombre: "Carlos Mendoza",
    email: 'carlos.mendoza@empresa.com',
    posicion: "Director de RH",
    calificacion: 88,
    estado: "Aprobado",
    fecha: "14 Feb 2026",
    avatar: null,
    competencias: ["Gestión Talento", "Cultura", "Desarrollo"]
  },
  {
    id: 3,
    nombre: "Ana Rodríguez",
    email: 'ana.rodriguez@empresa.com',
    posicion: "Director Financiero",
    calificacion: 92,
    estado: "Aprobado",
    fecha: "13 Feb 2026",
    avatar: null,
    competencias: ["Finanzas", "Análisis", "Presupuestos"]
  },
  {
    id: 4,
    nombre: "Luis Torres",
    email: 'luis.torres@empresa.com',
    posicion: "Gerente de Operaciones",
    calificacion: 76,
    estado: "En Proceso",
    fecha: "12 Feb 2026",
    avatar: null,
    competencias: ["Operaciones", "Coordinación", "KPIs"]
  },
  {
    id: 5,
    nombre: "Carmen Silva",
    email: 'carmen.silva@empresa.com',
    posicion: "Director de Tecnología",
    calificacion: 68,
    estado: "Rechazado",
    fecha: "11 Feb 2026",
    avatar: null,
    competencias: ["Tecnología", "Innovación", "Desarrollo"]
  },
  {
    id: 6,
    nombre: "Roberto Vega",
    email: 'roberto.vega@empresa.com',
    posicion: "Gerente General",
    calificacion: 85,
    estado: "En Proceso",
    fecha: "10 Feb 2026",
    avatar: null,
    competencias: ["Liderazgo", "Estrategia", "Gestión Integral"]
  }
];

const datosPerfil = {
  'maria.gonzalez@empresa.com': {
    departamento: 'Operaciones',
    fechaNacimiento: '11 marzo 1990',
  },
  'carlos.mendoza@empresa.com': {
    departamento: 'Recursos Humanos',
    fechaNacimiento: '28 julio 1988',
  },
  'ana.rodriguez@empresa.com': {
    departamento: 'Finanzas',
    fechaNacimiento: '05 enero 1992',
  },
  'luis.torres@empresa.com': {
    departamento: 'Operaciones',
    fechaNacimiento: '17 septiembre 1991',
  },
  'carmen.silva@empresa.com': {
    departamento: 'Tecnología',
    fechaNacimiento: '22 abril 1989',
  },
  'roberto.vega@empresa.com': {
    departamento: 'Dirección General',
    fechaNacimiento: '02 febrero 1987',
  },
};

const clampScore = (value) => Math.max(0, Math.min(100, value));

const crearResumen = (calificacion) => {
  const base = clampScore(calificacion);

  return [
    { label: 'Asistencia', value: clampScore(base - 5), color: '#f9d2d2' },
    { label: 'Cumplimiento Horario', value: clampScore(base - 10), color: '#f9e7c2' },
    { label: 'Incremento de Ingreso', value: clampScore(base - 2), color: '#d2f1e6' },
    { label: 'Reducción de Costos', value: clampScore(base + 4), color: '#e2e3fb' },
  ];
};

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Aprobado':
      return { backgroundColor: '#d1fae5', color: '#0d7a5f' };
    case 'En Proceso':
      return { backgroundColor: '#fef3c7', color: '#d97706' };
    case 'Rechazado':
      return { backgroundColor: '#fee2e2', color: '#dc2626' };
    default:
      return { backgroundColor: '#f0f4f8', color: '#6b7d8e' };
  }
};

const getCalificacionColor = (calificacion) => {
  if (calificacion >= 90) return '#0d7a5f';
  if (calificacion >= 80) return '#d97706';
  return '#dc2626';
};

const getMensajeRendimiento = (calificacion) => {
  if (calificacion >= 90) return 'Excelente desempeño';
  if (calificacion >= 80) return 'Muy buen desempeño';
  if (calificacion >= 70) return 'Buen desempeño';
  return 'Área de oportunidad';
};

export default function ResultadoEvaluacionScreen({ navigation, route }) {
  const usuarioSesion = route?.params?.usuario;
  const emailUsuario = usuarioSesion?.email?.toLowerCase?.() || '';

  const resultadosDelUsuario = emailUsuario
    ? resultadosEvaluacion.filter(r => r.email === emailUsuario)
    : [];
  const resultado = resultadosDelUsuario[0];

  if (!resultado) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1e2d3d" />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Resultados de Evaluación</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.emptyContainer}>
          <MaterialIcons name="lock-outline" size={56} color="#c9d4e0" />
          <Text style={styles.emptyTitle}>Sin resultados para tu usuario</Text>
          <Text style={styles.emptyText}>
            Solo puedes ver la evaluación asociada al correo con el que iniciaste sesión.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const perfil = datosPerfil[emailUsuario] || {
    departamento: 'Sin departamento',
    fechaNacimiento: 'No disponible',
  };
  const estadoVisual = getEstadoColor(resultado.estado);
  const resumen = crearResumen(resultado.calificacion);
  const mensaje = getMensajeRendimiento(resultado.calificacion);
  const percentil = Math.max(50, Math.min(95, Math.round(resultado.calificacion * 0.75)));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e2d3d" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Resultados de Evaluación</Text>
      </View>

      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <MaterialIcons
            name="account-circle"
            size={isSmallScreen ? 82 : 92}
            color="#7c9bcf"
            style={styles.profileAvatar}
          />

          <Text style={styles.profileName}>{resultado.nombre}</Text>
          <Text style={styles.profileRole}>{resultado.posicion}</Text>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="apartment" size={16} color="#6b7d8e" />
            <Text style={styles.infoText}>Departamento: {perfil.departamento}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="cake" size={16} color="#6b7d8e" />
            <Text style={styles.infoText}>Fecha de nacimiento: {perfil.fechaNacimiento}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="mail-outline" size={16} color="#6b7d8e" />
            <Text style={styles.infoText}>{resultado.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={16} color="#6b7d8e" />
            <Text style={styles.infoText}>Evaluación: {resultado.fecha}</Text>
          </View>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Tu Resultado</Text>

          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{resultado.calificacion}</Text>
            <Text style={styles.scoreSub}>de 100</Text>
          </View>

          <View style={[styles.estadoBadge, { backgroundColor: estadoVisual.backgroundColor }]}> 
            <Text style={[styles.estadoText, { color: estadoVisual.color }]}>{resultado.estado}</Text>
          </View>

          <Text style={[styles.resultState, { color: getCalificacionColor(resultado.calificacion) }]}>
            {mensaje}
          </Text>

          <Text style={styles.resultDescription}>
            Tu puntaje es más alto que el {percentil}% de los empleados que han tomado esta evaluación.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de Indicadores</Text>

          {resumen.map((item) => (
            <View key={item.label} style={[styles.summaryItem, { backgroundColor: item.color }]}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value} / 100</Text>
            </View>
          ))}
        </View>

        <View style={styles.competenciasCard}>
          <Text style={styles.summaryTitle}>Competencias Detectadas</Text>
          <View style={styles.tagsWrap}>
            {resultado.competencias.map((comp) => (
              <View key={comp} style={styles.competenciaTag}>
                <Text style={styles.competenciaText}>{comp}</Text>
              </View>
            ))}
          </View>
        </View>
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
  content: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp(5),
    padding: wp(5),
    marginBottom: hp(2),
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
    marginBottom: hp(2),
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
    marginBottom: hp(2),
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
  competenciasCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp(5),
    padding: wp(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  competenciaTag: {
    backgroundColor: '#f0f4f8',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(4),
  },
  competenciaText: {
    fontSize: isSmallScreen ? 11 : 12,
    color: '#6b7d8e',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: wp(6),
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
});