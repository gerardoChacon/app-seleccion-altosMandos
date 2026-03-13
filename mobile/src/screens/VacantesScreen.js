import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
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

// Datos de vacantes (igual que en el frontend web)
const vacantesData = [
  {
    id: 1,
    titulo: "Director de Operaciones",
    desc: "Responsable de la estrategia operativa, optimización de procesos y supervisión de áreas clave a nivel corporativo",
    fecha: "15 Feb 2026",
    estatus: "Activa",
    logo: null
  },
  {
    id: 2,
    titulo: "Director de RH",
    desc: "Liderazgo de la estrategia de talento, cultura organizacional y desarrollo ejecutivo",
    fecha: "03 Feb 2026",
    estatus: "Activa",
    logo: null
  },
  {
    id: 3,
    titulo: "Director Financiero",
    desc: "Supervisión de planeación financiera, control presupuestal y gestión de riesgos corporativos",
    fecha: "10 Feb 2026",
    estatus: "Activa",
    logo: null
  },
  {
    id: 4,
    titulo: "Gerente de Operaciones",
    desc: "Coordinación estratégica de múltiples sedes y cumplimiento de indicadores de desempeño regional",
    fecha: "12 Dic 2025",
    estatus: "Activa",
    logo: null
  },
  {
    id: 5,
    titulo: "Director de Tecnología",
    desc: "Definición de la visión tecnológica, innovación digital y liderazgo de equipos de desarrollo",
    fecha: "20 Feb 2026",
    estatus: "Activa",
    logo: null
  },
  {
    id: 6,
    titulo: "Gerente General",
    desc: "Dirección integral de la organización, toma de decisiones estratégicas y cumplimiento de objetivos corporativos",
    fecha: "15 Feb 2026",
    estatus: "Activa",
    logo: null
  },
];

export default function VacantesScreen({ navigation, route }) {
  const usuarioSesion = route?.params?.usuario;
  const [searchText, setSearchText] = useState('');
  const [vacantes, setVacantes] = useState(vacantesData);

  // Filtrar vacantes por búsqueda
  const vacantesFiltradas = vacantes.filter(vacante =>
    vacante.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
    vacante.desc.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleVerDetalle = (vacante) => {
    navigation?.navigate('VacanteDetalle', { vacante });
  };

  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'Activa':
        return { backgroundColor: '#d1fae5', color: '#0d7a5f' };
      case 'Pausada':
        return { backgroundColor: '#fef3c7', color: '#d97706' };
      case 'Cerrada':
        return { backgroundColor: '#fee2e2', color: '#dc2626' };
      default:
        return { backgroundColor: '#f0f4f8', color: '#6b7d8e' };
    }
  };

  const renderVacante = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleVerDetalle(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardTop}>
        {/* Logo empresa */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        {/* Información de la vacante */}
        <View style={styles.vacanteInfo}>
          <Text style={styles.tituloVacante} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={styles.descripcionVacante} numberOfLines={3}>
            {item.desc}
          </Text>
        </View>
      </View>

      {/* Bottom info */}
      <View style={styles.cardBottom}>
        <View style={styles.fechaContainer}>
          <MaterialIcons name="calendar-today" size={16} color="#6b7d8e" />
          <Text style={styles.fechaText}>{item.fecha}</Text>
        </View>

        <View style={[styles.estatusBadge, getEstatusColor(item.estatus)]}>
          <Text style={[styles.estatusText, { color: getEstatusColor(item.estatus).color }]}>
            {item.estatus}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.detalleButton}
          onPress={() => handleVerDetalle(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.detalleButtonText}>Detalles</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e2d3d" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Vacantes</Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation?.navigate('ResultadoEvaluacion', { usuario: usuarioSesion })}
        >
          <MaterialIcons name="filter-list" size={24} color="#1e2d3d" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#6b7d8e" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar vacantes..."
            placeholderTextColor="#6b7d8e"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <MaterialIcons name="clear" size={20} color="#6b7d8e" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contador de resultados */}
      <View style={styles.resultadosContainer}>
        <Text style={styles.resultadosText}>
          {vacantesFiltradas.length} vacante{vacantesFiltradas.length !== 1 ? 's' : ''} encontrada{vacantesFiltradas.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista de vacantes */}
      <FlatList
        data={vacantesFiltradas}
        renderItem={renderVacante}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="work-off" size={64} color="#c9d4e0" />
            <Text style={styles.emptyText}>No se encontraron vacantes</Text>
            <Text style={styles.emptySubtext}>
              Intenta ajustar los filtros de búsqueda
            </Text>
          </View>
        }
      />
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
    paddingHorizontal: wp(5), // 5% del ancho de pantalla
    paddingVertical: hp(2), // 2% del alto de pantalla
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: wp(1),
  },
  pageTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '700',
    color: '#1e2d3d',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: wp(4),
  },
  filterButton: {
    padding: wp(1),
  },
  divider: {
    height: 1,
    backgroundColor: '#d0d7e0',
  },
  searchContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: '#ffffff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: isSmallScreen ? 13 : 14,
    color: '#1e2d3d',
    padding: 0,
  },
  resultadosContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
  },
  resultadosText: {
    fontSize: isSmallScreen ? 11 : 12,
    color: '#6b7d8e',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2.5),
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: wp(3.5), // Bordes responsivos
    padding: wp(5), // Padding responsivo
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    minHeight: hp(12), // Altura mínima responsiva
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: hp(2),
  },
  logoContainer: {
    width: wp(18), // 18% del ancho de pantalla
    height: wp(18), // Mantener aspecto cuadrado
    borderRadius: wp(3),
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3.5),
    flexShrink: 0,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  vacanteInfo: {
    flex: 1,
  },
  tituloVacante: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '700',
    color: '#1e2d3d',
    marginBottom: hp(0.5),
    lineHeight: isSmallScreen ? 18 : 20,
  },
  descripcionVacante: {
    fontSize: isSmallScreen ? 12 : 13,
    color: '#6b7d8e',
    lineHeight: isSmallScreen ? 16 : 18,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // Permite que se ajuste en pantallas pequeñas
    gap: wp(2),
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(5),
    flex: isSmallScreen ? 1 : 0, // En pantallas pequeñas, ocupa más espacio
    minWidth: wp(25), // Ancho mínimo
  },
  fechaText: {
    fontSize: isSmallScreen ? 10 : 12,
    color: '#6b7d8e',
    marginLeft: wp(1),
  },
  estatusBadge: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(5),
    minWidth: wp(20), // Ancho mínimo para el badge
  },
  estatusText: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  detalleButton: {
    backgroundColor: '#5b7290',
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(0.65),
  },
  detalleButtonText: {
    color: '#ffffff',
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(8),
  },
  emptyText: {
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '600',
    color: '#1e2d3d',
    marginTop: hp(2),
    marginBottom: hp(0.5),
    textAlign: 'center',
    paddingHorizontal: wp(5),
  },
  emptySubtext: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#6b7d8e',
    textAlign: 'center',
    paddingHorizontal: wp(5),
  },
});