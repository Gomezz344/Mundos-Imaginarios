const fs = require('node:fs');
const path = require('node:path');
const { crearMundo, guardarMundo, leerMundo } = require('./mundo');
const { describirMundo, guardarDescripcion, leerDescripcion } = require('./texto');
const { generarImagen, guardarImagen } = require('./imagen');

try { process.loadEnvFile(path.join(__dirname, '..', '.env')); } catch (error) { if (error.code !== 'ENOENT') console.warn('Aviso: no se pudo cargar .env automáticamente.'); }

function mensajeError(error) {
  if (error.status === 401 || error.status === 403) return 'La API key no es válida. Revisa tu archivo .env.';
  if (error.status === 402 || error.status === 429) return `Superaste el límite gratuito. Espera un momento.${error.retryAfter ? ` Reintenta en ${error.retryAfter} segundos.` : ''}`;
  if (error.status === 404 || error.status === 410) return 'El modelo o la URL no existen. Revisa tu configuración.';
  if (error.name === 'TimeoutError') return 'El servicio tardó demasiado en responder.';
  if (error.name === 'TypeError') return 'No se pudo conectar. Revisa tu internet o la URL.';
  return error.message;
}

async function main() {
  const mundo = crearMundo(process.argv.slice(2));
  const rutaJson = guardarMundo(mundo);
  const mundoGuardado = leerMundo(rutaJson);
  console.log(`Paso 1: mundo guardado en ${path.relative(process.cwd(), rutaJson)}`);
  const rutaDescripcion = path.join(__dirname, '..', 'descripciones', `mundo_${mundoGuardado.id}.txt`);
  const descripcion = fs.existsSync(rutaDescripcion) ? (console.log('Paso 2: descripción reutilizada desde el disco.'), leerDescripcion(mundoGuardado)) : (await describirMundo(mundoGuardado));
  if (!fs.existsSync(rutaDescripcion)) { guardarDescripcion(mundoGuardado, descripcion); console.log('Paso 2: descripción generada y guardada.'); }
  const rutaImagen = path.join(__dirname, '..', 'imagenes', `mundo_${mundoGuardado.id}.jpg`);
  if (fs.existsSync(rutaImagen)) console.log('Paso 3: imagen reutilizada desde el disco.');
  else { guardarImagen(mundoGuardado, await generarImagen(descripcion)); console.log('Paso 3: imagen generada y guardada.'); }
}

if (require.main === module) main().catch((error) => { console.error(`Error: ${mensajeError(error)}`); process.exitCode = 1; });
module.exports = { main, mensajeError };
