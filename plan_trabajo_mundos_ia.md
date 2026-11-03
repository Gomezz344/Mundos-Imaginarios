# Plan de trabajo --- `mundos-ia`

> Plan de implementación por fases para trabajar con Codex.\
> **Objetivo:** construir el programa de consola descrito en el taller,
> respetando sus herramientas permitidas y entendiendo cada parte antes
> de continuar.

------------------------------------------------------------------------

## 1. Objetivo del proyecto

Crear `mundos-ia`, una aplicación de consola con Node.js que:

1.  Reciba desde `process.argv` una situación, una descripción del mundo
    y cinco colores.
2.  Valide los argumentos, construya un objeto y lo guarde como JSON.
3.  Lea nuevamente el JSON desde el disco y lo envíe a una API de texto.
4.  Guarde la descripción visual generada en un archivo `.txt`.
5.  Envíe el contenido de ese `.txt` a una API de generación de
    imágenes.
6.  Guarde los bytes de la imagen como `.jpg`.
7.  Reutilice los archivos existentes para evitar llamadas y consumo
    innecesario de cuota.

El programa debe ser sencillo, modular y adecuado para explicar durante
una sustentación.

## 2. Reglas que Codex debe respetar

Estas reglas prevalecen durante todas las fases:

-   Usar únicamente JavaScript y las herramientas permitidas en el
    taller.
-   Usar Node.js **20.12 o superior**.
-   Elegir un solo sistema de módulos: CommonJS (`require` /
    `module.exports`) o ES Modules (`import` / `export`). Mantenerlo en
    todo el proyecto.
-   Usar `fs`, `path`, `process.argv`, `fetch`, `async` / `await`, `try`
    / `catch`, `AbortSignal.timeout`, `Buffer.from` y `object-hash`
    según corresponda.
-   El único paquete externo permitido es **`object-hash`**.
-   No instalar ni utilizar `axios`, `node-fetch`, SDK de proveedores
    (`openai`, `groq-sdk`, etc.), `dotenv`, `readline`, `commander`,
    `yargs`, Express, frameworks, TypeScript ni bases de datos.
-   Cargar las variables del archivo `.env` mediante
    `process.loadEnvFile`, disponible en la versión de Node requerida.
-   No escribir claves API en el código, prompts, README, capturas, logs
    ni commits.
-   No inventar datos de configuración de las APIs. Utilizar los datos
    de la opción elegida en la guía y comprobar la documentación vigente
    cuando sea necesario.
-   Mantener los nombres de archivos, funciones, campos y carpetas
    especificados en el taller.
-   Escribir comentarios breves en español que ayuden a seguir los
    pasos.
-   No avanzar a la siguiente fase hasta que la actual funcione y el
    estudiante pueda explicar lo implementado.
-   No reescribir archivos que ya funcionan ni cambiar decisiones de
    diseño sin justificarlo.
-   Si una decisión no está especificada en el taller, preguntar antes
    de introducir una herramienta o complejidad nueva.

## 3. Arquitectura esperada

``` text
mundos-ia/
├── src/
│   ├── index.js       # Coordina los pasos del programa
│   ├── mundo.js       # Valida argumentos y crea, guarda y lee el JSON
│   ├── texto.js       # Consume la API de texto
│   └── imagen.js      # Consume la API de imágenes y devuelve bytes
├── data/              # JSON generados (no se versiona)
├── descripciones/     # Descripciones .txt (no se versiona)
├── imagenes/          # Imágenes .jpg (no se versiona)
├── evidencias/        # Capturas para la entrega
├── .env               # Claves y configuración privada (no se versiona)
├── .env.example       # Variables de ejemplo, sin claves reales
├── .gitignore
├── package.json
├── README.md
└── PROMPT.md          # Registro honesto del uso de IA
```

### Responsabilidades de los módulos

  ------------------------------------------------------------------------------
  Archivo                 Responsabilidad         Funciones mínimas
  ----------------------- ----------------------- ------------------------------
  `src/index.js`          Orquestar los pasos en  `main()`
                          orden y presentar       
                          mensajes                

  `src/mundo.js`          Validar argumentos,     `crearMundo(args)`,
                          generar el objeto,      `guardarMundo(mundo)`,
                          calcular ID y manejar   `leerMundo(ruta)`
                          JSON                    

  `src/texto.js`          Solicitar y validar la  `describirMundo(mundo)`
                          descripción visual      

  `src/imagen.js`         Solicitar la imagen,    `generarImagen(descripcion)`
                          validar la respuesta y  
                          devolver sus bytes      
  ------------------------------------------------------------------------------

