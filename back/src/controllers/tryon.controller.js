// Usando fetch nativo de Node 18+

exports.processTryOn = async (req, res) => {
  try {
    const { person_image, garment_id } = req.body;

    if (!person_image || !garment_id) {
      return res.status(400).json({ error: 'Faltan parámetros (person_image o garment_id)' });
    }

    // Mapear el ID de la prenda a la URL pública en Vercel
    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://toy-store-red-mu.vercel.app';
    let garment_image_url = '';

    if (garment_id === 'jessy') {
      garment_image_url = `${FRONTEND_URL}/img/productos/lenceria_jessi.webp`;
    } else if (garment_id === 'bo-peep') {
      garment_image_url = `${FRONTEND_URL}/img/productos/lenceria_bo.jpeg`;
    } else {
      return res.status(400).json({ error: 'Prenda no válida' });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      console.error('No se encontró FAL_KEY en las variables de entorno');
      return res.status(500).json({ error: 'FAL_KEY no configurada en el servidor' });
    }

    console.log('Iniciando petición a Fal.ai con IDM-VTON...');

    // Llamada a Fal.ai usando el modelo IDM-VTON
    const falResponse = await fetch('https://queue.fal.run/fal-ai/idm-vton', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        human_image_url: person_image,
        garment_image_url: garment_image_url,
        category: "dresses", // Recomendado para lencería/cuerpo completo
        description: "Lingerie outfit",
        crop_mode: "fit"
      })
    });

    const falData = await falResponse.json();
    
    if (!falResponse.ok) {
      console.error('Error de Fal.ai:', falData);
      return res.status(500).json({ error: 'Error procesando la imagen con IA', details: falData });
    }

    // Fal.ai usa una cola, obtenemos el request_id
    const requestId = falData.request_id;
    
    if (!requestId && falData.images && falData.images.length > 0) {
        // Respuesta síncrona
        return res.json({ result_image: falData.images[0].url });
    }

    // Polling the request status
    const statusUrl = `https://queue.fal.run/fal-ai/idm-vton/requests/${requestId}`;
    let isComplete = false;
    let finalData = null;

    while (!isComplete) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Esperar 1.5s
      const statusRes = await fetch(statusUrl, {
        method: 'GET',
        headers: { 'Authorization': `Key ${FAL_KEY}` }
      });
      const statusData = await statusRes.json();

      if (statusData.status === 'COMPLETED') {
        isComplete = true;
        
        // Obtener el resultado final
        const resultRes = await fetch(statusUrl, {
           method: 'GET',
           headers: { 'Authorization': `Key ${FAL_KEY}` }
        });
        finalData = await resultRes.json();
        
      } else if (statusData.status === 'IN_QUEUE' || statusData.status === 'IN_PROGRESS') {
        console.log(`Estado: ${statusData.status}...`);
      } else {
        isComplete = true;
        console.error('Fal falló:', statusData);
        return res.status(500).json({ error: 'Error en la generación de IA', details: statusData });
      }
    }

    if (finalData && finalData.images && finalData.images.length > 0) {
      res.json({ result_image: finalData.images[0].url });
    } else {
      res.status(500).json({ error: 'No se generó ninguna imagen' });
    }

  } catch (error) {
    console.error('Error en Try-On:', error);
    res.status(500).json({ error: 'Error interno del servidor en Try-On' });
  }
};
