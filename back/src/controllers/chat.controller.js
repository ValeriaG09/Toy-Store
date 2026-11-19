const db = require('../config/db');
const jwt = require('jsonwebtoken');

/**
 * Normaliza texto eliminando acentos y convirtiendo a minúsculas.
 */
function normalizeText(str = '') {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Detecta si el mensaje contiene términos propios de administración, inventario o datos internos.
 */
function esConsultaAdmin(text = '') {
  const palabrasAdmin = [
    "stock",
    "inventario",
    "almacen",
    "unidades disponible",
    "cuantas unidades",
    "cuanto stock",
    "stock bajo",
    "stock critico",
    "agotad",
    "admin",
    "administra",
    "panel",
    "dashboard",
    "reporte",
    "metricas",
    "estadistica",
    "total producto",
    "total usuario",
    "usuarios registrad",
    "clientes registrad",
    "base de dato",
    "ganancia",
    "ingreso",
    "ventas",
    "password",
    "contrasena",
    "roles",
    "cuantos usuarios",
    "cuantos clientes"
  ];
  return palabrasAdmin.some(p => text.includes(p));
}

/**
 * Controlador principal de mensajes para el Chatbot "Toyito".
 */
const procesarMensaje = async (req, res) => {
  try {
    const { mensaje = '', usuario = null } = req.body;
    const cleanText = normalizeText(mensaje);

    // ─── VERIFICACIÓN DE ROL: ¿ES ADMINISTRADOR? ───────────────────
    let esAdmin = false;
    let datosUsuario = usuario;

    // 1. Validar cookie HTTP-Only 'token' con JWT
    const token = req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && (
          decoded.rol === 1 || 
          decoded.id_rol === 1 || 
          decoded.email === 'alvarezfrancomariana@gmail.com' || 
          decoded.email === 'saraguevara192@gmail.com'
        )) {
          esAdmin = true;
          datosUsuario = decoded;
        }
      } catch (err) {
        // Token no válido o expirado
      }
    }

    // 2. Validar objeto de usuario enviado por el frontend
    if (!esAdmin && usuario) {
      if (
        usuario.id_rol === 1 || 
        usuario.rol === 1 || 
        usuario.rol === 'admin' || 
        usuario.email === 'alvarezfrancomariana@gmail.com' || 
        usuario.email === 'saraguevara192@gmail.com'
      ) {
        esAdmin = true;
        datosUsuario = usuario;
      }
    }

    let respuestaTexto = "";
    let productosRecomendados = [];
    let sugerencias = esAdmin ? [
      "Estado general del inventario",
      "Productos con stock crítico",
      "Resumen por categorías",
      "Métricas de usuarios registrados"
    ] : [
      "¿Qué sorpresas me recomiendas hoy?",
      "¿Cómo garantizan la discreción de mi entrega?",
      "Ideas para encender la chispa en pareja",
      "Sensaciones intensas para disfrutar a solas",
      "Los secretos más deseados de la tienda"
    ];

    // ─── CONTROL DE ACCESO: BLOQUEO PARA USUARIOS NORMALES ─────────
    // Si un usuario NO es admin e intenta consultar información de administración/stock
    if (esConsultaAdmin(cleanText) && !esAdmin) {
      return res.json({
        respuesta: "Esa información es de carácter confidencial y de acceso exclusivo para el equipo de administración de Toy Store.\n\nComo tu asesor personal en la tienda, estoy aquí para guiarte en nuestro catálogo, recomendarte los mejores juguetes y responder todas tus dudas con 100% de confidencialidad.",
        productos: [],
        sugerencias: [
          "¿Qué sorpresas me recomiendas hoy?",
          "¿Cómo garantizan la discreción de mi entrega?",
          "Ideas para encender la chispa en pareja",
          "Sensaciones intensas para disfrutar a solas",
          "Los secretos más deseados de la tienda"
        ]
      });
    }

    // ─── CONSULTAS EXCLUSIVAS DE ADMINISTRADOR ──────────────────────
    if (esAdmin && esConsultaAdmin(cleanText)) {

      // A. Stock bajo o crítico
      if (cleanText.includes("bajo") || cleanText.includes("critico") || cleanText.includes("agotad") || cleanText.includes("por agotar") || cleanText.includes("poco")) {
        const [lowStock] = await db.query(
          "SELECT id, nombre, stock, precio, categoria FROM productos WHERE stock <= 10 ORDER BY stock ASC LIMIT 6"
        );
        if (lowStock.length > 0) {
          const lista = lowStock.map(p => `• ${p.nombre} (${p.categoria})\n  Disponibles: ${p.stock} unidades | Precio: $${Number(p.precio).toLocaleString()}`).join('\n\n');
          respuestaTexto = `¡Revisé todo el almacén!\n\nEncontré estos productos que ya tienen poquitas unidades:\n\n${lista}\n\nTe recomiendo tenerlos en cuenta para reabastecer pronto la tienda.`;
        } else {
          respuestaTexto = `¡Buenas noticias, querida admin!\n\nRevisé todo el catálogo y actualmente ningún producto tiene stock crítico. Todas las referencias cuentan con niveles de inventario saludables (más de 10 unidades por producto). ¡La tienda está muy bien abastecida!`;
        }
        productosRecomendados = lowStock.slice(0, 4);
        sugerencias = [
          "Estado general del inventario",
          "Resumen por categorías",
          "Métricas de usuarios registrados"
        ];
      }

      // B. Stock específico de un producto (ej: "stock de Cerdito Travieso", "cuanto stock hay de vibrador", "unidades de lenceria")
      else if (
        cleanText.includes("stock de") || 
        cleanText.includes("unidades de") || 
        cleanText.includes("stock del") ||
        cleanText.includes("unidades del") ||
        cleanText.includes("stock hay de") ||
        cleanText.includes("cuanto stock de") ||
        cleanText.includes("cuanto stock hay de") ||
        cleanText.includes("cuantas unidades de") ||
        cleanText.includes("cuantas unidades hay de") ||
        cleanText.includes("queda de")
      ) {
        let term = cleanText
          .replace(/.*(?:stock (?:hay )?de|unidades (?:hay )?de|stock del|unidades del|cuanto stock (?:hay )?de|cuantas unidades (?:hay )?de|queda de)\s*/i, '')
          .replace(/[?¿!¡]/g, '')
          .trim();
        
        const [found] = term ? await db.query(
          "SELECT * FROM productos WHERE LOWER(nombre) LIKE ? OR LOWER(categoria) LIKE ? LIMIT 4",
          [`%${term}%`, `%${term}%`]
        ) : [[]];

        if (found.length > 0) {
          const detalles = found.map(p => `• ${p.nombre}\n  Categoría: ${p.categoria}\n  Unidades en bodega: ${p.stock} unidades\n  Precio: $${Number(p.precio).toLocaleString()}`).join('\n\n');
          respuestaTexto = `¡Aquí tienes los detalles del producto que me pediste!\n\n${detalles}\n\n¿Deseas consultar alguna otra referencia?`;
          productosRecomendados = found;
        } else if (term) {
          respuestaTexto = `Revisé en la base de datos pero no encontré ningún producto con la referencia "${term}".\n\n¿Quieres que revisemos el inventario general o alguna categoría en específico?`;
        } else {
          const [stats] = await db.query(
            "SELECT COUNT(*) as total, SUM(stock) as totalStock, SUM(stock * precio) as valorInventario FROM productos"
          );
          respuestaTexto = `¡Aquí tienes el resumen de bodega!\n\n• Total de productos: ${stats[0].total} referencias\n• Unidades totales en bodega: ${stats[0].totalStock} unidades\n• Valor del inventario: $${Number(stats[0].valorInventario || 0).toLocaleString()}`;
        }

        sugerencias = [
          "Estado general del inventario",
          "Productos con stock crítico",
          "Resumen por categorías"
        ];
      }

      // C. Métricas de usuarios y cuentas
      else if (cleanText.includes("usuario") || cleanText.includes("cliente") || cleanText.includes("cuentas")) {
        const [usersCount] = await db.query(
          "SELECT COUNT(*) as total, SUM(CASE WHEN id_rol = 1 THEN 1 ELSE 0 END) as admins, SUM(CASE WHEN id_rol = 2 THEN 1 ELSE 0 END) as clientes FROM usuarios"
        );
        const [recentUsers] = await db.query(
          "SELECT nombre, email, DATE_FORMAT(created_at, '%d/%m/%Y') as fecha FROM usuarios ORDER BY created_at DESC LIMIT 3"
        );
        const ultimos = recentUsers.map(u => `• ${u.nombre}\n  Correo: ${u.email} | Registro: ${u.fecha}`).join('\n\n');
        respuestaTexto = `¡Aquí tienes el resumen de nuestros usuarios registrados!\n\n• Total de cuentas: ${usersCount[0].total} usuarios\n• Administradores: ${usersCount[0].admins || 0}\n• Clientes activos: ${usersCount[0].clientes || 0}\n\nÚltimos registros en la plataforma:\n\n${ultimos}\n\n¿Deseas revisar algún otro dato?`;
        sugerencias = [
          "Estado general del inventario",
          "Productos con stock crítico",
          "Resumen por categorías"
        ];
      }

      // D. Resumen por categorías
      else if (cleanText.includes("categoria") || cleanText.includes("catalogo")) {
        const [categories] = await db.query(
          "SELECT categoria, COUNT(*) as total_items, SUM(stock) as stock_total FROM productos GROUP BY categoria"
        );
        const catList = categories.map(c => `• ${c.categoria.toUpperCase()}\n  ${c.total_items} referencias | ${c.stock_total || 0} unidades disponibles`).join('\n\n');
        respuestaTexto = `¡Así está distribuido nuestro catálogo por categorías!\n\n${catList}\n\n¿Te gustaría consultar los productos de alguna sección en particular?`;
        sugerencias = [
          "Estado general del inventario",
          "Productos con stock crítico",
          "Métricas de usuarios registrados"
        ];
      }

      // E. Estado general del inventario / Panel ejecutivo
      else {
        const [stats] = await db.query(
          "SELECT COUNT(*) as total, SUM(stock) as totalStock, SUM(stock * precio) as valorInventario FROM productos"
        );
        const [lowCount] = await db.query("SELECT COUNT(*) as low FROM productos WHERE stock <= 5");
        respuestaTexto = `¡Aquí tienes el estado general de nuestro inventario!\n\n• Total de productos: ${stats[0].total} referencias activas\n• Unidades totales en bodega: ${stats[0].totalStock} unidades\n• Valor estimado del inventario: $${Number(stats[0].valorInventario || 0).toLocaleString()}\n• Productos con stock bajo (≤5 unidades): ${lowCount[0].low} referencias\n\nTodo está funcionando de maravilla. ¿Deseas consultar algún producto en específico o ver otra categoría?`;
        sugerencias = [
          "Productos con stock crítico",
          "Resumen por categorías",
          "Métricas de usuarios registrados"
        ];
      }

      return res.json({
        respuesta: respuestaTexto,
        productos: productosRecomendados,
        sugerencias: sugerencias
      });
    }

    // ─── 1. Saludos e Identidad ────────────────────────────────────
    if (!cleanText || cleanText.includes("hola") || cleanText.includes("buenas") || cleanText.includes("saludo") || cleanText.includes("quien eres") || cleanText.includes("como te llamas") || cleanText.includes("que haces")) {
      if (esAdmin) {
        respuestaTexto = `¡Hola, querida admin!\n\nQué alegría tenerte por aquí. Estoy listo para ayudarte a revisar el stock, el inventario o cualquier métrica que quieras consultar de la tienda.\n\n¿En qué te puedo colaborar hoy?`;
        sugerencias = [
          "Estado general del inventario",
          "Productos con stock crítico",
          "Resumen por categorías",
          "Métricas de usuarios registrados"
        ];
      } else {
        const nombreUsuario = usuario?.nombre ? `, ${usuario.nombre}` : '';
        respuestaTexto = `¡Hola${nombreUsuario}! Soy Toyito, tu compañía y asesor personal en Toy Store.\n\nEstoy aquí para acompañarte en tu experiencia, recomendarte los mejores productos y resolver todas tus dudas de forma 100% privada y segura.\n\n¿En qué puedo ayudarte hoy?`;
        sugerencias = [
          "¿Qué sorpresas me recomiendas hoy?",
          "¿Cómo garantizan la discreción de mi entrega?",
          "Ideas para encender la chispa en pareja",
          "Sensaciones intensas para disfrutar a solas",
          "Los secretos más deseados de la tienda"
        ];
      }
    }

    // ─── 2. Envíos y Privacidad ────────────────────────────────────
    else if (cleanText.includes("envio") || cleanText.includes("discre") || cleanText.includes("privacidad") || cleanText.includes("paquete") || cleanText.includes("caja") || cleanText.includes("entrega") || cleanText.includes("anonimo") || cleanText.includes("seguro") || cleanText.includes("garanti")) {
      respuestaTexto = `¡Tu tranquilidad y privacidad son nuestra prioridad absoluta!\n\n- Todos nuestros envíos se despachan en cajas o sobres totalmente neutros, sin logos ni menciones a 'Toy Store'.\n- En el comprobante o extracto bancario la descripción es 100% discreta.\n- Nadie sabrá qué hay dentro de tu paquete excepto tú.`;
      sugerencias = esAdmin ? [
        "Estado general del inventario",
        "Productos con stock crítico",
        "Resumen por categorías",
        "Métricas de usuarios registrados"
      ] : [
        "¿Qué sorpresas me recomiendas hoy?",
        "Ideas para encender la chispa en pareja",
        "Sensaciones intensas para disfrutar a solas",
        "Los secretos más deseados de la tienda"
      ];
    }

    // ─── 3. Ideas para encender la chispa en pareja ───────────────
    else if (cleanText.includes("pareja") || cleanText.includes("chispa") || cleanText.includes("encender") || cleanText.includes("juntos") || cleanText.includes("complicidad")) {
      respuestaTexto = `Para encender la complicidad y vivir momentos mágicos en pareja, hemos seleccionado estas experiencias diseñadas para conectar los sentidos:`;
      const [rows] = await db.query(
        "SELECT * FROM productos WHERE LOWER(categoria) LIKE '%kit%' OR LOWER(categoria) LIKE '%accesorio%' OR LOWER(categoria) LIKE '%lence%' OR LOWER(categoria) LIKE '%cosme%' ORDER BY RAND() LIMIT 4"
      );
      productosRecomendados = rows;
      sugerencias = [
        "Sensaciones intensas para disfrutar a solas",
        "Los secretos más deseados de la tienda",
        "¿Qué sorpresas me recomiendas hoy?",
        "¿Cómo garantizan la discreción de mi entrega?"
      ];
    }

    // ─── 4. Sensaciones intensas para disfrutar a solas ───────────
    else if (cleanText.includes("solas") || cleanText.includes("intensa") || cleanText.includes("sensacion") || cleanText.includes("auto placer") || cleanText.includes("a solas")) {
      respuestaTexto = `Explorar y consentirte a solas es un arte único. Descubre estas opciones diseñadas con tecnología silenciosa y ergonómica para llevar tus sensaciones al máximo:`;
      const [rows] = await db.query(
        "SELECT * FROM productos WHERE LOWER(categoria) LIKE '%vibra%' OR LOWER(categoria) LIKE '%anal%' OR LOWER(categoria) LIKE '%pene%' ORDER BY RAND() LIMIT 4"
      );
      productosRecomendados = rows;
      sugerencias = [
        "Ideas para encender la chispa en pareja",
        "Los secretos más deseados de la tienda",
        "¿Qué sorpresas me recomiendas hoy?",
        "¿Cómo garantizan la discreción de mi entrega?"
      ];
    }

    // ─── 5. Los secretos más deseados de la tienda ─────────────────
    else if (cleanText.includes("secreto") || cleanText.includes("deseado") || cleanText.includes("mas deseados") || cleanText.includes("favorito") || cleanText.includes("popular") || cleanText.includes("mas vendido")) {
      respuestaTexto = `Te revelo los favoritos indiscutibles de nuestra comunidad: joyas sensoriales que destacan por su diseño superior y alta satisfacción:`;
      const [rows] = await db.query("SELECT * FROM productos ORDER BY precio DESC LIMIT 4");
      productosRecomendados = rows;
      sugerencias = [
        "¿Qué sorpresas me recomiendas hoy?",
        "Ideas para encender la chispa en pareja",
        "Sensaciones intensas para disfrutar a solas",
        "¿Cómo garantizan la discreción de mi entrega?"
      ];
    }

    // ─── 6. Recomendaciones generales / Sorpresas ──────────────────
    else if (cleanText.includes("recomiend") || cleanText.includes("sorpresa") || cleanText.includes("sugerencia") || cleanText.includes("ideal") || cleanText.includes("novedad") || cleanText.includes("inicio")) {
      respuestaTexto = `¡Aquí tienes algunas de nuestras mejores sorpresas preparadas para ti!\n\nCada una cuenta con materiales premium de grado médico para tu confort:`;
      const [rows] = await db.query('SELECT * FROM productos ORDER BY RAND() LIMIT 4');
      productosRecomendados = rows;
      sugerencias = [
        "Ideas para encender la chispa en pareja",
        "Sensaciones intensas para disfrutar a solas",
        "Los secretos más deseados de la tienda",
        "¿Cómo garantizan la discreción de mi entrega?"
      ];
    }

    // ─── 7. Búsqueda por Categoría: Vibradores ─────────────────────
    else if (cleanText.includes("vibra") || cleanText.includes("conejo") || cleanText.includes("bala") || cleanText.includes("succionador") || cleanText.includes("clitoris") || cleanText.includes("wand")) {
      respuestaTexto = `Nuestra colección de vibradores cuenta con tecnología de ondas de presión, silicona médica hipoalergénica y motores ultra-silenciosos:`;
      const [rows] = await db.query("SELECT * FROM productos WHERE LOWER(categoria) LIKE '%vibra%' OR LOWER(nombre) LIKE '%vibra%' LIMIT 4");
      productosRecomendados = rows;
      sugerencias = [
        "Sensaciones intensas para disfrutar a solas",
        "Los secretos más deseados de la tienda",
        "¿Cómo garantizan la discreción de mi entrega?"
      ];
    }

    // ─── 8. Búsqueda por Categoría: Lencería ──────────────────────
    else if (cleanText.includes("lence") || cleanText.includes("body") || cleanText.includes("encaje") || cleanText.includes("liguero") || cleanText.includes("seda") || cleanText.includes("disfraz") || cleanText.includes("ropa")) {
      respuestaTexto = `Nuestra línea de lencería combina elegancia y sensualidad:\n\nDiseños exclusivos para sentirte increíble:`;
      const [rows] = await db.query("SELECT * FROM productos WHERE LOWER(categoria) LIKE '%lence%' OR LOWER(nombre) LIKE '%body%' OR LOWER(nombre) LIKE '%lence%' LIMIT 4");
      productosRecomendados = rows;
      sugerencias = [
        "Ideas para encender la chispa en pareja",
        "Los secretos más deseados de la tienda",
        "¿Cómo garantizan la discreción de mi entrega?"
      ];
    }

    // ─── 9. Kits / Experiencias ───────────────────────────────────
    else if (cleanText.includes("kit") || cleanText.includes("experiencia") || cleanText.includes("bdsm") || cleanText.includes("spa") || cleanText.includes("viajero") || cleanText.includes("regalo") || cleanText.includes("caja")) {
      respuestaTexto = `Nuestras experiencias y sets seleccionados son ideales para noches especiales y descubrimientos sensoriales:`;
      const [rows] = await db.query("SELECT * FROM productos WHERE LOWER(categoria) LIKE '%kit%' OR LOWER(nombre) LIKE '%kit%' LIMIT 4");
      productosRecomendados = rows;
      sugerencias = [
        "Ideas para encender la chispa en pareja",
        "Los secretos más deseados de la tienda",
        "¿Cómo garantizan la discreción de mi entrega?"
      ];
    }

    // ─── 10. Búsqueda Libre en la Base de Datos ────────────────────
    else {
      const searchTerms = cleanText.split(" ").filter(w => w.length > 2);
      let rows = [];

      if (searchTerms.length > 0) {
        const queryTerm = `%${searchTerms[0]}%`;
        const [found] = await db.query(
          "SELECT * FROM productos WHERE LOWER(nombre) LIKE ? OR LOWER(descripcion) LIKE ? OR LOWER(categoria) LIKE ? LIMIT 4",
          [queryTerm, queryTerm, queryTerm]
        );
        rows = found;
      }

      if (rows.length > 0) {
        respuestaTexto = `Encontré estos productos relacionados con tu búsqueda:`;
        productosRecomendados = rows;
      } else {
        respuestaTexto = `No encontré un producto exacto con esa palabra, pero estaré encantado de orientarte.\n\n¿Te gustaría ver nuestras recomendaciones o consultar sobre nuestros envíos?`;
      }
    }

    if (esAdmin) {
      sugerencias = sugerencias.filter(s => s !== "¿Qué sorpresas me recomiendas hoy?" && !s.toLowerCase().includes("sorpresas"));
      if (sugerencias.length === 0) {
        sugerencias = [
          "Estado general del inventario",
          "Productos con stock crítico",
          "Resumen por categorías",
          "Métricas de usuarios registrados"
        ];
      }
    }

    res.json({
      respuesta: respuestaTexto,
      productos: productosRecomendados,
      sugerencias: sugerencias
    });

  } catch (error) {
    console.error("Error en Chatbot Controller:", error);
    res.status(500).json({
      respuesta: "Hubo un pequeño inconveniente en el sistema. ¿Podrías volver a intentarlo?",
      productos: [],
      sugerencias: [
        "¿Qué sorpresas me recomiendas hoy?",
        "¿Cómo garantizan la discreción de mi entrega?",
        "Ideas para encender la chispa en pareja",
        "Sensaciones intensas para disfrutar a solas",
        "Los secretos más deseados de la tienda"
      ]
    });
  }
};

module.exports = {
  procesarMensaje
};

