-- Esquema de Base de Datos para PostgreSQL (Supabase / Render)

-- Tabla Categorías
CREATE TABLE categorias (
  id_categoria SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

INSERT INTO categorias (nombre, descripcion) VALUES
('Vibradores', 'Juguetes de vibración para placer personal'),
('Lencería', 'Ropa íntima y accesorios'),
('Anales', 'Productos para estimulación anal'),
('Kits', 'Combos y paquetes especiales'),
('Lubricantes', 'Lubricantes y aceites'),
('Accesorios', 'Esposas, cuerdas y accesorios varios');

-- Tabla Productos
CREATE TABLE productos (
  id_producto SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  marca VARCHAR(100),
  material VARCHAR(100),
  nivel_discrecion INTEGER,
  imagen VARCHAR(255),
  id_categoria INTEGER REFERENCES categorias(id_categoria),
  id_proveedor INTEGER,
  activo BOOLEAN DEFAULT TRUE
);

INSERT INTO productos (nombre, descripcion, precio, stock, nivel_discrecion, imagen, id_categoria, activo) VALUES
('Vibrador Vaquera Deluxe', 'Se graduó con honores en la universidad del placer; no habla mucho, pero hace el trabajo duro por ti. Experta en rodeos nocturnos.', 89900.00, 10, 2, '/img/productos/vibrador.jpeg', 1, TRUE),
('Conjunto Lencería Bo Peep', 'No ha perdido a sus ovejas, solo busca a alguien que las ayude a contar... o a no dormir. Pura seda con intenciones pecaminosas.', 65000.00, 12, 1, '/img/productos/lenceria_bo.jpeg', 2, TRUE),
('Plug Anal Estrella Fugaz', 'Pide un deseo antes de usarlo. Brilla más que el cinturón de Orión y se queda donde lo necesitas para guiarte al infinito y más allá.', 45000.00, 15, 3, '/img/productos/plug_estrella.jpeg', 3, TRUE),
('Kit Aventura Rodeo', 'Todo lo que un sheriff necesita para una noche de patrulla apasionada. Incluye accesorios para arrestos preventivos y masajes de paz.', 120000.00, 8, 2, '/img/productos/caja_sorpresa.jpeg', 4, TRUE),
('Vibrador Buzz Espacial', 'Este comando estelar tiene una misión clara: llevarte al espacio sin salir de tu cuarto. ¡Al infinito y al éxtasis!', 55000.00, 20, 1, '/img/productos/balita.jpg', 1, TRUE),
('Body Jessie Western', 'Para las vaqueras que saben que el rojo es el color de la pasión y del peligro. Ajustable para cualquier duelo al sol.', 78000.00, 15, 2, '/img/productos/lenceria_roja.webp', 2, TRUE),
('Set Dilatadores Galaxy', 'Un viaje progresivo por los agujeros negros más placenteros del universo. Tres niveles de exploración profunda.', 95000.00, 6, 4, '/img/productos/dilatadores.webp', 3, TRUE),
('Kit Tu Primera Vez', 'Como tu primer juguete de Andy, pero con mucha más vibración. Básico, tierno y listo para que pierdas el miedo a las cosquillas.', 150000.00, 5, 1, '/img/productos/kit.jpeg', 4, TRUE),
('Succionador Clitorial Nebula', 'Tecnología de ondas de aire que succionan hasta tus preocupaciones. Es como un beso de un marciano, pero mucho mejor.', 135000.00, 9, 3, '/img/productos/succionador.jpeg', 1, TRUE),
('Arnés Cowgirl Premium', 'Para las que prefieren llevar las riendas del carruaje. Cuero vegano resistente para galopar toda la noche sin cansarse.', 110000.00, 3, 4, '/img/productos/arnes.webp', 6, TRUE),
('Lubricante Galaxia Dorada', 'El aceite oficial de la nave espacial. Resbala más que una cáscara de banana, pero con hermosos brillitos de oro.', 32000.00, 30, 1, '/img/productos/lubricante.jpeg', 5, TRUE),
('Esposas de Peluche Sheriff', 'Porque la ley también puede ser suave. Ideales para arrestos por exceso de velocidad... o por ser demasiado sexy.', 28000.00, 18, 2, '/img/productos/esposas_peluditas.jpeg', 6, TRUE),
('Slinky Flex Pro', 'Inspirado en el perro más flexible del cuarto. Se estira y vibra en todas las direcciones.', 75000.00, 14, 2, '/img/productos/slinky.png', 1, TRUE),
('Cohete Espacial XL', '¡Al infinito y al clímax! Este potente motor de doble turbina te hará despegar de la cama.', 120000.00, 9, 3, '/img/productos/cohete_vibrador.png', 1, TRUE),
('Conjunto Vaquera Jessie', 'Pura adrenalina de rodeo. Con detalles de vaca y encaje rojo pasión.', 85000.00, 20, 1, '/img/productos/lenceria_jessi.webp', 2, TRUE),
('Plug Marcianito Elegido', '¡El Ganchooo! Ha sido elegido para llevarte a un universo de sensaciones profundas.', 42000.00, 25, 3, '/img/productos/plug_marcianito.png', 3, TRUE),
('Dilatador Dinosaurio Rex', 'Grande, fuerte y listo para una aventura jurásica en el baúl.', 68000.00, 8, 4, '/img/productos/rex.png', 3, TRUE),
('Caja Misión Pizza Planeta', 'Todo lo que un cadete espacial necesita para una entrega a domicilio muy especial.', 180000.00, 5, 2, '/img/productos/kit_pizza.jpeg', 4, TRUE),
('Kit Rodeo en la Noche', 'El set completo del Sheriff. Esposas, antifaz y un vibrador bala.', 145000.00, 7, 3, '/img/productos/kit_vaquero.jpeg', 4, TRUE),
('Aceite de Carreras RC', 'Acelera de 0 a 100 en sensaciones. Lubricante a base de agua de larga duración.', 35000.00, 30, 1, '/img/productos/aceite_lubricante.jpeg', 5, TRUE),
('Gel de Masaje Nubes de Andy', 'Tan suave como el papel tapiz de la habitación. Relaja tus músculos.', 48000.00, 21, 1, '/img/productos/aceite_masaje.jpeg', 5, TRUE),
('Esposas Sheriff Woody', '¡Estás arrestado! Metal resistente con recubrimiento de peluche.', 38000.00, 16, 2, '/img/productos/esposas_peluditas.jpeg', 6, TRUE),
('Antifaz Señor Cara de Papa', 'Bloquea la luz y potencia tus otros sentidos.', 25000.00, 36, 1, '/img/productos/antifaz_papa.jpeg', 6, TRUE);

-- Tabla Roles
CREATE TABLE roles (
  id_rol SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (nombre) VALUES ('admin'), ('cliente');

-- Tabla Usuarios
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  es_vip BOOLEAN DEFAULT FALSE,
  id_rol INTEGER DEFAULT 2 REFERENCES roles(id_rol),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  avatar_url VARCHAR(255),
  preferencias TEXT,
  fecha_nacimiento DATE
);

-- Tabla Reseñas
CREATE TABLE resenas (
  id_resena SERIAL PRIMARY KEY,
  producto_id INTEGER REFERENCES productos(id_producto),
  usuario VARCHAR(100) DEFAULT 'Vaquero Anónimo',
  texto TEXT NOT NULL,
  medalla VARCHAR(50),
  icono VARCHAR(10),
  color VARCHAR(50),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO resenas (producto_id, usuario, texto, medalla, icono, color) VALUES 
(16, 'Sara', 'Increible!!', 'Centinela de la Noche', '', 'bg-indigo-100 text-indigo-700');

-- Tabla Proveedores
CREATE TABLE proveedores (
  id_proveedor SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  telefono VARCHAR(20)
);

-- Tabla Estados Pedido
CREATE TABLE estados_pedido (
  id_estado SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

INSERT INTO estados_pedido (nombre) VALUES 
('Pendiente'), ('Procesando'), ('Enviado'), ('Entregado'), ('Cancelado');

-- Tabla Pedidos
CREATE TABLE pedidos (
  id_pedido SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id_usuario),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  direccion_envio VARCHAR(255),
  id_estado INTEGER DEFAULT 1 REFERENCES estados_pedido(id_estado)
);

-- Tabla Detalle Pedido
CREATE TABLE detalle_pedido (
  id_detalle SERIAL PRIMARY KEY,
  id_pedido INTEGER REFERENCES pedidos(id_pedido),
  id_producto INTEGER REFERENCES productos(id_producto),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Tabla Metodos Pago
CREATE TABLE metodos_pago (
  id_metodo SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

INSERT INTO metodos_pago (nombre) VALUES 
('Nequi'), ('Daviplata'), ('Bancolombia'), ('Mercado Pago'), ('PSE'), ('Tarjeta de crédito'), ('Contraentrega');

-- Tabla Pagos
CREATE TABLE pagos (
  id_pago SERIAL PRIMARY KEY,
  id_pedido INTEGER REFERENCES pedidos(id_pedido),
  id_metodo INTEGER REFERENCES metodos_pago(id_metodo),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  monto DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente'
);

-- Tabla Carrito
CREATE TABLE carrito (
  id_carrito SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id_usuario),
  id_producto INTEGER REFERENCES productos(id_producto),
  cantidad INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
