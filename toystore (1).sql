-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-05-2026 a las 20:27:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `toystore`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `subtotal` decimal(10,2) NOT NULL,
  `fecha_agregado` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Vibradores', 'Juguetes de vibración para placer personal'),
(2, 'Lencería', 'Ropa íntima y accesorios'),
(3, 'Anales', 'Productos para estimulación anal'),
(4, 'Kits', 'Combos y paquetes especiales'),
(5, 'Lubricantes', 'Lubricantes y aceites'),
(6, 'Accesorios', 'Esposas, cuerdas y accesorios varios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedido`
--

CREATE TABLE `detalle_pedido` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_pedido`
--

INSERT INTO `detalle_pedido` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(1, 1, 10, 1, 110000.00, 110000.00),
(2, 1, 22, 1, 38000.00, 38000.00),
(3, 1, 21, 1, 48000.00, 48000.00),
(4, 2, 22, 1, 38000.00, 38000.00),
(5, 3, 9, 1, 135000.00, 135000.00),
(6, 3, 14, 1, 120000.00, 120000.00),
(7, 4, 23, 4, 25000.00, 100000.00),
(8, 5, 13, 1, 75000.00, 75000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_pedido`
--

CREATE TABLE `estados_pedido` (
  `id_estado` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_pedido`
--

INSERT INTO `estados_pedido` (`id_estado`, `nombre`) VALUES
(1, 'Pendiente'),
(2, 'Procesando'),
(3, 'Enviado'),
(4, 'Entregado'),
(5, 'Cancelado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id_metodo`, `nombre`) VALUES
(1, 'Nequi'),
(2, 'Daviplata'),
(3, 'Bancolombia'),
(4, 'Mercado Pago'),
(5, 'PSE'),
(6, 'Tarjeta de crédito'),
(7, 'Contraentrega');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_metodo` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `monto` decimal(10,2) NOT NULL,
  `estado` varchar(50) DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL,
  `direccion_envio` varchar(255) DEFAULT NULL,
  `id_estado` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_usuario`, `fecha`, `total`, `direccion_envio`, `id_estado`) VALUES