------------------------------------------------------------------------

## 4. Fases de implementación

## Fase 0 --- Revisar el entorno y decidir la configuración

**Objetivo:** confirmar que el equipo está listo y decidir los
proveedores antes de escribir la integración.

### Tareas

-   [ ] Comprobar `node -v` y confirmar que sea `v20.12` o superior.
-   [ ] Comprobar `npm -v` y `git --version`.
-   [ ] Revisar si ya existe una carpeta o proyecto del Taller 2 que
    deba reutilizarse.
-   [ ] Elegir CommonJS o ES Modules. Para mantener el ejemplo sencillo,
    se puede elegir CommonJS si no hay una razón para usar ES Modules.
-   [ ] Elegir proveedor de texto: Groq, NVIDIA o Pollinations.
-   [ ] Elegir proveedor de imágenes: NVIDIA FLUX.1-schnell, Cloudflare
    Workers AI o Pollinations.
-   [ ] Revisar la documentación y los límites gratuitos actuales de los
    proveedores elegidos.
-   [ ] Identificar qué variables requiere cada proveedor.

**Decisiones que deben quedar anotadas:**

-   Sistema de módulos elegido.
-   Proveedor y modelo de texto.
-   Proveedor y modelo de imágenes.
-   Variables necesarias para `.env`.

**Criterio para terminar:** el entorno está verificado y se conocen las
dos APIs que se van a consumir. No se han escrito claves reales en
archivos compartidos ni en prompts.

**Prompt para Codex:**

> Vamos a desarrollar `mundos-ia` por fases. En esta primera fase no
> escribas todavía la aplicación. Revisa el entorno y la estructura del
> proyecto, comprueba la versión de Node.js y explícame si cumple
> Node.js 20.12 o superior. No instales paquetes ni modifiques archivos
> sin pedírmelo. Recuérdame las restricciones del taller y ayúdame a
> identificar qué configuración debo decidir para las APIs de texto e
> imagen. Explica cada recomendación para un principiante.

## Fase 1 --- Crear el proyecto y su estructura

**Objetivo:** dejar preparada la base del proyecto y el control de
versiones.

### Tareas

-   [ ] Crear la carpeta `mundos-ia` si todavía no existe.
-   [ ] Inicializar Git con `git init`.
-   [ ] Inicializar npm con `npm init -y`.
-   [ ] Instalar únicamente `object-hash` con `npm i object-hash`.
-   [ ] Completar los metadatos de `package.json`: `name`, `version`,
    `description`, `main`, `keywords`, `author` y `license`.
-   [ ] Configurar el script `"start": "node src/index.js"`.
-   [ ] Crear `.gitignore` con estas entradas, una por línea:

``` gitignore
node_modules/
.env
data/
descripciones/
imagenes/
```

-   [ ] Crear `.env` local con los nombres de variables necesarios y sus
    valores privados.
-   [ ] Crear `.env.example` con los mismos nombres, pero sin claves
    reales.
-   [ ] Crear `src/index.js`, `src/mundo.js`, `src/texto.js` y
    `src/imagen.js`.
-   [ ] Crear `README.md`.
-   [ ] Confirmar que los archivos generados y `.env` estén ignorados
    por Git.
-   [ ] Realizar el primer commit con un mensaje claro.

**Importante:** las rutas de salida deben construirse desde la ubicación
del archivo fuente, no desde el directorio desde el que el usuario
ejecute el comando. En CommonJS, usar como referencia `__dirname`; en ES
Modules, usar la alternativa compatible con la versión de Node
seleccionada.

**Criterio para terminar:**

-   `npm install` termina correctamente.
-   `npm start` ejecuta `src/index.js`.
-   `object-hash` es la única dependencia externa instalada por el
    proyecto.
