# mundos-ia

Programa de consola en Node.js que recibe una situación, un mundo y cinco colores; crea un JSON identificable, genera una descripción visual y solicita una imagen. Los resultados se guardan localmente y se reutilizan para no repetir llamadas.

## Requisitos e instalación

- Node.js 20.12 o superior.
- Una clave de Groq para la descripción de texto.
- Una cuenta/clave de Pollinations si el proveedor la solicita.

```bash
npm install
copy .env.example .env
```

Completa `GROQ_API_KEY` en `.env`. No compartas ese archivo.

## Ejecución

```bash
npm start -- "Una tormenta eléctrica amenaza la ciudad flotante" "Aerópolis, un archipiélago de islas sobre las nubes" rojo azul verde dorado violeta
```

El doble guion separa las opciones de npm de los argumentos del programa.

## Proveedores

- Texto: [Groq OpenAI Compatibility](https://console.groq.com/docs/openai), usando Chat Completions.
- Imagen: [Pollinations API](https://pollinations.ai/docs), usando el endpoint configurable de imagen.

Las URLs y modelos están en `.env`; nunca se escriben claves en el código.

## Estructura

`src/` contiene la orquestación y los módulos de mundo, texto e imagen. `data/`, `descripciones/` e `imagenes/` son resultados generados y están ignoradas por Git. `evidencias/` contiene pruebas de la entrega.

## Publicación de prueba

Ejecuta únicamente `npm publish --dry-run`. Con `.gitignore`, los secretos y resultados locales no deben aparecer. Si se quita temporalmente `.gitignore`, npm puede incluir archivos privados o generados; por eso publicar sin exclusiones puede filtrar claves y aumentar innecesariamente el paquete. No se debe ejecutar `npm publish` real para este taller.

## Reflexión para la sustentación

1. El ID excluye la fecha para que los mismos datos produzcan el mismo nombre; incluirla lo cambiaría en cada ejecución.
2. El inglés suele ofrecer instrucciones visuales más compatibles con muchos modelos; traducir puede cambiar matices.
3. La respuesta JSON contiene campos de texto; una imagen son bytes. Base64 es una representación textual de esos bytes.
4. Guardar bytes con UTF-8 los transforma y puede corromper el JPG.
5. Las llamadas a texto e imagen consumen cuota; los archivos existentes se reutilizan con `fs.existsSync`.
6. Completa esta respuesta con tu experiencia real: qué fue difícil pedirle a la IA y qué corregiste.

## Verificación local

```bash
npm test
git ls-files
npm publish --dry-run
```

Las pruebas automáticas cubren validación e ID sin llamar a proveedores. Para generar archivos reales debes configurar las claves y ejecutar el comando de ejemplo.