(1, 2, '2026-05-15 12:23:36', 196000.00, 'Recogida en tienda', 1),
(2, 2, '2026-05-15 12:30:18', 38000.00, 'Recogida en tienda', 1),
(3, 2, '2026-05-15 12:32:17', 255000.00, 'Recogida en tienda', 1),
(4, 2, '2026-05-15 12:34:39', 100000.00, 'Recogida en tienda', 1),
(5, 2, '2026-05-15 12:37:39', 75000.00, 'Recogida en tienda', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `marca` varchar(100) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `nivel_discrecion` int(11) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `stock`, `marca`, `material`, `nivel_discrecion`, `imagen`, `id_categoria`, `id_proveedor`, `activo`) VALUES
(1, 'Vibrador Vaquera Deluxe', 'Se graduó con honores en la universidad del placer; no habla mucho, pero hace el trabajo duro por ti. Experta en rodeos nocturnos.', 89900.00, 10, NULL, NULL, 2, '/img/productos/vibrador.jpeg', 1, NULL, 1),
(2, 'Conjunto Lencería Bo Peep', 'No ha perdido a sus ovejas, solo busca a alguien que las ayude a contar... o a no dormir. Pura seda con intenciones pecaminosas.', 65000.00, 12, NULL, NULL, 1, '/img/productos/lenceria_bo.jpeg', 2, NULL, 1),
(3, 'Plug Anal Estrella Fugaz', 'Pide un deseo antes de usarlo. Brilla más que el cinturón de Orión y se queda donde lo necesitas para guiarte al infinito y más allá.', 45000.00, 15, NULL, NULL, 3, '/img/productos/plug_estrella.jpeg', 3, NULL, 1),
(4, 'Kit Aventura Rodeo', 'Todo lo que un sheriff necesita para una noche de patrulla apasionada. Incluye accesorios para arrestos preventivos y masajes de paz.', 120000.00, 8, NULL, NULL, 2, '/img/productos/caja_sorpresa.jpeg', 4, NULL, 1),
(5, 'Vibrador Buzz Espacial', 'Este comando estelar tiene una misión clara: llevarte al espacio sin salir de tu cuarto. ¡Al infinito y al éxtasis!', 55000.00, 20, NULL, NULL, 1, '/img/productos/balita.jpg', 1, NULL, 1),
(6, 'Body Jessie Western', 'Para las vaqueras que saben que el rojo es el color de la pasión y del peligro. Ajustable para cualquier duelo al sol.', 78000.00, 15, NULL, NULL, 2, '/img/productos/lenceria_roja.webp', 2, NULL, 1),
(7, 'Set Dilatadores Galaxy', 'Un viaje progresivo por los agujeros negros más placenteros del universo. Tres niveles de exploración profunda.', 95000.00, 6, NULL, NULL, 4, '/img/productos/dilatadores.webp', 3, NULL, 1),
(8, 'Kit Tu Primera Vez', 'Como tu primer juguete de Andy, pero con mucha más vibración. Básico, tierno y listo para que pierdas el miedo a las cosquillas.', 150000.00, 5, NULL, NULL, 1, '/img/productos/kit.jpeg', 4, NULL, 1),
(9, 'Succionador Clitorial Nebula', 'Tecnología de ondas de aire que succionan hasta tus preocupaciones. Es como un beso de un marciano, pero mucho mejor.', 135000.00, 9, NULL, NULL, 3, '/img/productos/succionador.jpeg', 1, NULL, 1),
(10, 'Arnés Cowgirl Premium', 'Para las que prefieren llevar las riendas del carruaje. Cuero vegano resistente para galopar toda la noche sin cansarse.', 110000.00, 3, NULL, NULL, 4, '/img/productos/arnes.webp', 6, NULL, 1),
(11, 'Lubricante Galaxia Dorada', 'El aceite oficial de la nave espacial. Resbala más que una cáscara de banana, pero con hermosos brillitos de oro.', 32000.00, 30, NULL, NULL, 1, '/img/productos/lubricante.jpeg', 5, NULL, 1),
(12, 'Esposas de Peluche Sheriff', 'Porque la ley también puede ser suave. Ideales para arrestos por exceso de velocidad... o por ser demasiado sexy.', 28000.00, 18, NULL, NULL, 2, '/img/productos/esposas_peluditas.jpeg', 6, NULL, 1),
(13, 'Slinky Flex Pro', 'Inspirado en el perro más flexible del cuarto. Se estira y vibra en todas las direcciones.', 75000.00, 14, NULL, NULL, 2, '/img/productos/slinky.png', 1, NULL, 1),
(14, 'Cohete Espacial XL', '¡Al infinito y al clímax! Este potente motor de doble turbina te hará despegar de la cama.', 120000.00, 9, NULL, NULL, 3, '/img/productos/cohete_vibrador.png', 1, NULL, 1),
(15, 'Conjunto Vaquera Jessie', 'Pura adrenalina de rodeo. Con detalles de vaca y encaje rojo pasión.', 85000.00, 20, NULL, NULL, 1, '/img/productos/lenceria_jessi.webp', 2, NULL, 1),
(16, 'Plug Marcianito Elegido', '¡El Ganchooo! Ha sido elegido para llevarte a un universo de sensaciones profundas.', 42000.00, 25, NULL, NULL, 3, '/img/productos/plug_marcianito.png', 3, NULL, 1),
(17, 'Dilatador Dinosaurio Rex', 'Grande, fuerte y listo para una aventura jurásica en el baúl.', 68000.00, 8, NULL, NULL, 4, '/img/productos/rex.png', 3, NULL, 1),
(18, 'Caja Misión Pizza Planeta', 'Todo lo que un cadete espacial necesita para una entrega a domicilio muy especial.', 180000.00, 5, NULL, NULL, 2, '/img/productos/kit_pizza.jpeg', 4, NULL, 1),
(19, 'Kit Rodeo en la Noche', 'El set completo del Sheriff. Esposas, antifaz y un vibrador bala.', 145000.00, 7, NULL, NULL, 3, '/img/productos/kit_vaquero.jpeg', 4, NULL, 1),
(20, 'Aceite de Carreras RC', 'Acelera de 0 a 100 en sensaciones. Lubricante a base de agua de larga duración.', 35000.00, 30, NULL, NULL, 1, '/img/productos/aceite_lubricante.jpeg', 5, NULL, 1),
(21, 'Gel de Masaje Nubes de Andy', 'Tan suave como el papel tapiz de la habitación. Relaja tus músculos.', 48000.00, 21, NULL, NULL, 1, '/img/productos/aceite_masaje.jpeg', 5, NULL, 1),
(22, 'Esposas Sheriff Woody', '¡Estás arrestado! Metal resistente con recubrimiento de peluche.', 38000.00, 16, NULL, NULL, 2, '/img/productos/esposas_peluditas.jpeg', 6, NULL, 1),
(23, 'Antifaz Señor Cara de Papa', 'Bloquea la luz y potencia tus otros sentidos.', 25000.00, 36, NULL, NULL, 1, '/img/productos/antifaz_papa.jpeg', 6, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenas`
--

CREATE TABLE `resenas` (
  `id_resena` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `usuario` varchar(100) DEFAULT 'Vaquero Anónimo',
  `texto` text NOT NULL,
  `medalla` varchar(50) DEFAULT NULL,
  `icono` varchar(10) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resenas`
--

INSERT INTO `resenas` (`id_resena`, `producto_id`, `usuario`, `texto`, `medalla`, `icono`, `color`, `fecha`) VALUES
(1, 16, 'Sara', 'Increible!!', 'Centinela de la Noche', '🌙', 'bg-indigo-100 text-indigo-700', '2026-05-15 16:12:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'admin'),
(2, 'cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `es_vip` tinyint(1) DEFAULT 0,
  `id_rol` int(11) DEFAULT 2,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `preferencias` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `contrasena`, `direccion`, `telefono`, `es_vip`, `id_rol`, `fecha_registro`, `reset_token`, `reset_token_expiry`, `avatar_url`, `preferencias`) VALUES
(1, 'Administrador', 'admin@toystore.com', '$2b$10$ejemploHashBcryptDeAdmin', NULL, NULL, 0, 1, '2026-03-06 08:19:21', NULL, NULL, NULL, NULL),
(2, 'Sara', 'saraguevara192@gmail.com', '$2b$10$6LPe0O1OrfgGej3t5maoC./fcSsjmFtzJd4ukZyxPooD1jSUbtOjW', NULL, NULL, 0, 2, '2026-03-06 10:28:33', '2c80efc2a4e082c570aaacae7c3cdba78109ce2eb94b9a07a2d9f704442a4098', '2026-03-27 09:35:54', '/uploads/avatars/avatar-2-1778862162894-103134865.jpg', NULL),
(5, 'Admin', 'administrador@toystore.com', '$2b$10$BajsmuRa4/UXIhh2Z5bXjetVx2lW1FqO3V/5AOqVFv/RFKSAt2igC', NULL, NULL, 0, 1, '2026-03-06 10:32:43', NULL, NULL, NULL, NULL),
(6, 'Mariana', 'alvarezfrancomariana@gmail.com', '$2b$10$nNSXXOeMvJM9K7t5D/Og4OPF3vhnBaLl9DkXKq.n7sBOxKI4HMz2C', NULL, NULL, 0, 2, '2026-03-11 09:44:39', '8a81872f7fedf0568a543c0c18c3ffe0f3127b7ad984846c62d18b04428c220c', '2026-03-11 10:46:13', NULL, NULL),
(7, 'valeria', 'saraguevarab1@sanjoseitagui.edu.co', '$2b$10$C733aLxZweKvdmmrC4onO.eSmNb9NwuEe5hnzxkaGliPCguFf//ca', NULL, NULL, 0, 2, '2026-03-27 08:30:43', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wishlist`
--

CREATE TABLE `wishlist` (
  `id_wishlist` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `privada` tinyint(1) DEFAULT 1,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `estados_pedido`
--
ALTER TABLE `estados_pedido`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_metodo`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_metodo` (`id_metodo`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`id_resena`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id_wishlist`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `estados_pedido`
--
ALTER TABLE `estados_pedido`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resenas`
--
ALTER TABLE `resenas`
  MODIFY `id_resena` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id_wishlist` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `detalle_pedido`
--
ALTER TABLE `detalle_pedido`
  ADD CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `pagos_ibfk_2` FOREIGN KEY (`id_metodo`) REFERENCES `metodos_pago` (`id_metodo`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_estado`) REFERENCES `estados_pedido` (`id_estado`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Filtros para la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

--
-- Filtros para la tabla `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
