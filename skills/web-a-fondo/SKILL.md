---
name: web-a-fondo
description: Hace una web de una sola página lista para enseñar a un cliente exigente, con diseño propio (no de plantilla), perfecta en móvil y revisada con un QA automático en 8 anchos y pantalla a pantalla en móvil antes de darla por terminada. Úsala cuando pidan una landing, una web de negocio o una página de una sola pantalla.
---

# Web a fondo

Objetivo: que el cliente abra la web en su móvil y no encuentre nada que corregir. No vale «se ve bien en mi pantalla». Vale lo que dice el QA y lo que ves en las capturas.

El trabajo tiene 7 fases. No te saltes ninguna y no anuncies que has terminado hasta pasar la última.

## Fase 1 · Entender el negocio (antes de diseñar)

Escribe para ti, en 6 líneas:
- Qué es el negocio y qué lo hace distinto de los otros 50 de su tipo.
- Quién entra en la web, desde dónde (casi siempre: un móvil, desde Instagram o Google Maps) y qué quiere saber en 5 segundos.
- La única acción que importa (reservar, encargar, comprar entrada, pedir cita) y por qué canal (WhatsApp, teléfono, formulario, enlace externo).
- El dato concreto que más vende: un número, un horario, una ubicación, un precio, un proceso.
- La idea propia de esta web: un elemento que solo tendría sentido para este negocio (la previsión de olas de una escuela de surf, el cuenta atrás de un festival, el origen de cada café). Esa idea es la pieza memorable. Una sola.
- Lo que el cliente NO querría ver.
- De dónde viene el visitante y qué pasa después. Una web es un paso de un recorrido: escribe el paso anterior (un vídeo, un anuncio, una búsqueda) y el siguiente (un mensaje, una reserva, un correo). Si el siguiente paso pide mucho (una llamada, un pago), busca uno intermedio más fácil.

Si falta información, invéntala con criterio y verosímil (precios del sector, horarios normales), y al final lista todo lo inventado para que se cambie.

## Fase 2 · Plan de diseño

Decide y escribe, antes de tocar código:
- **Paleta:** 4–6 colores con hex y su papel. Sale del mundo del negocio (materiales, lugar, producto), no de una moda.
- **Tipografía:** 1 o 2 familias, con escala y pesos. Que tengan carácter para este caso; no la que pondrías en cualquier web.
- **Composición:** cómo se ve el primer pantallazo en móvil (390×844) y en escritorio, con un boceto ASCII de cada uno.
- **La pieza memorable** de la fase 1 y cómo se ve.
- **Qué demuestra la página, no solo qué dice.** Si el negocio promete rapidez, orden o cuidado, busca una pieza que lo enseñe funcionando en la propia página (algo que el visitante toca y responde, un registro que se mueve, un resultado que se dibuja mientras elige). Una demostración vale más que tres párrafos.
- **El móvil se diseña, no se encoge.** Para cada bloque escribe cómo queda en vertical. Lo que no se adapta se reformula:
  - una secuencia en rejilla de varias columnas → una línea de tiempo vertical, en orden;
  - una tabla o matriz → un carrusel que se desliza, con indicador de posición, o una lista por grupos;
  - una columna que acompaña al hacer scroll → una barra fija abajo con lo esencial y un botón;
  - muchos botones de opción → filas que se deslizan de lado, con una opción cortada en el borde para que se note que hay más.

Compara tu plan con estos clichés de web hecha por IA. Si caes en uno sin que el negocio lo pida, cámbialo y di por qué:
- fondo crema con titular serif y acento terracota;
- negro con un único acento ácido o naranja;
- una palabra del titular en cursiva o de otro color;
- etiquetas en mayúsculas espaciadas encima de cada título;
- tarjetas idénticas con el mismo radio y la misma sombra suave;
- degradados de decoración, glow, cristal esmerilado;
- números 01 / 02 / 03 en contenido que no es una secuencia;
- flechas → pegadas a cada botón;
- textos de relleno tipo «Descubre una experiencia única».

## Fase 3 · Construir

Reglas de construcción, todas obligatorias:

**Móvil primero.** Escribe el CSS para 360 px y amplía con `min-width`. Nada de anchos fijos en px por encima de 320. Usa `clamp()` para los títulos y comprueba que la palabra más larga del titular cabe a 360 px (si no, baja el tamaño o permite `hyphens:auto` con `lang` correcto).

**Imágenes.**
- Fotos de Unsplash por URL directa `https://images.unsplash.com/photo-...?...&w=1200&q=80&auto=format&fit=crop`. Solo IDs que existan; el QA comprobará que cargan.
- Siempre `alt` descriptivo, `width`/`height` o `aspect-ratio` para que nada salte al cargar, `loading="lazy"` salvo la primera, y un color de fondo detrás por si tarda.
- Que las fotos cuenten el negocio. Si no hay foto buena, mejor una ilustración en SVG propia que una foto genérica.

**Navegación.** En móvil, o un menú que quepa entero, o uno desplegable. Nunca un menú que se corte por la derecha. Todos los enlaces y botones de al menos 44×44 px de zona táctil.

**Texto.** Letra de cuerpo de 16 px o más en móvil. Líneas de menos de 75 caracteres. Contraste AA (4,5:1; 3:1 en títulos grandes). Nada de `white-space:nowrap` en texto que pueda crecer.

**Acción principal.** Visible en el primer pantallazo del móvil y otra vez al final. Si es WhatsApp: `https://wa.me/34XXXXXXXXX?text=` con el mensaje ya escrito y codificado. Si es teléfono: `tel:`. Si es ubicación: enlace a Google Maps con la dirección codificada.

**Movimiento.** Uno bien hecho mejor que muchos. Toda animación de entrada debe dejar el contenido visible aunque el JavaScript falle y con `prefers-reduced-motion: reduce`. Nunca escondas contenido con `opacity:0` en CSS esperando a que un script lo muestre.

**Bloques que acompañan al scroll.** Si un bloque se queda fijo mientras se baja (`position: sticky`), comprueba el caso en que es más alto que la pantalla: con el contenido más largo posible, su botón tiene que seguir a la vista. Si no cabe, ánclalo por abajo o suéltalo.

**Demostraciones y formularios sin conectar.** Todo lo que sea simulado va rotulado donde se ve («datos de ejemplo», «simulación»). Un formulario que todavía no envía lo dice antes de pedir el dato, no después. Nunca muestres «Recibido» o «Enviado» si no ha pasado.

**Promesas.** No escribas cifras, plazos, plazas limitadas ni resultados que el negocio no pueda cumplir o que no salgan de un dato real. «Estimamos» cuando es una estimación. Si algo depende de mirar el caso, dilo.

**Datos de fuera.** Si una parte depende de un servicio externo (previsión, mapa, reseñas, disponibilidad), tiene que tener plan B visible: datos de ejemplo marcados como tales o un mensaje útil con la acción alternativa (por ejemplo, «pregúntanos por WhatsApp»). Nunca un hueco en blanco. Comprueba los dos casos: con el servicio respondiendo y sin él.

**Técnico.** Un único `index.html` con CSS y JS dentro. `<html lang>`, `<meta viewport>`, `<title>`, meta description, Open Graph (título, descripción, imagen) para que se vea bien al compartirla por WhatsApp, `theme-color`, favicon en SVG inline. Enlaces internos `#seccion` que existan. Cero errores en consola.

**Textos reales.** Escribe como hablaría el negocio, concreto y corto. Nada de lorem ipsum ni frases de folleto.

## Fase 4 · Pasada de simplificación

Al construir se añade de más. Antes de revisar, recorre la página bloque a bloque y pregunta de cada uno: ¿aporta valor directo, sube la expectativa o demuestra algo? Si no, fuera. Si dos bloques dicen lo mismo, queda el mejor. Si un ejemplo es tan concreto que solo se reconoce en él un tipo de negocio, cámbialo por la situación que comparten todos. Lo normal es terminar con menos secciones de las que empezaste. Repite esta pasada cada vez que añadas algo grande.

## Fase 5 · QA automático

Instala una vez las dependencias del script (`npm i` dentro de `scripts/`). Luego:

```bash
node <ruta-de-esta-skill>/scripts/qa.mjs index.html qa
```