-   La estructura coincide con la arquitectura esperada.
-   `.env` no aparece en `git status` como archivo que se vaya a
    versionar.

**Prompt para Codex:**

> Implementemos únicamente la Fase 1 del plan. Crea la estructura de
> `mundos-ia`, configura npm, instala solo `object-hash`, completa
> `package.json`, `.gitignore`, `.env.example` y los archivos vacíos de
> `src/`. Usa el sistema de módulos que hayamos decidido y no mezcles
> CommonJS con ES Modules. No escribas todavía la lógica de las APIs.
> Antes de modificar un archivo, dime qué vas a cambiar; después
> explícame brevemente el resultado. No inventes claves. Comprueba que
> `.env`, `data/`, `descripciones/` e `imagenes/` queden ignorados por
> Git.

## Fase 2 --- Recibir argumentos y guardar el mundo en JSON

**Objetivo:** construir correctamente el objeto del mundo a partir de
los parámetros de la terminal.

### Comando esperado

``` bash
npm start -- "Una tormenta eléctrica amenaza la ciudad flotante" "Aerópolis, un archipiélago de islas que flotan sobre las nubes" rojo azul verde dorado violeta
```

Las comillas de la situación y del mundo son necesarias para que cada
texto llegue como un solo argumento.

### Tareas

-   [ ] Leer los argumentos desde `process.argv`.
-   [ ] Validar que lleguen exactamente siete argumentos de usuario:
    situación, mundo y cinco colores.
-   [ ] Rechazar argumentos vacíos o que contengan únicamente espacios.
-   [ ] Validar que los cinco colores sean distintos sin diferenciar
    mayúsculas y minúsculas.
-   [ ] Crear el objeto con los campos `id`, `situacion`, `mundo`,
    `colores` y `creadoEn`.
-   [ ] Calcular el ID usando `object-hash` sobre
    `{ situacion, mundo, colores }`.
-   [ ] Tomar los primeros ocho caracteres del hash.
-   [ ] No incluir `creadoEn` en el hash, porque cambiaría en cada
    ejecución.
-   [ ] Crear `data/` con `fs.mkdirSync(ruta, { recursive: true })` si
    no existe.
-   [ ] Guardar el JSON con `JSON.stringify(mundo, null, 2)`.
-   [ ] Exportar `crearMundo(args)`, `guardarMundo(mundo)` y
    `leerMundo(ruta)` desde `mundo.js`.
-   [ ] Mostrar errores de validación en español, con ejemplo de uso, y
    establecer `process.exitCode = 1`.

### Resultado esperado

Archivo `data/mundo_<id>.json`:

``` json
{
  "id": "3f9a1c2e",
  "situacion": "Una tormenta eléctrica amenaza la ciudad flotante",
  "mundo": "Aerópolis, un archipiélago de islas que flotan sobre las nubes",
  "colores": ["rojo", "azul", "verde", "dorado", "violeta"],
  "creadoEn": "2026-10-27T15:30:00.000Z"
}
```

La fecha del ejemplo es ilustrativa; el programa debe guardar la fecha
real en formato ISO.

### Pruebas antes de avanzar

-   [ ] Ejecutar el comando válido y comprobar que aparece el JSON.
-   [ ] Ejecutar de nuevo los mismos datos y comprobar que el ID es
    idéntico.
-   [ ] Probar con seis argumentos y con ocho argumentos.
-   [ ] Probar con situación vacía o solo espacios.
-   [ ] Probar con un color repetido usando mayúsculas y minúsculas.
-   [ ] Comprobar que todos los mensajes de validación sean
    comprensibles.

**Criterio para terminar:** el JSON contiene los cinco campos correctos,
las validaciones funcionan y los mismos datos producen siempre el mismo
ID.

**Prompt para Codex:**

> Implementemos únicamente la Fase 2. Trabaja en `mundo.js` y en los
> cambios mínimos necesarios de `index.js`. Recibe los siete argumentos
> de usuario, valida cantidad, valores vacíos y colores repetidos sin
> distinguir mayúsculas de minúsculas. Crea el objeto con `id`,
> `situacion`, `mundo`, `colores` y `creadoEn`. Calcula el ID con los
> primeros ocho caracteres de `object-hash` aplicado exclusivamente a
> `{ situacion, mundo, colores }`. Guarda el JSON en
> `data/mundo_<id>.json`. Exporta las tres funciones requeridas. No
> integres todavía ninguna API. Al terminar, dame pruebas concretas para
> verificar cada validación y explícame por qué la fecha no debe entrar
> en el hash.

