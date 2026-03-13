CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    CHECK (nombre_rol IN ('superadmin','admin','empleado'))
);

CREATE TABLE area (
    id_area SERIAL PRIMARY KEY,
    nombre_area VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE puesto (
    id_puesto SERIAL PRIMARY KEY,
    nombre_puesto VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE estado (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE municipio (
    id_municipio SERIAL PRIMARY KEY,
    nombre_municipio VARCHAR(100) NOT NULL,
    id_estado INT NOT NULL,
    FOREIGN KEY (id_estado) REFERENCES estado(id_estado)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    UNIQUE (nombre_municipio, id_estado)
);

CREATE TABLE direccion (
    id_direccion SERIAL PRIMARY KEY,
    calle VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    colonia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    id_municipio INT NOT NULL,
    FOREIGN KEY (id_municipio) REFERENCES municipio(id_municipio)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    curp VARCHAR(18) NOT NULL UNIQUE,
    nss VARCHAR(11) NOT NULL UNIQUE,
    fecha_ingreso DATE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    rfc VARCHAR(13) NOT NULL UNIQUE,
    fotografia TEXT,
    cv TEXT,
    id_puesto INT NOT NULL,
    id_area INT NOT NULL,
    id_direccion INT NOT NULL,
    estatus VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_puesto) REFERENCES puesto(id_puesto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (id_area) REFERENCES area(id_area)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CHECK (estatus IN ('activo','inactivo'))
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    id_rol INT NOT NULL,
    id_empleado INT UNIQUE,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE vacante (
    id_vacante SERIAL PRIMARY KEY,
    id_puesto INT NOT NULL,
    id_area INT NOT NULL,
    fecha_apertura DATE NOT NULL,
    estatus VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_puesto) REFERENCES puesto(id_puesto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (id_area) REFERENCES area(id_area)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CHECK (estatus IN ('disponible','no_disponible'))
);

CREATE TABLE aptitud (
    id_aptitud SERIAL PRIMARY KEY,
    nombre_aptitud VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE empleado_aptitud (
    id_empleado INT NOT NULL,
    id_aptitud INT NOT NULL,
    porcentaje_obtenido NUMERIC(5,2) NOT NULL,
    PRIMARY KEY (id_empleado, id_aptitud),
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_aptitud) REFERENCES aptitud(id_aptitud)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CHECK (porcentaje_obtenido >= 0 AND porcentaje_obtenido <= 100)
);

CREATE TABLE vacante_aptitud (
    id_vacante INT NOT NULL,
    id_aptitud INT NOT NULL,
    porcentaje_minimo NUMERIC(5,2) NOT NULL,
    PRIMARY KEY (id_vacante, id_aptitud),
    FOREIGN KEY (id_vacante) REFERENCES vacante(id_vacante)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_aptitud) REFERENCES aptitud(id_aptitud)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CHECK (porcentaje_minimo >= 0 AND porcentaje_minimo <= 100)
);

CREATE TABLE match_vacante (
    id_match SERIAL PRIMARY KEY,
    id_empleado INT NOT NULL,
    id_vacante INT NOT NULL,
    porcentaje_compatibilidad NUMERIC(5,2) NOT NULL,
    resultado VARCHAR(20) NOT NULL,
    fecha_match DATE NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_vacante) REFERENCES vacante(id_vacante)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    UNIQUE (id_empleado, id_vacante),
    CHECK (porcentaje_compatibilidad >= 0 AND porcentaje_compatibilidad <= 100),
    CHECK (resultado IN ('compatible','no_compatible'))
);