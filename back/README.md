# 🚀 Toy Store Backend - Producción con Render & Supabase

Este proyecto ha sido migrado de MySQL a **PostgreSQL** para aprovechar **Supabase** y desplegarse en **Render**. 
Ya no necesitas XAMPP ni MySQL local. Todo está listo para la nube.

## 🗄️ 1. Configurar Supabase (Base de Datos)

1. Ve a [Supabase](https://supabase.com/) y crea un nuevo proyecto.
2. En tu panel de Supabase, ve a **SQL Editor**.
3. Copia todo el contenido del archivo `schema_postgres.sql` que se encuentra en la raíz del backend.
4. Pégalo en el SQL Editor y dale a **Run**. (Esto creará todas las tablas e insertará los productos y categorías predeterminadas).
5. Ve a **Project Settings -> Database**.
6. Busca la sección **Connection string (URI)**.
7. Copia la URI que empieza con `postgresql://postgres...` y reemplaza `[YOUR-PASSWORD]` por la contraseña que le pusiste a la base de datos. Esta será tu `DATABASE_URL`.

## ☁️ 2. Desplegar en Render (Backend)

1. Entra a [Render](https://render.com/) y crea un nuevo **Web Service**.
2. Conecta el repositorio de GitHub donde tienes el código de Toy Store.
3. En la configuración del servicio, establece:
   - **Root Directory**: `back` (IMPORTANTE, para decirle a Render que el backend está en la carpeta `back`).
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Expande la sección de **Environment Variables** y agrega las siguientes variables (usando las tuyas, por supuesto):

### Variables de Entorno (Render)

| Variable | Valor de Ejemplo | Descripción |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:xxx@aws...` | La conexión URI que obtuviste de Supabase |
| `FRONTEND_URL` | `https://toy-store-red-mu.vercel.app` | La URL de tu Vercel (Sin '/' al final) |
| `PORT` | `5000` | Puerto del servidor (Render lo puede asignar automáticamente, pero es bueno ponerlo) |
| `JWT_SECRET` | `toystore_secreto_seguro` | La misma clave JWT que usabas antes |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Tu ID de Google OAuth |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | Tu secreto de Google OAuth |
| `EMAIL_USER` | `toystorexoxo@gmail.com` | Tu correo para envío de emails |
| `EMAIL_PASSWORD` | `xxx` | La contraseña de aplicación de tu correo |
| `ADMIN_EMAILS` | `tucorreo@gmail.com` | Correos separados por comas de quienes serán administradores |
| `FAL_KEY` | `xxx` | Tu API key para el vestidor virtual |

5. Haz clic en **Create Web Service** y espera a que diga "Live".

## 🔗 3. Conectar el Frontend en Vercel

1. Ve a tu proyecto de frontend en Vercel.
2. En **Settings -> Environment Variables**, asegúrate de que la variable `VITE_BACKEND_URL` apunte a la nueva URL que te dio Render (e.g. `https://tu-backend.onrender.com`).
3. Vuelve a hacer Deploy en Vercel para que tome la nueva variable de entorno.

## 🛠️ Notas sobre el código

- Dependencia `mysql2` eliminada, instalada dependencia `pg`.
- Archivo `src/config/db.js` actualizado para usar PostgreSQL con Pool (`DATABASE_URL`).
- Todas las consultas SQL (`db.query`) actualizadas de sintaxis MySQL (`?`) a sintaxis PostgreSQL (`$1, $2, ...`).
- Generación de ids ahora utilizan `RETURNING *` o `RETURNING id_pedido` integrados de PostgreSQL nativo, sustituyendo el `insertId` nativo de MySQL.
- El servidor soporta completamente CORS dinámico adaptado a la `FRONTEND_URL` de Vercel.