## Fase 3 --- Leer el JSON y generar la descripción con la API de texto

**Objetivo:** utilizar el JSON guardado en disco para solicitar una
descripción visual.

### Tareas

-   [ ] Cargar las variables del `.env` usando `process.loadEnvFile`.
-   [ ] En `index.js`, después de guardar el JSON, volver a leerlo
    mediante `leerMundo(ruta)`.
-   [ ] No reutilizar directamente el objeto que permanece en memoria:
    el requisito es leer el archivo guardado.
-   [ ] Implementar `describirMundo(mundo)` como función `async` en
    `texto.js`.
-   [ ] Enviar el contenido del mundo mediante `JSON.stringify(mundo)`.
-   [ ] Usar `fetch` nativo con método `POST`, cabeceras y cuerpo
    adecuados al proveedor elegido.
-   [ ] Usar `AbortSignal.timeout(30000)`.
-   [ ] Comprobar `respuesta.ok` antes de intentar leer la respuesta
    como si fuera correcta.
-   [ ] Obtener el texto de la respuesta desde
    `datos.choices[0].message.content` para los proveedores compatibles
    con el formato OpenAI descrito en el taller.
-   [ ] Validar que la descripción no esté vacía.
-   [ ] Si supera 1500 caracteres, recortarla con `slice` y avisar al
    usuario.
-   [ ] Crear `descripciones/` si no existe.
-   [ ] Guardar la descripción en `descripciones/mundo_<id>.txt`.

### Instrucciones para el mensaje de sistema

La instrucción enviada al modelo debe pedir:

-   Un solo párrafo en inglés.
-   Entre 80 y 120 palabras.
-   Una descripción visual de una imagen, no un cuento.
-   Escena, elementos, iluminación, composición y estilo artístico.
-   Inclusión de los cinco colores recibidos (pueden aparecer
    traducidos).
-   Ningún título, Markdown ni texto escrito dentro de la imagen.

**Criterio para terminar:** el programa lee el JSON desde el archivo,
obtiene una descripción no vacía y la guarda en el `.txt`
correspondiente. La llamada utiliza timeout y comprueba el estado HTTP.

**Prompt para Codex:**

> Implementemos únicamente la Fase 3. Antes de programar, revisa las
> variables de entorno y la configuración del proveedor de texto que
> elegimos. Usa `process.loadEnvFile` y `fetch` nativo; no instales
> `dotenv`, SDK ni otras dependencias. Implementa
> `describirMundo(mundo)` en `texto.js`. El contenido enviado al modelo
> debe ser `JSON.stringify(mundo)` y el mensaje de sistema debe
> solicitar un solo párrafo en inglés de 80 a 120 palabras que describa
> una imagen, incluya los cinco colores y no contenga título ni texto
> dentro de la imagen. Usa `AbortSignal.timeout(30000)`, valida
> `respuesta.ok` y la respuesta vacía, aplica el límite de 1500
> caracteres y guarda el resultado en `descripciones/mundo_<id>.txt`. En
> `index.js`, vuelve a leer el JSON desde el disco antes de llamar a
> esta función. No avances a la generación de imágenes. Explícame el
> cuerpo de la petición y cómo se obtiene el texto de la respuesta.

## Fase 4 --- Generar y guardar la imagen

**Objetivo:** enviar a la API de imágenes la descripción que se guardó
en el `.txt` y escribir la imagen como archivo binario.

### Tareas

-   [ ] Leer la descripción desde `descripciones/mundo_<id>.txt`.
-   [ ] Implementar `generarImagen(descripcion)` en `imagen.js`.
-   [ ] Enviar la petición al proveedor elegido con `fetch`.
-   [ ] Usar `AbortSignal.timeout(60000)`.
-   [ ] Comprobar `respuesta.ok`.
-   [ ] Interpretar la respuesta según el proveedor:
    -   NVIDIA: revisar `datos.artifacts[0].finishReason` y obtener
        `datos.artifacts[0].base64`.
    -   Cloudflare: obtener `datos.result.image` en base64.
    -   Pollinations: obtener los bytes mediante
        `respuesta.arrayBuffer()`.
