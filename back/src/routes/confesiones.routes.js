const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../../data/confesiones.json');

const getConfesiones = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error al leer confesiones:', err);
  }
  return [];
};

const saveConfesiones = (confesiones) => {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(confesiones, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error al guardar confesiones:', err);
    return false;
  }
};

// Obtener todas las confesiones
router.get('/', (req, res) => {
  const confesiones = getConfesiones();
  res.json({ confesiones });
});

// Crear una nueva confesión
router.post('/', (req, res) => {
  const { texto, tag, esAnonimo, autor, autorUsuario, avatarHat, fotoPerfil } = req.body;
  if (!texto || !texto.trim()) {
    return res.status(400).json({ error: 'El texto de la confesión es obligatorio' });
  }

  const confesiones = getConfesiones();
  const nueva = {
    id: `conf-${Date.now()}`,
    autor: esAnonimo ? 'Anónimo' : (autor || 'Usuario'),
    autorUsuario: esAnonimo ? null : (autorUsuario || null),
    esAnonimo: Boolean(esAnonimo),
    avatarHat: esAnonimo ? null : (avatarHat || null),
    fotoPerfil: esAnonimo ? null : (fotoPerfil || null),
    tag: tag || 'En pareja',
    tiempo: 'justo ahora',
    texto: texto.trim(),
    likes: 0,
    liked: false,
    comentarios: []
  };

  confesiones.unshift(nueva);
  saveConfesiones(confesiones);
  res.json({ mensaje: 'Confesión creada exitosamente', confesion: nueva });
});

// Dar / quitar me gusta a una confesión
router.post('/:id/like', (req, res) => {
  const { id } = req.params;
  const confesiones = getConfesiones();
  const index = confesiones.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Confesión no encontrada' });
  }

  const actual = confesiones[index];
  const nuevoLiked = !actual.liked;
  actual.liked = nuevoLiked;
  actual.likes = nuevoLiked ? (actual.likes || 0) + 1 : Math.max(0, (actual.likes || 1) - 1);

  saveConfesiones(confesiones);
  res.json({ likes: actual.likes, liked: actual.liked, confesion: actual });
});

// Agregar comentario a una confesión
router.post('/:id/comentarios', (req, res) => {
  const { id } = req.params;
  const { texto, autor } = req.body;

  if (!texto || !texto.trim()) {
    return res.status(400).json({ error: 'El texto del comentario es obligatorio' });
  }

  const confesiones = getConfesiones();
  const index = confesiones.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Confesión no encontrada' });
  }

  const actual = confesiones[index];
  if (!Array.isArray(actual.comentarios)) {
    actual.comentarios = [];
  }

  const nuevoComentario = {
    id: `c-${Date.now()}`,
    autor: autor || 'Anónimo',
    texto: texto.trim(),
    tiempo: 'justo ahora'
  };

  actual.comentarios.push(nuevoComentario);
  saveConfesiones(confesiones);
  res.json({ comentario: nuevoComentario, confesion: actual });
});

module.exports = router;

