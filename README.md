# Selección de Altos Mandos — Grupo Empresarial Quetzal

Aplicación web y móvil para la gestión de procesos de selección interna de personal ejecutivo, desarrollada con Laravel, React y React Native, orientada al sector automotriz.

## Descripción

Sistema de selección interna que permite al área de Recursos Humanos de Grupo Empresarial Quetzal identificar, evaluar y promover candidatos internos a puestos de alta dirección (directores y gerentes). La plataforma evalúa aptitudes clave del sector automotriz, calcula la compatibilidad de cada candidato con las vacantes disponibles y presenta los resultados tanto en la aplicación web para el equipo de RH como en la app móvil para los propios candidatos.

## Características

- Autenticación con roles: superadmin, admin (RH) y empleado
- Registro y control de empleados con foto y CV
- Registro y gestión de vacantes de altos mandos
- Evaluación de aptitudes automotrices por empleado (0–100%)
- Cálculo automático de compatibilidad candidato–vacante
- Creación de cuentas de acceso vinculadas a empleados
- Recuperación de contraseña por código de verificación
- Consulta de vacantes activas desde la app móvil
- Visualización de resultados de evaluación en móvil
- Arquitectura orientada a servicios (REST API con Laravel Sanctum)
- Entorno completamente reproducible con Docker

## Requisitos

- Git
- Docker y Docker Compose
- Expo Go instalado en el dispositivo móvil (para la app móvil)
- Navegador web moderno

## Instalación y puesta en marcha

```bash
# 1. Clonar el repositorio
git clone https://github.com/gerardoChacon/seleccion-altos-mandos.git
cd seleccion-altos-mandos

# 2. Construir e iniciar todos los servicios
docker compose up -d --build

# 3. Cargar la base de datos con datos de prueba
docker exec -i sam_db psql -U app -d seleccion < sql/bd.sql
```

> La primera vez el backend ejecuta automáticamente las migraciones (`php artisan migrate`).
> Si ya hay datos previos y se desea recargar desde cero:
> ```bash
> docker exec -i sam_db psql -U app -d seleccion -c \
>   "TRUNCATE match_vacante, vacante_aptitud, empleado_aptitud, usuario, vacante, empleado, \
>    direccion, municipio, estado, aptitud, puesto, area, rol RESTART IDENTITY CASCADE;" \
> && docker exec -i sam_db psql -U app -d seleccion < sql/bd.sql
> ```

## Acceso al sistema

| Servicio       | URL / Dirección              |
|----------------|------------------------------|
| Frontend Web   | http://localhost:5173        |
| Backend API    | http://localhost:8000/api    |
| App Móvil      | `exp://<IP_LAN>:8081` en Expo Go |

### Credenciales de prueba

| Rol        | Correo                          | Contraseña |
|------------|---------------------------------|------------|
| Superadmin | admin@quetzal.mx                | password   |
| Admin (RH) | ana.torres@quetzal.mx           | password   |
| Empleado   | patricia.gonzalez@quetzal.mx    | password   |
| Empleado   | javier.morales@quetzal.mx       | password   |

## Estructura del proyecto

```
seleccion-altos-mandos/
├── backend/              API REST (Laravel 12 + Sanctum)
├── frontend/             Aplicación web (React 19 + Vite)
├── mobile/               Aplicación móvil (React Native 0.81 + Expo SDK 54)
├── docker/               Dockerfiles de backend y frontend
├── sql/
│   └── bd.sql            Script de creación e inserción de datos de prueba
├── docker-compose.yml    Orquestación de servicios
└── README.md
```

## Tecnologías

| Capa        | Tecnología                          |
|-------------|-------------------------------------|
| Backend     | Laravel 12, PHP 8.3, Sanctum        |
| Base de datos | PostgreSQL 16                     |
| Frontend    | React 19, Vite, CSS Modules         |
| Móvil       | React Native 0.81, Expo SDK 54      |
| Infraestructura | Docker, Docker Compose          |

## Arquitectura

El sistema sigue una arquitectura orientada a servicios de tres capas:

- **Backend (Laravel)**: expone una API REST con autenticación por token (Sanctum). Gestiona empleados, vacantes, aptitudes, evaluaciones y el cálculo de compatibilidad.
- **Base de datos (PostgreSQL)**: almacena toda la información del sistema con integridad referencial.
- **Frontend (React)**: interfaz web para el equipo de RH — gestión de empleados, vacantes, evaluaciones y perfiles.
- **Móvil (React Native + Expo)**: app para candidatos — consulta de vacantes activas y resultados de su evaluación.

## App móvil

La app móvil se levanta con Docker junto al resto de servicios:

```bash
docker compose up mobile
```

Abre Expo Go en tu dispositivo, selecciona **"Enter URL manually"** e ingresa:

```
exp://<IP_DE_TU_RED_LOCAL>:8081
```

> La IP del servidor se configura en `docker-compose.yml` con la variable `REACT_NATIVE_PACKAGER_HOSTNAME` y en `mobile/src/services/api.js` con `BASE_URL`.

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

Todos los derechos reservados © Grupo Empresarial Quetzal.