-   [ ] Convertir base64 con `Buffer.from(textoBase64, 'base64')`.
-   [ ] Para Pollinations, convertir el resultado de `arrayBuffer()` a
    `Buffer`.
-   [ ] Comprobar que los bytes no estén vacíos.
-   [ ] Si se usa NVIDIA, comprobar que `finishReason` sea `SUCCESS`.
-   [ ] Devolver los bytes desde `generarImagen(descripcion)`.
-   [ ] Crear `imagenes/` si no existe.
-   [ ] Guardar los bytes en `imagenes/mundo_<id>.jpg` con
    `fs.writeFileSync`.
-   [ ] No pasar `'utf-8'` al guardar los bytes.

**Criterio para terminar:** se genera un `.jpg` válido, el archivo se
abre en el visor de imágenes y el contenido visual corresponde
razonablemente con la descripción.

**Prompt para Codex:**

> Implementemos únicamente la Fase 4 con el proveedor de imágenes que
> elegimos. La descripción debe leerse desde el archivo `.txt`, no desde
> una variable anterior. Implementa `generarImagen(descripcion)` en
> `imagen.js`, usa `fetch` nativo y `AbortSignal.timeout(60000)`.
> Comprueba `respuesta.ok` y valida que los bytes no estén vacíos. Si el
> proveedor devuelve base64, conviértelo con
> `Buffer.from(textoBase64, 'base64')`; si devuelve bytes directamente,
> usa `arrayBuffer()` y conviértelo a `Buffer`. Si es NVIDIA, valida
> `finishReason === 'SUCCESS'`. Devuelve los bytes y guarda la imagen en
> `imagenes/mundo_<id>.jpg` sin codificación UTF-8. No cambies los
> módulos que ya funcionan salvo lo imprescindible para conectar este
> paso. Explícame la diferencia entre texto, base64 y bytes.

## Fase 5 --- Orquestación, reutilización y manejo de errores

**Objetivo:** hacer que el flujo completo sea recuperable y no consuma
cuota si los resultados ya existen.

### Flujo obligatorio

1.  Validar argumentos y crear el mundo.
2.  Guardar el JSON.
3.  Leer el JSON desde el disco.
4.  Si el `.txt` existe, leerlo; si no, llamar a la API de texto y
    guardar el resultado.
5.  Si la imagen existe, reutilizarla; si no, llamar a la API de
    imágenes y guardarla.
6.  Informar el resultado de cada paso.

### Tareas

-   [ ] Coordinar los pasos desde `async function main()` en `index.js`.
-   [ ] Utilizar `try` / `catch`.
-   [ ] Mostrar mensajes que comiencen por `Paso 1:`, `Paso 2:` y
    `Paso 3:`.
-   [ ] Usar `fs.existsSync` para comprobar si ya existe la descripción.
-   [ ] Si existe el `.txt`, leerlo y no llamar a la API de texto.
-   [ ] Usar `fs.existsSync` para comprobar si ya existe la imagen.
-   [ ] Si existe el `.jpg`, no llamar a la API de imágenes.
-   [ ] Conservar los resultados de pasos anteriores cuando un paso
    posterior falla.
-   [ ] Traducir los errores comunes a mensajes claros en español.
-   [ ] No mostrar claves API ni incluirlas en mensajes de error.

### Errores que deben reconocerse

  ---------------------------------------------------------------------------------
  Caso                    Señal                             Mensaje orientativo
  ----------------------- --------------------------------- -----------------------
  Clave inválida o sin    HTTP `401` o `403`                La API key no es
  permisos                                                  válida. Revisa tu
                                                            archivo `.env`.

  Límite de uso           HTTP `402` o `429`                Superaste el límite
                                                            gratuito. Espera un
                                                            momento.

  Modelo o URL            HTTP `404` o `410`                El modelo o la URL no
  incorrectos                                               existen. Revisa tu
                                                            configuración.

  Sin conexión o URL mal  `TypeError` de `fetch`            No se pudo conectar.
  escrita                                                   Revisa tu internet o la
                                                            URL.

  Tiempo agotado          `error.name === 'TimeoutError'`   El servicio tardó
                                                            demasiado en responder.
  ---------------------------------------------------------------------------------

