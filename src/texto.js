const fs = require('node:fs');
const path = require('node:path');

const DESCRIPCIONES_DIR = path.join(__dirname, '..', 'descripciones');

async function describirMundo(mundo) {
  if (!process.env.GROQ_API_KEY) throw new Error('Falta GROQ_API_KEY en el archivo .env.');
  const respuesta = await fetch(process.env.GROQ_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL,
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'Write one paragraph in English, 80 to 120 words, describing a visual image rather than a story. Include the scene, elements, lighting, composition, artistic style, and all five received colors. Do not add a title, Markdown, or written text inside the image.' },
        { role: 'user', content: JSON.stringify(mundo) },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!respuesta.ok) throw crearErrorHttp(respuesta, 'texto');
  const datos = await respuesta.json();
  let descripcion = datos?.choices?.[0]?.message?.content?.trim();
  if (!descripcion) throw new Error('La API de texto devolvió una descripción vacía.');
  if (descripcion.length > 1500) { console.warn('Aviso: la descripción superó 1500 caracteres y fue recortada.'); descripcion = descripcion.slice(0, 1500).trim(); }
  return descripcion;
}

function guardarDescripcion(mundo, descripcion) {
  fs.mkdirSync(DESCRIPCIONES_DIR, { recursive: true });
  const ruta = path.join(DESCRIPCIONES_DIR, `mundo_${mundo.id}.txt`);
  fs.writeFileSync(ruta, descripcion, 'utf8');
  return ruta;
}
function leerDescripcion(mundo) { return fs.readFileSync(path.join(DESCRIPCIONES_DIR, `mundo_${mundo.id}.txt`), 'utf8'); }
function crearErrorHttp(respuesta, servicio) { const error = new Error(`La API de ${servicio} respondió con HTTP ${respuesta.status}.`); error.status = respuesta.status; error.retryAfter = respuesta.headers.get('retry-after'); return error; }

module.exports = { describirMundo, guardarDescripcion, leerDescripcion };
