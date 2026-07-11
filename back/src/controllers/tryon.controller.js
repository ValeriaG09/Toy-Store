// Usando fetch nativo de Node 18+
const path = require('path');
const fs = require('fs');

exports.processTryOn = async (req, res) => {
  try {
    const { person_image, garment_id } = req.body;

    if (!person_image || !garment_id) {
      return res.status(400).json({ error: 'Faltan parámetros (person_image o garment_id)' });
    }

    console.log(`[Try-On] Recibido: garment_id="${garment_id}", imagen base64 length=${person_image.length}`);

    // Mapear el ID de la prenda a su archivo local y a la URL pública de Vercel
    const VERCEL_URL = 'https://toy-store-red-mu.vercel.app';
    let garment_image_url = '';
    let localGarmentPath = '';

    if (garment_id === 'jessy') {
      garment_image_url = `${VERCEL_URL}/img/productos/lenceria_jessi.webp`;
      localGarmentPath = path.resolve(__dirname, '../../..', 'front/public/img/productos/lenceria_jessi.webp');
    } else if (garment_id === 'bo-peep') {
      garment_image_url = `${VERCEL_URL}/img/productos/lenceria_bo.jpeg`;
      localGarmentPath = path.resolve(__dirname, '../../..', 'front/public/img/productos/lenceria_bo.jpeg');
    } else {
      return res.status(400).json({ error: 'Prenda no válida' });
    }

    // Si estamos en desarrollo local, convertir la imagen de la prenda a base64
    // porque Fal.ai no puede acceder a localhost
    const isLocal = (process.env.FRONTEND_URL || '').includes('localhost');
    if (isLocal && fs.existsSync(localGarmentPath)) {
      const ext = path.extname(localGarmentPath).toLowerCase();
      const mimeTypes = { '.webp': 'image/webp', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png' };
      const mime = mimeTypes[ext] || 'image/jpeg';
      const imgBuffer = fs.readFileSync(localGarmentPath);
      garment_image_url = `data:${mime};base64,${imgBuffer.toString('base64')}`;
      console.log(`[Try-On] Usando imagen local como base64 (${(imgBuffer.length / 1024).toFixed(1)}KB)`);
    } else {
      console.log(`[Try-On] Usando URL pública: ${garment_image_url}`);
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      console.error('[Try-On] No se encontró FAL_KEY en las variables de entorno');
      return res.status(500).json({ error: 'FAL_KEY no configurada en el servidor' });
    }

    console.log('[Try-On] Enviando petición a Fal.ai (IDM-VTON)...');

    // Paso 1: Enviar a la cola de Fal.ai
    const submitResponse = await fetch('https://queue.fal.run/fal-ai/idm-vton', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        human_image_url: person_image,
        garment_image_url: garment_image_url,
        category: "dresses",
        description: "Lingerie outfit",
        crop_mode: "fit"
      })
    });

    const submitData = await submitResponse.json();

    if (!submitResponse.ok) {
      console.error('[Try-On] Error al enviar a Fal.ai:', JSON.stringify(submitData).substring(0, 500));
      return res.status(500).json({ error: 'Error procesando la imagen con IA', details: submitData });
    }

    // Si la respuesta ya contiene imágenes (respuesta síncrona)
    if (submitData.images && submitData.images.length > 0) {
      console.log('[Try-On] ✅ Resultado síncrono recibido');
      return res.json({ result_image: submitData.images[0].url });
    }

    // Paso 2: Polling del resultado
    const requestId = submitData.request_id;
    if (!requestId) {
      console.error('[Try-On] No se recibió request_id ni imágenes:', JSON.stringify(submitData).substring(0, 500));
      return res.status(500).json({ error: 'Respuesta inesperada de Fal.ai', details: submitData });
    }

    console.log(`[Try-On] Request encolado, ID: ${requestId}`);
    
    const statusUrl = `https://queue.fal.run/fal-ai/idm-vton/requests/${requestId}/status`;
    const resultUrl = `https://queue.fal.run/fal-ai/idm-vton/requests/${requestId}`;
    const maxAttempts = 60; // Máximo ~90 segundos de espera
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const statusRes = await fetch(statusUrl, {
        method: 'GET',
        headers: { 'Authorization': `Key ${FAL_KEY}` }
      });
      const statusData = await statusRes.json();

      console.log(`[Try-On] Polling #${attempt + 1}: ${statusData.status}`);

      if (statusData.status === 'COMPLETED') {
        // Obtener el resultado final
        const resultRes = await fetch(resultUrl, {
          method: 'GET',
          headers: { 'Authorization': `Key ${FAL_KEY}` }
        });
        const finalData = await resultRes.json();

        if (finalData.images && finalData.images.length > 0) {
          console.log('[Try-On] ✅ Resultado obtenido con éxito');
          return res.json({ result_image: finalData.images[0].url });
        } else {
          console.error('[Try-On] Completado pero sin imágenes:', JSON.stringify(finalData).substring(0, 500));
          return res.status(500).json({ error: 'No se generó ninguna imagen' });
        }
      } else if (statusData.status === 'FAILED') {
        console.error('[Try-On] Fal.ai falló:', JSON.stringify(statusData).substring(0, 500));
        return res.status(500).json({ error: 'Error en la generación de IA', details: statusData });
      }
      // IN_QUEUE o IN_PROGRESS → seguimos esperando
    }

    // Timeout
    console.error('[Try-On] Timeout: la generación tardó demasiado');
    return res.status(504).json({ error: 'La generación tardó demasiado. Intenta de nuevo.' });

  } catch (error) {
    console.error('[Try-On] Error interno:', error.message);
    console.error(error.stack);
    res.status(500).json({ error: 'Error interno del servidor en Try-On', detail: error.message });
  }
};