Cuando exista un encabezado `retry-after`, puede informarse al usuario
cuánto debe esperar. Los errores deben manejarse sin imprimir secretos
ni respuestas que contengan credenciales.

### Pruebas obligatorias

-   [ ] Ejecutar un mundo nuevo y verificar los tres pasos.
-   [ ] Ejecutar exactamente el mismo comando y comprobar que no se
    realizan llamadas a ninguna API.
-   [ ] Borrar solo la imagen y ejecutar otra vez: debe reutilizar el
    `.txt` y generar únicamente la imagen.
-   [ ] Borrar solo la descripción y la imagen, dejando el JSON: debe
    volver a generar ambos resultados.
-   [ ] Provocar al menos tres errores de forma controlada y capturar
    sus mensajes.
-   [ ] Comprobar que, si falla la generación de imagen, el JSON y el
    `.txt` se conservan.

**Criterio para terminar:** el flujo completo funciona, reutiliza los
archivos existentes, conserva resultados parciales y explica los errores
sin exponer claves.

**Prompt para Codex:**

> Implementemos únicamente la Fase 5. Integra los módulos desde `main()`
> en `index.js` y ejecuta los tres pasos en orden. Si existe
> `descripciones/mundo_<id>.txt`, léelo y no llames a la API de texto.
> Si existe `imagenes/mundo_<id>.jpg`, no llames a la API de imágenes.
> Si un paso falla, conserva los archivos anteriores para poder
> continuar en una ejecución posterior. Maneja los errores HTTP 401,
> 403, 402, 429, 404 y 410, los errores de conexión y `TimeoutError`,
> con mensajes claros en español. Nunca imprimas claves ni cabeceras de
> autorización. No agregues librerías. Al terminar, propón pruebas para
> verificar la reutilización de cada archivo y la recuperación después
> de un fallo.

## Fase 6 --- README, metadatos y comprobación de publicación

**Objetivo:** dejar documentado el programa y realizar el experimento de
npm sin publicar realmente.

### Tareas

-   [ ] Documentar en `README.md` qué hace el programa.
-   [ ] Explicar requisitos e instalación.
-   [ ] Explicar cómo copiar `.env.example` a `.env` y completar las
    variables.
-   [ ] Documentar el comando de ejecución con comillas y doble guion.
-   [ ] Documentar la estructura de carpetas.
-   [ ] Nombrar los proveedores elegidos e incluir sus enlaces
    oficiales.
-   [ ] Completar los campos de `package.json`.
-   [ ] Ejecutar `npm publish --dry-run`.
-   [ ] Revisar que no se incluyan `.env`, `data/`, `descripciones/` ni
    `imagenes/`.
-   [ ] Renombrar temporalmente `.gitignore` a `.gitignore.off`.
-   [ ] Ejecutar de nuevo `npm publish --dry-run` y observar los
    archivos incluidos.
-   [ ] Restaurar inmediatamente el nombre `.gitignore`.
-   [ ] Explicar en el README qué ocurrió y por qué puede ser peligroso
    publicar sin reglas de exclusión.
-   [ ] Capturar ambos resultados.

**Advertencia:** ejecutar únicamente `npm publish --dry-run`. No
publicar el paquete realmente.

**Criterio para terminar:** README completo, `package.json` correcto y
evidencias de ambos experimentos.

**Prompt para Codex:**

> Implementemos únicamente la Fase 6. Completa el README y verifica los
> metadatos de `package.json` según el taller. Documenta instalación,
> configuración del `.env`, ejecución, estructura y proveedores. No
> incluyas claves reales. Después explícame cómo ejecutar y revisar
> `npm publish --dry-run`; no publiques el paquete. Ayúdame a
> interpretar el resultado con `.gitignore` y sin él, pero no renombres
> ni elimines archivos sin mi autorización. Asegúrate de que el README
> explique el riesgo de incluir archivos privados o generados.

