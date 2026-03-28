-- ============================================================
-- Base de datos: seleccion
-- Proyecto: Selección de Altos Mandos — Grupo Empresarial Quetzal
-- ============================================================

-- ----------------------------
-- TABLAS
-- ----------------------------

CREATE TABLE rol (
    id_rol     SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    CHECK (nombre_rol IN ('superadmin','admin','empleado'))
);

CREATE TABLE area (
    id_area     SERIAL PRIMARY KEY,
    nombre_area VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE puesto (
    id_puesto     SERIAL PRIMARY KEY,
    nombre_puesto VARCHAR(100) NOT NULL UNIQUE,
    descripcion   TEXT
);

CREATE TABLE estado (
    id_estado     SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE municipio (
    id_municipio     SERIAL PRIMARY KEY,
    nombre_municipio VARCHAR(100) NOT NULL,
    id_estado        INTEGER NOT NULL REFERENCES estado(id_estado)
);

CREATE TABLE direccion (
    id_direccion  SERIAL PRIMARY KEY,
    calle         VARCHAR(150) NOT NULL,
    numero        VARCHAR(20)  NOT NULL DEFAULT 'S/N',
    colonia       VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10)  NOT NULL,
    id_municipio  INTEGER NOT NULL REFERENCES municipio(id_municipio)
);

CREATE TABLE aptitud (
    id_aptitud     SERIAL PRIMARY KEY,
    nombre_aptitud VARCHAR(100) NOT NULL UNIQUE,
    descripcion    TEXT
);

CREATE TABLE empleado (
    id_empleado      SERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    curp             VARCHAR(18)  NOT NULL UNIQUE,
    nss              VARCHAR(11)  NOT NULL UNIQUE,
    fecha_ingreso    DATE         NOT NULL,
    fecha_nacimiento DATE         NOT NULL,
    rfc              VARCHAR(13)  NOT NULL UNIQUE,
    correo           VARCHAR(150) UNIQUE,
    fotografia       TEXT,
    cv               TEXT,
    id_puesto        INTEGER REFERENCES puesto(id_puesto),
    id_area          INTEGER REFERENCES area(id_area),
    id_direccion     INTEGER REFERENCES direccion(id_direccion),
    estatus          VARCHAR(20)  NOT NULL DEFAULT 'activo',
    created_at       TIMESTAMP,
    updated_at       TIMESTAMP,
    CHECK (estatus IN ('activo','inactivo'))
);

CREATE TABLE vacante (
    id_vacante     SERIAL PRIMARY KEY,
    id_puesto      INTEGER REFERENCES puesto(id_puesto),
    id_area        INTEGER REFERENCES area(id_area),
    descripcion    TEXT,
    fecha_apertura DATE        NOT NULL,
    estatus        VARCHAR(20) NOT NULL DEFAULT 'disponible',
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP,
    CHECK (estatus IN ('disponible','no_disponible'))
);

CREATE TABLE usuario (
    id_usuario  SERIAL PRIMARY KEY,
    correo      VARCHAR(150) NOT NULL UNIQUE,
    contrasena  VARCHAR(255) NOT NULL,
    id_rol      INTEGER NOT NULL REFERENCES rol(id_rol),
    id_empleado INTEGER UNIQUE REFERENCES empleado(id_empleado),
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE empleado_aptitud (
    id_empleado         INTEGER NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE,
    id_aptitud          INTEGER NOT NULL REFERENCES aptitud(id_aptitud)   ON DELETE CASCADE,
    porcentaje_obtenido NUMERIC(5,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (id_empleado, id_aptitud)
);

CREATE TABLE vacante_aptitud (
    id_vacante        INTEGER NOT NULL REFERENCES vacante(id_vacante) ON DELETE CASCADE,
    id_aptitud        INTEGER NOT NULL REFERENCES aptitud(id_aptitud) ON DELETE CASCADE,
    porcentaje_minimo NUMERIC(5,2) NOT NULL DEFAULT 70,
    PRIMARY KEY (id_vacante, id_aptitud)
);

CREATE TABLE match_vacante (
    id_match                  SERIAL PRIMARY KEY,
    id_empleado               INTEGER NOT NULL REFERENCES empleado(id_empleado) ON DELETE CASCADE,
    id_vacante                INTEGER NOT NULL REFERENCES vacante(id_vacante)   ON DELETE CASCADE,
    porcentaje_compatibilidad NUMERIC(5,2) NOT NULL DEFAULT 0,
    resultado                 VARCHAR(20)  NOT NULL DEFAULT 'no_compatible',
    estado_proceso            VARCHAR(20)  NOT NULL DEFAULT 'pendiente',
    fecha_match               DATE,
    CHECK (resultado      IN ('compatible','no_compatible')),
    CHECK (estado_proceso IN ('pendiente','en_evaluacion','aprobado','rechazado'))
);

CREATE TABLE codigos_recuperacion (
    id         SERIAL PRIMARY KEY,
    correo     VARCHAR(150) NOT NULL,
    codigo     VARCHAR(6)   NOT NULL,
    expira_at  TIMESTAMP    NOT NULL,
    usado      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP
);

CREATE TABLE personal_access_tokens (
    id             BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id   BIGINT       NOT NULL,
    name           VARCHAR(255) NOT NULL,
    token          VARCHAR(64)  NOT NULL UNIQUE,
    abilities      TEXT,
    last_used_at   TIMESTAMP,
    expires_at     TIMESTAMP,
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP
);

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index
    ON personal_access_tokens (tokenable_type, tokenable_id);

-- ----------------------------
-- DATOS
-- ----------------------------

INSERT INTO rol (id_rol, nombre_rol) VALUES
    (1, 'superadmin'),
    (2, 'admin'),
    (3, 'empleado');

INSERT INTO area (id_area, nombre_area) VALUES
    (1, 'Dirección General'),
    (2, 'Finanzas y Administración'),
    (3, 'Recursos Humanos'),
    (4, 'Producción y Planta'),
    (5, 'Ingeniería y Calidad'),
    (6, 'Ventas y Distribución');

INSERT INTO puesto (id_puesto, nombre_puesto, descripcion) VALUES
    -- Puestos de altos mandos (objetivo de las vacantes)
    (1,  'Director General',                      'Responsable de la dirección estratégica del grupo automotriz, expansión de mercado y rentabilidad de planta.'),
    (2,  'Director de Finanzas',                  'Liderazgo de la planeación financiera, control de costos de manufactura y gestión de riesgos del grupo.'),
    (3,  'Director de Recursos Humanos',          'Dirección de la estrategia de talento industrial, relaciones laborales y desarrollo organizacional en planta.'),
    (4,  'Director de Planta y Producción',       'Supervisión integral de las líneas de ensamble, productividad, eficiencia y cumplimiento de estándares OEM.'),
    (5,  'Director de Ingeniería y Calidad',      'Liderazgo de proyectos de ingeniería automotriz, certificaciones IATF 16949 y mejora continua de procesos.'),
    (6,  'Director Comercial y Distribución',     'Gestión de la red de distribuidores, estrategia de ventas de flotillas y expansión de cobertura nacional.'),
    (7,  'Gerente de Cadena de Suministro',       'Administración de proveedores tier-1 y tier-2, inventarios de refacciones y logística de planta.'),
    (8,  'Gerente de Postventa',                  'Coordinación de servicio técnico, garantías, repuestos y satisfacción del cliente final.'),
    -- Puestos operativos regulares (puestos actuales de los empleados candidatos)
    (9,  'Analista de Costos de Manufactura',     'Análisis de costos de producción, eficiencia de línea y elaboración de reportes financieros de planta.'),
    (10, 'Coordinador de Recursos Humanos',       'Gestión de reclutamiento de personal operativo, nómina y relaciones laborales en planta.'),
    (11, 'Supervisor de Línea de Ensamble',       'Supervisión directa de operadores en línea de ensamble, control de calidad y cumplimiento de cuotas.'),
    (12, 'Ingeniero de Calidad Automotriz',       'Control de calidad en procesos de manufactura, atención de devoluciones y auditorías de producto.'),
    (13, 'Ejecutivo de Ventas de Flotillas',      'Comercialización de vehículos a clientes corporativos y gestión de contratos de flotilla.'),
    (14, 'Coordinador de Logística y Suministro', 'Control de inventarios, coordinación con proveedores y seguimiento de entregas en planta.');

INSERT INTO estado (id_estado, nombre_estado) VALUES
    (1, 'Ciudad de México'),
    (2, 'Jalisco'),
    (3, 'Nuevo León'),
    (4, 'Querétaro');

INSERT INTO municipio (id_municipio, nombre_municipio, id_estado) VALUES
    (1, 'Benito Juárez', 1),
    (2, 'Cuauhtémoc',    1),
    (3, 'Guadalajara',   2),
    (4, 'Monterrey',     3),
    (5, 'Querétaro',     4);

INSERT INTO aptitud (id_aptitud, nombre_aptitud, descripcion) VALUES
    (1,  'Liderazgo de Equipos Industriales', 'Capacidad para dirigir equipos de operación en planta automotriz hacia metas de producción y calidad.'),
    (2,  'Control Financiero de Planta',      'Dominio del análisis de costos de manufactura, presupuesto operativo y control de gastos en planta.'),
    (3,  'Gestión de Talento Industrial',     'Habilidad para reclutar, desarrollar y retener personal operativo y técnico en el sector automotriz.'),
    (4,  'Mejora Continua y Lean',            'Aplicación de metodologías Lean Manufacturing, Kaizen y Six Sigma para optimizar procesos productivos.'),
    (5,  'Comunicación Ejecutiva',            'Transmisión clara de estrategias, resultados y decisiones ante dirección, clientes OEM y organismos certificadores.'),
    (6,  'Toma de Decisiones bajo Presión',   'Resolución efectiva de paros de línea, problemas de calidad críticos y crisis operativas con impacto inmediato.'),
    (7,  'Gestión de Proyectos de Ingeniería','Planificación y ejecución de proyectos de mejora, lanzamiento de modelos y certificaciones automotrices.'),
    (8,  'Reducción de Costos Operativos',    'Identificación e implementación de mejoras en consumo de materiales, tiempos de ciclo y desperdicio en planta.'),
    (9,  'Desarrollo de Red Comercial',       'Expansión y gestión de la red de distribuidores, contratos de flotilla y canales de venta automotriz.'),
    (10, 'Asistencia y Puntualidad',          'Cumplimiento consistente de horarios de turno y compromisos operativos en planta.'),
    (11, 'Cumplimiento de Cuotas y Metas',    'Alcance sostenido de objetivos de producción, calidad (PPM) y ventas definidos por la dirección.'),
    (12, 'Negociación con Proveedores',       'Cierre de acuerdos con proveedores tier-1 y tier-2 bajo condiciones favorables de precio, calidad y tiempo.');

INSERT INTO direccion (id_direccion, calle, numero, colonia, codigo_postal, id_municipio) VALUES
    (1, 'Paseo de la Reforma',    '350',  'Cuauhtémoc',      '06500', 2),
    (2, 'Av. Insurgentes Sur',    '1457', 'Del Valle',        '03100', 1),
    (3, 'Blvd. Bernardo Quintana','2000', 'Centro Sur',       '76090', 5),
    (4, 'Av. Constituyentes',     '150',  'San Pablo',        '76000', 5),
    (5, 'Av. Lázaro Cárdenas',    '2305', 'Del Fresno',       '44900', 3),
    (6, 'Av. Revolución',         '1578', 'Guadalupe Inn',    '01020', 1),
    (7, 'Calle Hidalgo',          '320',  'Centro Histórico', '76000', 5),
    (8, 'Av. Constitución',       '1800', 'Obispado',         '64060', 4);

-- Contraseña de todos los usuarios: password
INSERT INTO empleado (id_empleado, nombre, apellido_paterno, apellido_materno, curp, nss, fecha_ingreso, fecha_nacimiento, rfc, correo, fotografia, cv, id_puesto, id_area, id_direccion, estatus) VALUES
    (1, 'Patricia',      'González', 'Herrera',   'GOHP830418MDFGNZH9', '09830418001', '2018-03-01', '1983-04-18', 'GOHP830418DF3', 'patricia.gonzalez@quetzal.mx', NULL, NULL,  9, 1, 1, 'activo'),
    (2, 'Carlos Alberto','Ramos',    'Pérez',     'RAPC881105HNLRMPA5', '19881105002', '2019-01-15', '1988-11-05', 'RAPC881105NL8', 'carlos.ramos@quetzal.mx',      NULL, NULL,  9, 2, 2, 'activo'),
    (3, 'Ana Sofía',     'Torres',   'Gutiérrez', 'TOGA900722MQTRTNG3', '22900722003', '2017-06-01', '1990-07-22', 'TOGA900722QP4', 'ana.torres@quetzal.mx',        NULL, NULL, 10, 3, 3, 'activo'),
    (4, 'Ricardo',       'Mendoza',  'Villanueva','MEVR850312HQTNLCA7', '22850312004', '2016-09-01', '1985-03-12', 'MEVR850312HG7', 'ricardo.mendoza@quetzal.mx',   NULL, NULL, 11, 4, 4, 'activo'),
    (5, 'Javier',        'Morales',  'Castillo',  'MOCJ870930HDFMRLS4', '09870930005', '2020-02-01', '1987-09-30', 'MOCJ870930KM5', 'javier.morales@quetzal.mx',    NULL, NULL, 12, 5, 5, 'activo'),
    (6, 'Luis Fernando', 'Vega',     'Sánchez',   'VESL860608HDFVGNC2', '09860608006', '2019-07-01', '1986-06-08', 'VESL860608SC9', 'luis.vega@quetzal.mx',         NULL, NULL, 13, 6, 6, 'activo'),
    (7, 'Gabriela',      'Reyes',    'Martínez',  'REMG940214MQRRYNB8', '22940214007', '2021-08-01', '1994-02-14', 'REMG940214BT2', 'gabriela.reyes@quetzal.mx',    NULL, NULL, 14, 4, 7, 'activo'),
    (8, 'María Elena',   'Fuentes',  'Álvarez',   'FUAM911125MMCFNTJ6', '15911125008', '2020-11-01', '1991-11-25', 'FUAM911125JP1', 'maria.fuentes@quetzal.mx',     NULL, NULL,  9, 2, 8, 'activo');

INSERT INTO usuario (id_usuario, correo, contrasena, id_rol, id_empleado) VALUES
    (1, 'admin@quetzal.mx',             '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NULL),
    (2, 'ana.torres@quetzal.mx',        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 3),
    (3, 'patricia.gonzalez@quetzal.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 1),
    (4, 'javier.morales@quetzal.mx',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 5),
    (5, 'luis.vega@quetzal.mx',         '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 6);

INSERT INTO vacante (id_vacante, id_puesto, id_area, descripcion, fecha_apertura, estatus) VALUES
    (1, 1, 1, 'Se requiere Director General para liderar la estrategia de crecimiento del grupo automotriz en el mercado nacional. Mínimo 15 años de experiencia en el sector, con historial comprobado en gestión de plantas de manufactura y negociación con armadoras OEM.',   '2026-01-15', 'disponible'),
    (2, 2, 2, 'Incorporación de Director de Finanzas para liderar el control de costos de manufactura, planeación presupuestal y estructura de capital ante el plan de expansión de dos nuevas plantas productivas proyectadas para 2027.',                                       '2026-02-01', 'disponible'),
    (3, 5, 5, 'Se busca Director de Ingeniería y Calidad para encabezar la obtención de la certificación IATF 16949, implementar proyectos de mejora continua y supervisar el área de ingeniería de producto con un equipo de 28 ingenieros.',                                  '2026-02-10', 'disponible'),
    (4, 6, 6, 'Proceso de selección de Director Comercial y Distribución concluido. Vacante cubierta internamente tras proceso de evaluación de candidatos del área de ventas.',                                                                                               '2025-11-01', 'no_disponible');

INSERT INTO vacante_aptitud (id_vacante, id_aptitud, porcentaje_minimo) VALUES
    (1, 1, 80.00), (1, 5, 75.00), (1, 6, 85.00),
    (2, 2, 80.00), (2, 8, 70.00), (2, 9, 75.00),
    (3, 4, 80.00), (3, 6, 75.00), (3, 7, 75.00);

INSERT INTO empleado_aptitud (id_empleado, id_aptitud, porcentaje_obtenido) VALUES
    -- Patricia González (Analista de Costos) — candidata a Director General
    (1,  1, 94.00), (1,  5, 91.00), (1,  6, 96.00), (1, 10, 85.00), (1, 11, 88.00),
    -- Carlos Ramos (Analista de Costos) — candidato a Director de Finanzas
    (2,  2, 95.00), (2,  8, 88.00), (2,  9, 85.00), (2, 10, 90.00), (2, 11, 92.00),
    -- Ana Torres (Coord. RH) — administradora RH
    (3,  1, 80.00), (3,  3, 93.00), (3,  5, 87.00), (3, 10, 88.00), (3, 11, 91.00),
    -- Ricardo Mendoza (Supervisor Línea) — candidato a Director de Planta
    (4,  1, 78.00), (4,  5, 74.00), (4,  6, 80.00), (4,  7, 90.00), (4,  8, 82.00), (4, 10, 92.00), (4, 11, 88.00),
    -- Javier Morales (Ingeniero Calidad) — candidato a Director de Ingeniería
    (5,  4, 96.00), (5,  5, 75.00), (5,  6, 82.00), (5,  7, 89.00), (5, 11, 85.00),
    -- Luis Vega (Ejecutivo Flotillas) — candidato a Director Comercial
    (6,  1, 82.00), (6,  5, 88.00), (6,  9, 90.00), (6, 11, 87.00), (6, 12, 94.00),
    -- Gabriela Reyes (Coord. Logística) — candidata multi-vacante
    (7,  4, 70.00), (7,  5, 84.00), (7,  6, 68.00), (7,  7, 91.00), (7,  8, 76.00), (7, 10, 95.00), (7, 11, 89.00),
    -- María Fuentes (Analista de Costos) — candidata a Director de Finanzas
    (8,  2, 87.00), (8,  8, 84.00), (8,  9, 78.00), (8, 10, 93.00), (8, 11, 85.00);

INSERT INTO match_vacante (id_match, id_empleado, id_vacante, porcentaje_compatibilidad, resultado, estado_proceso, fecha_match) VALUES
    -- Vacante 1: Director General
    (1,  1, 1, 100.00, 'compatible',    'aprobado',      '2026-02-20'),
    (2,  4, 1,  96.77, 'compatible',    'en_evaluacion', '2026-02-20'),
    (3,  6, 1,  66.67, 'no_compatible', 'rechazado',     '2026-02-20'),
    (4,  3, 1,  66.67, 'no_compatible', 'rechazado',     '2026-02-20'),
    -- Vacante 2: Director de Finanzas
    (5,  2, 2, 100.00, 'compatible',    'aprobado',      '2026-03-01'),
    (6,  8, 2, 100.00, 'compatible',    'en_evaluacion', '2026-03-01'),
    (7,  7, 2,  33.33, 'no_compatible', 'rechazado',     '2026-03-01'),
    -- Vacante 3: Director de Tecnología
    (8,  5, 3, 100.00, 'compatible',    'aprobado',      '2026-03-10'),
    (9,  7, 3,  92.73, 'compatible',    'en_evaluacion', '2026-03-10'),
    (10, 4, 3,  66.67, 'no_compatible', 'pendiente',     '2026-03-10');

-- Ajustar secuencias tras inserts con IDs explícitos
SELECT setval('rol_id_rol_seq',                (SELECT MAX(id_rol)          FROM rol));
SELECT setval('area_id_area_seq',              (SELECT MAX(id_area)         FROM area));
SELECT setval('puesto_id_puesto_seq',          (SELECT MAX(id_puesto)       FROM puesto));
SELECT setval('estado_id_estado_seq',          (SELECT MAX(id_estado)       FROM estado));
SELECT setval('municipio_id_municipio_seq',    (SELECT MAX(id_municipio)    FROM municipio));
SELECT setval('aptitud_id_aptitud_seq',        (SELECT MAX(id_aptitud)      FROM aptitud));
SELECT setval('direccion_id_direccion_seq',    (SELECT MAX(id_direccion)    FROM direccion));
SELECT setval('empleado_id_empleado_seq',      (SELECT MAX(id_empleado)     FROM empleado));
SELECT setval('vacante_id_vacante_seq',        (SELECT MAX(id_vacante)      FROM vacante));
SELECT setval('usuario_id_usuario_seq',        (SELECT MAX(id_usuario)      FROM usuario));
SELECT setval('match_vacante_id_match_seq',    (SELECT MAX(id_match)        FROM match_vacante));