Abre la web en Chrome a 320, 360, 375, 390, 768, 1024, 1440 y 1920 px, la recorre entera y comprueba: desplazamiento horizontal y qué lo causa, botones flotantes (WhatsApp, reservar) que tapan otro botón al hacer scroll, elementos que se pisan entre sí (texto con texto, texto con botón; texto sobre foto lo avisa para que confirmes que se lee), texto pegado al borde del móvil, imágenes rotas o sin `alt`, texto cortado, botones pequeños, letra pequeña, contraste, enlaces internos rotos, contenido que se queda invisible, errores de JavaScript, recursos que no cargan, enlaces de WhatsApp mal formados y la versión con movimiento reducido. Deja capturas completas en `qa/`.

Corrige todos los errores (✗) y vuelve a pasarlo hasta que dé 0. Los avisos (·) se corrigen salvo que haya una razón; si la hay, dila. Un error que resulte ser falso (texto animado, un bloque que se desliza a propósito) se explica en la entrega; no se esconde ni se da por bueno sin mirarlo.

Después, el móvil pantalla a pantalla:

```bash
node <ruta-de-esta-skill>/scripts/movil.mjs index.html qa-movil
```

Recorre la web a 390 y 320 px como lo haría un dedo y deja una captura por pantalla. La captura de página completa engaña: no enseña lo que aparece al hacer scroll ni lo que tapa una barra fija. Avisa de lo que se sale por los lados y de páginas demasiado largas.

## Fase 6 · Revisión a ojo

El script no ve el gusto. Mira tú las capturas `qa/movil-390-pliegue.png`, `qa/escritorio-1440.png` y todas las de `qa-movil/` en orden, y responde con honestidad:
- En el primer pantallazo del móvil, ¿se entiende qué es, dónde está y qué hacer? ¿Se ve la acción principal?
- ¿Hay huecos muertos, bloques que parecen sin terminar, alineaciones raras, fotos mal recortadas (caras cortadas, producto fuera)?
- ¿Algo se ve pequeño, apretado o pegado al borde?
- En titulares grandes, ¿las líneas se tocan o se pisan (interlineado demasiado corto para esa fuente)? Las letras con rabo (g, p, y) y los acentos no pueden chocar con la línea siguiente.
- ¿La barra de navegación del móvil ocupa una sola línea? Si se parte en dos o los enlaces quedan diminutos, usa menú desplegable.
- En escritorio a 1440 y 1920, ¿el primer pantallazo está equilibrado o hay media pantalla vacía?
- Tablas, horarios y parrillas en móvil: ¿se leen sin hacer zoom?
- En cada pantalla del móvil: ¿hay algún bloque pensado para escritorio que aquí solo se ha apilado? Una secuencia partida en dos columnas, seis tarjetas una debajo de otra, un esquema con letra diminuta. Reformúlalo (fase 2).
- ¿Alguna barra o botón fijo tapa contenido o el botón principal?
- Si la página tiene estados (opciones elegidas, formulario enviado, pestañas), mira el estado con más contenido, no solo el vacío.
- ¿La pieza memorable funciona y se entiende sin explicarla?
- Si quitaras el logo, ¿parecería la web de cualquier otro negocio? Si sí, vuelve a la fase 2.

Corrige, repite el QA y vuelve a mirar. Termina solo cuando el QA dé 0 errores y no encuentres nada en las capturas.

## Fase 7 · Segunda opinión

Quien ha hecho la web no ve sus propios fallos. Si tienes a mano otro modelo u otra persona, pásale el HTML en crudo (no tu resumen) y pídele que haga de tribunal exigente: alguien de diseño, alguien que mire el móvil y alguien que mire el negocio. Que diga si aprueba o no y, como mucho, cinco bloqueos reales con su arreglo exacto. Aplica los que tengan razón; de los que no, di por qué no. Que no aprueben a la primera es lo normal.

## Entrega

Di en pocas líneas: qué idea propia tiene la web, qué datos son inventados y dónde se cambian (número de WhatsApp, precios, dirección, horarios), y el resultado final del QA. Añade dos listas cortas: lo que has comprobado y lo que no (por ejemplo, un teléfono real), y lo que la página promete que el negocio todavía tiene que montar para que sea verdad.