## Fase 7 --- Documentar el uso de IA en `PROMPT.md`

**Objetivo:** registrar el proceso real de trabajo con IA, como exige el
taller.

### Contenido obligatorio

-   [ ] **A. Declaración:** indicar si se usó IA.
-   [ ] **B. Herramienta y modelo:** indicar ChatGPT, Codex u otra
    herramienta y la versión si se conoce.
-   [ ] **C. Prompt inicial completo:** copiarlo literalmente, sin
    resumir.
-   [ ] **D. Prompts siguientes:** documentar al menos los tres más
    importantes, qué respondió la IA y qué se hizo con la respuesta.
-   [ ] **E. Cambios propios:** explicar al menos tres modificaciones
    realizadas por el estudiante y por qué.
-   [ ] **F. Comprensión:** elegir una línea que al principio no se
    entendía y explicarla con palabras propias.
-   [ ] **G. Error resuelto:** registrar un error real y cómo se
    solucionó.

**Regla de honestidad:** Codex puede ayudar a redactar el registro, pero
no debe inventar prompts, respuestas, cambios, errores ni aprendizajes.
Completarlo con lo que realmente sucedió durante el desarrollo. Nunca
copiar claves API.

**Criterio para terminar:** `PROMPT.md` contiene las siete secciones
requeridas y describe el proceso real.

**Prompt para Codex:**

> Ayúdame a preparar `PROMPT.md` siguiendo exactamente los apartados A a
> G del taller. Usa únicamente el historial real de nuestro trabajo y
> los datos que yo te proporcione. No inventes prompts anteriores,
> respuestas, cambios personales, errores ni explicaciones que yo no
> haya confirmado. Deja marcadores claros donde falte información para
> que yo los complete. Revisa que no aparezcan claves ni datos secretos.

## Fase 8 --- Pruebas finales, evidencias y sustentación

**Objetivo:** comprobar los entregables y prepararse para explicar y
modificar el programa.

### Evidencias que deben quedar en `evidencias/`

-   [ ] Ejecución completa de dos mundos distintos (comando y salida).
-   [ ] JSON, descripción e imagen generados para cada mundo.
-   [ ] Segunda ejecución del mismo comando, demostrando reutilización.
-   [ ] Tres errores provocados y sus mensajes explicativos.
-   [ ] `npm publish --dry-run` con `.gitignore`.
-   [ ] `npm publish --dry-run` sin `.gitignore`, restaurando después el
    archivo.
-   [ ] Salida de `git ls-files` donde se compruebe que `.env` no está
    versionado.

### Revisión de entregables

-   [ ] Repositorio Git con al menos seis commits de mensajes claros.
-   [ ] Código fuente en `src/`.
-   [ ] `README.md`, `package.json`, `.gitignore` y `.env.example`.
-   [ ] `PROMPT.md` completo.
-   [ ] Carpeta `evidencias/` con las capturas solicitadas.
-   [ ] Dos imágenes generadas y verificadas.
-   [ ] Respuestas a las seis preguntas de reflexión dentro del README.
-   [ ] Ninguna clave aparece en código, historial de Git, capturas,
    logs, README o `PROMPT.md`.
-   [ ] El proyecto funciona después de clonar, crear `.env`, ejecutar
    `npm install` y `npm start`.

### Preguntas para preparar la sustentación

1.  ¿Por qué el ID se calcula sin la fecha? ¿Qué pasaría si la
    incluyeras?
2.  ¿Por qué se pide la descripción en inglés? ¿Qué diferencias puede
    haber al generar una imagen desde español?
3.  ¿Qué diferencia hay entre una respuesta JSON de texto y los bytes de
    una imagen? ¿Qué es base64?
4.  ¿Qué pasaría si guardaras la imagen usando `'utf-8'`?
5.  ¿Qué pasos consumen cuota y cómo evitaste repetirlos?
6.  Si usaste IA, ¿qué fue lo más difícil de pedirle y qué tuviste que
    corregir?

### Cambios pequeños que debes poder realizar

-   Cambiar la cantidad de colores de cinco a tres.
-   Agregar un campo `epoca` al JSON y hacer que llegue a la
    descripción.
