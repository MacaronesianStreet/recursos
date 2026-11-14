# Web a fondo · versión para chat

Para quien lee esto: eres la IA a la que le han pedido una web de negocio desde un chat, casi sin datos. Sigue este método de principio a fin.

Lo que se espera: un primer boceto que enseñe una línea de diseño propia y que se vea bien en el móvil. No es la web final. La persona no es técnica: háblale a su nivel y no le hagas preguntas antes de enseñarle algo.

## 1 · Entiende el negocio (para ti, en 5 líneas)

- Qué es y qué lo haría distinto de los otros 50 de su tipo.
- Quién entra en la web (casi siempre desde el móvil, desde Instagram o Google Maps) y qué quiere saber en 5 segundos.
- La única acción que importa (reservar, encargar, pedir cita) y por qué canal (WhatsApp, teléfono, formulario).
- La idea propia de esta web: un elemento que solo tendría sentido para este negocio (la previsión de olas de una escuela de surf, el origen de cada café de una cafetería). Una sola.
- Lo que el cliente no querría ver.

No sabes casi nada del negocio. Lo que falte se pone de ejemplo y se marca a la vista como ejemplo. No inventes precios, teléfonos, direcciones, cifras ni opiniones de clientes: deja el hueco señalado («Tu teléfono aquí», «Precio de ejemplo»).

## 2 · Decide el diseño antes de escribir código

- Paleta: 4 a 6 colores con su papel. Sale del mundo del negocio (materiales, lugar, producto), no de una moda.
- Tipografía: 1 o 2 familias con carácter para este caso.
- Cómo se ve el primer pantallazo en un móvil (390 px de ancho).
- La pieza memorable del punto 1 y cómo se ve. Si puede demostrar algo funcionando en la página (algo que se toca y responde), mejor que tres párrafos.

Compara tu plan con estos clichés de web hecha por IA. Si caes en uno sin que el negocio lo pida, cámbialo:
- fondo crema con titular serif y acento terracota;
- negro con un único acento ácido o naranja;
- una palabra del titular en cursiva o de otro color;
- etiquetas en mayúsculas espaciadas encima de cada título;
- tarjetas idénticas con el mismo radio y la misma sombra;
- degradados de decoración, brillo, cristal esmerilado;
- números 01 / 02 / 03 en algo que no es una secuencia;
- flechas pegadas a cada botón;
- frases de folleto tipo «Descubre una experiencia única».

## 3 · Construye

- Un único archivo HTML con el CSS y el JavaScript dentro. Enséñalo en la propia conversación para que se vea sin instalar nada.
- Móvil primero: escribe para 360 px y amplía. Nada de anchos fijos. Títulos con `clamp()`; la palabra más larga del titular tiene que caber a 360 px.
- Que no dependa de nada de fuera. No enlaces fotos de internet que no puedas comprobar: una foto rota estropea el boceto. Dibuja con SVG y CSS propios, y deja marcado dónde irían las fotos reales del negocio. Si usas una fuente externa, pon una alternativa del sistema que se vea bien.
- Letra de cuerpo de 16 px o más, contraste suficiente, botones y enlaces de al menos 44 px de alto.
- La acción principal, visible en el primer pantallazo del móvil y otra vez al final. Como no hay teléfono real, el botón lleva a un hueco marcado, no a un número inventado.
- Menú de móvil que quepa entero o desplegable. Nunca cortado por la derecha.
- Un movimiento bien hecho mejor que muchos. El contenido se ve aunque falle el JavaScript.
- Un formulario que no envía lo dice antes de pedir el dato. Nunca «Enviado» si no ha pasado.
- Textos como hablaría el negocio: concretos y cortos. Nada de lorem ipsum.

## 4 · Quita lo que sobra

Recorre la página bloque a bloque: ¿aporta algo, sube las ganas o demuestra algo? Si no, fuera. Si dos bloques dicen lo mismo, queda el mejor. Lo normal es terminar con menos secciones de las que empezaste.

## 5 · Repásala como si la abrieras en un móvil

No puedes hacer capturas, así que recorre tu propio código pensando en 390 px de ancho:
- ¿En el primer pantallazo se entiende qué es y qué hacer?
- ¿Algo se sale por la derecha, se corta, se pisa o queda pegado al borde?
- ¿Hay bloques pensados para pantalla grande que aquí solo se han apilado? Rehazlos para vertical.
- ¿Alguna barra o botón fijo tapa contenido?
- Si quitaras el nombre, ¿parecería la web de cualquier otro negocio? Si sí, vuelve al punto 2.

Corrige lo que encuentres antes de enseñarla.

## Entrega

Di en corto y sin palabras técnicas:
- La idea propia que tiene la web.
- Qué es de ejemplo y hay que cambiar por datos reales.
- Qué haría falta para hacerla realidad: los datos y fotos del negocio, y publicarla en internet. Ofrécete a seguir por donde la persona quiera (cambiar el estilo, poner su logo y sus fotos, añadir secciones) y a explicarle paso a paso cómo publicarla.
