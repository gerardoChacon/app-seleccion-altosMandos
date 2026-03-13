# SeleccionAltosMandos
Aplicación web y móvil para la gestión de procesos de selección interna, desarrollada con Laravel, React y React Native.

## Descripción
SeleccionAltosMandos es una solución orientada a servicios que permite gestionar procesos de selección interna dentro de una organización. Tanto la aplicación web como la móvil consumen los servicios del backend mediante una API REST, permitiendo registrar vacantes, evaluar candidatos y consultar resultados desde cualquier dispositivo.

## Características
- Autenticación de usuarios
- Registro y control de empleados
- Registro y gestión de vacantes
- Evaluación y seguimiento de candidatos
- Visualización de perfiles evaluados y sin evaluación
- Consulta de vacantes desde dispositivos móviles
- Arquitectura orientada a servicios (REST API)
- Entorno reproducible con Docker

## Requisitos
- Git
- Docker
- Docker Compose
- Node.js (solo para desarrollo de la aplicación móvil)
- Navegador web moderno

## Instalación
```bash
# Clonar repositorio
git clone https://github.com/USUARIO/seleccion-altos-mandos.git
cd seleccion-altos-mandos

# Construir e iniciar todos los servicios
docker compose up -d --build
```

## Estructura del Proyecto
```
seleccion-altos-mandos/
├── backend/              API desarrollada con Laravel
├── frontend/             Aplicación web desarrollada con React
├── mobile/               Aplicación móvil desarrollada con React Native
├── docker/               Configuración de contenedores Docker
├── docker-compose.yml    Orquestación de servicios
├── docs/                 Documentación del proyecto
└── README.md
```

## Tecnologías
- Laravel
- React + Vite
- React Native + Expo
- PostgreSQL
- Docker + Docker Compose

## Acceso
Una vez levantado el sistema, los servicios están disponibles en:

| Servicio | URL |
|----------|-----|
| Frontend Web | http://localhost:5173 |
| Backend API | http://localhost:8000 |

## Desarrollo

### Arquitectura
El sistema sigue una arquitectura de tres capas orientada a servicios:

- **Backend**: Lógica de negocio y exposición de servicios mediante API REST (Laravel)
- **Base de datos**: Almacenamiento persistente (PostgreSQL)
- **Frontend**: Interfaz web (React) y móvil (React Native) que consumen la API

### Páginas del frontend
Las páginas principales se encuentran en `frontend/src/pages/`:
- Login
- Dashboard
- Registro y control de empleados
- Registro, control y listado de vacantes
- Perfil evaluado y perfil sin evaluación

### Aplicación móvil
El código fuente de la app móvil se encuentra en `mobile/`. Funcionalidades disponibles:
- Inicio de sesión
- Consulta y detalle de vacantes
- Resultados de evaluación

## Detener el sistema
```bash
docker compose down
```

## Contribuidores
- Gerardo Chacón Álvarez
- Daniel Alexandro Castelo Castillo
- Ana Sofía Cano Sandoval
- Juan Pablo Cipriano Álvarez

## Licencia
Todos los derechos reservados.