-   Cambiar el estilo artístico solicitado al modelo de texto.
-   Explicar qué ocurre si cambias el nombre del modelo.
-   Explicar qué ocurre si borras la imagen generada.

**Prompt para Codex:**

> Estamos en la fase final. No agregues funcionalidades nuevas. Revisa
> el proyecto contra la lista de entregables y la rúbrica del taller.
> Señala cada requisito como cumplido, pendiente o no verificable, y
> cita el archivo o prueba que respalda tu evaluación. No marques como
> cumplido algo que no hayas comprobado. Ayúdame a preparar una
> sustentación de 5 a 10 minutos y hazme preguntas una por una para
> comprobar que entiendo el flujo. Después propón un cambio pequeño para
> que yo lo implemente y explícame solo si me quedo atascado.

------------------------------------------------------------------------

## 5. Orden recomendado de commits

El taller solicita al menos seis commits claros. Una distribución
posible es:

1.  `chore: inicializar proyecto y estructura`
2.  `feat: validar argumentos y guardar mundos en JSON`
3.  `feat: generar descripción con API de texto`
4.  `feat: generar y guardar imágenes`
5.  `feat: reutilizar resultados y manejar errores`
6.  `docs: completar README y documentación`
7.  `docs: registrar proceso de uso de IA`
8.  `test: agregar evidencias y comprobaciones finales`

Los commits deben reflejar cambios que realmente se hayan realizado. No
crear commits vacíos ni incluir `.env`.

## 6. Lista de control de seguridad

Antes de cada commit y antes de entregar:

-   [ ] Revisar `git status`.
-   [ ] Confirmar que `.env` aparece en `.gitignore`.
-   [ ] Confirmar que `.env` no está siendo rastreado por Git.
-   [ ] Revisar que no haya claves en archivos fuente, README,
    `PROMPT.md` o evidencias.
-   [ ] No pegar claves en Codex ni en ChatGPT.
-   [ ] Si una clave se expone, revocarla en el panel del proveedor y
    generar otra.
-   [ ] No guardar respuestas de error que incluyan cabeceras privadas o
    credenciales.

Comprobación sugerida:

``` bash
git ls-files
```

Si `.env` ya había sido agregado al seguimiento de Git antes de
incluirlo en `.gitignore`, ignorarlo no lo elimina automáticamente del
repositorio. En ese caso, detenerse y corregir el seguimiento antes de
continuar; no subir secretos.

## 7. Cómo trabajar con Codex sin perder el control

Para cada fase:

1.  Pega únicamente el prompt de la fase actual.
2.  Pide que Codex revise el estado antes de modificar archivos.
3.  Revisa el plan de cambios propuesto.
4.  Permite cambios solo en los archivos necesarios para esa fase.
5.  Lee las explicaciones y pregunta por cualquier línea que no
    entiendas.
6.  Ejecuta tú mismo los comandos y las pruebas.
7.  Compara el resultado con el criterio de finalización.
8.  Actualiza las evidencias y realiza un commit cuando la fase esté
    completa.
9.  Continúa solo cuando puedas explicar qué hace el código y por qué.

**Instrucción permanente para Codex:** actúa como instructor de Node.js
para un estudiante principiante. No resuelvas todo de una sola vez.
Implementa una fase por turno, explica los conceptos con ejemplos
sencillos, respeta estrictamente las herramientas permitidas y prioriza
que el estudiante comprenda y pueda sustentar su propio código.

------------------------------------------------------------------------

## 8. Definición de terminado

El proyecto se considera terminado cuando:

-   El comando recibe y valida correctamente una situación, un mundo y
    cinco colores.
-   Se crea un ID reproducible y un JSON correcto.
-   El JSON se vuelve a leer desde el disco.
-   Se genera y guarda una descripción de imagen con la API de texto.
-   La descripción guardada se utiliza para generar una imagen.
-   La imagen se guarda como bytes válidos y se puede abrir.
-   Las ejecuciones repetidas reutilizan los archivos y evitan llamadas
    innecesarias.
-   Los errores principales se explican en español y no exponen
    secretos.
-   README, `PROMPT.md`, evidencias y commits cumplen el taller.
-   El estudiante puede explicar el flujo completo y realizar un cambio
    pequeño durante la sustentación.
