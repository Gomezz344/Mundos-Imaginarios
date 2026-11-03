const fs = require('node:fs');
const path = require('node:path');

const IMAGENES_DIR = path.join(__dirname, '..', 'imagenes');

async function generarImagen(descripcion) {
  if (!process.env.POLLINATIONS_IMAGE_URL) throw new Error('Falta POLLINATIONS_IMAGE_URL en el archivo .env.');
  const parametros = new URLSearchParams({ model: process.env.POLLINATIONS_IMAGE_MODEL || 'flux', width: '1024', height: '1024', nologo: 'true' });
  const url = `${process.env.POLLINATIONS_IMAGE_URL.replace(/\/$/, '')}/${encodeURIComponent(descripcion)}?${parametros}`;
  const headers = process.env.POLLINATIONS_API_KEY ? { Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}` } : {};
  const respuesta = await fetch(url, { headers, signal: AbortSignal.timeout(60000) });
  if (!respuesta.ok) { const error = new Error(`La API de imágenes respondió con HTTP ${respuesta.status}.`); error.status = respuesta.status; error.retryAfter = respuesta.headers.get('retry-after'); throw error; }
  const bytes = Buffer.from(await respuesta.arrayBuffer());
  if (bytes.length === 0) throw new Error('La API de imágenes devolvió bytes vacíos.');
  return bytes;
}

function guardarImagen(mundo, bytes) { fs.mkdirSync(IMAGENES_DIR, { recursive: true }); const ruta = path.join(IMAGENES_DIR, `mundo_${mundo.id}.jpg`); fs.writeFileSync(ruta, bytes); return ruta; }
module.exports = { generarImagen, guardarImagen };
