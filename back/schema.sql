-- Create Users Table (MySQL)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    es_vip BOOLEAN DEFAULT FALSE,
    id_rol INT DEFAULT 2,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    avatar_url VARCHAR(255),
    preferencias TEXT,
    fecha_nacimiento DATE
);
