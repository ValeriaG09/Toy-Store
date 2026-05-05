
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    nivel_juego INT DEFAULT 1,
    imagen VARCHAR(255),
    descripcion TEXT,
    stock INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Limpiar para evitar duplicados en el seed (opcional para desarrollo)
DELETE FROM productos;

INSERT INTO productos (nombre, precio, categoria, nivel_juego, imagen, descripcion) VALUES
('Vibrador Cowgirl', 85000, 'vibradores', 3, '/images/vibrador_cowgirl.png', 'Vibrador ergonómico para aventuras espaciales.'),
('Lencería de Andy', 120000, 'lencerias', 1, '/images/lenceria_andy.png', 'Conjunto seductor para momentos vaqueros.'),
('Plug Anal Sheriff', 45000, 'anales', 4, '/images/plug_anal.png', 'Exploración profunda con la seguridad del sheriff.'),
('Caja Misteriosa Al', 250000, 'kits', 5, '/images/mystery_box.png', 'Un kit completo para los coleccionistas más audaces.'),
('Esposas Galactic', 35000, 'accesorios', 2, '/images/handcuffs.png', 'Restricción suave para misiones peligrosas.'),
('Dildo Woody', 70000, 'penes', 3, '/images/woody_toy.png', 'Madera de héroe para tu diversión.'),
('Vibrador Rabbit Buzz', 95000, 'vibradores', 4, '/images/rabbit_toy.png', '¡Hasta el infinito y más allá!'),
('Whip Domador', 55000, 'accesorios', 5, '/images/whip.png', 'Toma el control de la juguetería.'),
('Labial de Fresa Lotso', 15000, 'cosmeticos', 1, '/images/lotso_lip.png', 'Sabor a fresa y maldad dulce.'),
('Aceite de Masaje Rex', 30000, 'cosmeticos', 1, '/images/rex_oil.png', 'Relajación prehistórica irresistible.');
