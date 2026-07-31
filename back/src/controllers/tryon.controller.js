// Usando fetch nativo de Node 18+
const path = require('path');
const fs = require('fs');

exports.processTryOn = async (req, res) => {
  try {
    const { person_image, garment_id } = req.body;

    if (!person_image || !garment_id) {
      return res.status(400).json({ error: 'Faltan parámetros (person_image o garment_id)' });
    }

    console.log(`[Try-On Mock] Recibido: garment_id="${garment_id}", imagen base64 length=${person_image.length}`);

    // Mapear el ID de la prenda a su archivo local y a la URL pública
    let garment_image_url = '';
    if (garment_id === 'jessy') {
      garment_image_url = `/img/productos/lenceria_jessi.webp`;
    } else if (garment_id === 'bo-peep') {
      garment_image_url = `/img/productos/lenceria_bo.jpeg`;
    } else {
      return res.status(400).json({ error: 'Prenda no válida' });
    }

    console.log('[Try-On Mock] Simulando procesamiento de IA...');

    // Simulamos un tiempo de espera de 3 segundos para que parezca que la IA está trabajando
    await new Promise(resolve => setTimeout(resolve, 3000));

    // En un entorno de simulación (Mock), retornamos simplemente la imagen de la prenda 
    // o una imagen pre-generada para demostrar que la UI funciona.
    // Como no tenemos una IA real activa, devolvemos la URL de la prenda misma a modo de demo.
    console.log('[Try-On Mock] Resultado generado con éxito');
    return res.json({ result_image: garment_image_url });

  } catch (error) {
    console.error('[Try-On Mock] Error interno:', error.message);
    res.status(500).json({ error: 'Error interno del servidor en Try-On', detail: error.message });
  }
};

exports.processTryOnFormData = async (req, res) => {
  try {
    if (!req.files || !req.files.persona || !req.files.prenda) {
      return res.status(400).json({ error: 'Faltan imágenes (persona o prenda)' });
    }

    // Identificamos qué prenda es por el nombre del archivo
    const prendaFile = req.files.prenda[0];
    const fileName = prendaFile.originalname.toLowerCase();
    
    let resultUrl = '';
    if (fileName.includes('jessi') || fileName.includes('jessy')) {
      resultUrl = '/img/productos/lenceria_jessi.webp';
    } else {
      resultUrl = '/img/productos/lenceria_bo.jpeg';
    }

    console.log('[Try-On FormData Mock] Simulando procesamiento de IA...');

    // Simulamos tiempo de espera de 4 segundos
    await new Promise(resolve => setTimeout(resolve, 4000));

    console.log('[Try-On FormData Mock] Resultado generado con éxito');
    return res.json({ result_image: resultUrl });

  } catch (error) {
    console.error('[Try-On FormData Mock] Error interno:', error.message);
    res.status(500).json({ error: 'Error interno del servidor en Try-On', detail: error.message });
  }
};
