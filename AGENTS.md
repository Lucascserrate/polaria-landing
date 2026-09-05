# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Polaria — landing

Polaria es un asistente de WhatsApp para negocios que trabajan con citas. Este
repositorio es **la landing** y **las dos páginas legales** que Meta revisa para
aprobar WhatsApp Business API. Nada más.

Las páginas públicas de reserva de cada negocio y el marketplace viven en
**`polaria-explore`**, otro repositorio y otro dominio. Si estás por escribir
acá algo que le habla al cliente de una barbería en vez de al dueño del
negocio, estás en el repo equivocado.

## Estado de la landing

La landing se rehízo desde cero. La anterior —hero animado, simulador de
conversación, calculadora— se borró completa; está commiteada en la rama
`landing-vieja` del repositorio **`polaria-explore`** (commit `235efbd`), que es
donde vivía este código antes de la partida: `git checkout landing-vieja -- <ruta>`.

Lo que hay ahora es **la primera versión estructural**: estructura, ritmo y
dirección visual resueltos; copy provisional. Antes de pulir una sección hay que
tener aprobada la dirección, no al revés.

- **El copy de la landing es un borrador y vive junto en `content/landing.ts`.**
  Cuando se trabaje en serio se parte en un archivo por sección.
- **Nada de cifras de tracción inventadas.** Todavía no hay clientes y éste es
  el sitio que Meta revisa.

## Comandos

```bash
npm run dev            # desarrollo
npm run check          # typecheck + lint
npm run build
```

## Variables de entorno

Ninguna. La landing es estática: no llama a la API de Polaria ni a Mapbox, y no
tiene rutas de API propias. Si aparece una variable de entorno acá, casi seguro
lo que se está escribiendo pertenece a `polaria-explore`.

## Dirección visual

La referencia es Fresha: composición amplia, titulares enormes contra cuerpo
tranquilo, pocas cosas por sección y el producto mostrado en pantallas reales.
Lo que **no** se toma de la referencia es el color.

- **Negro, blanco y dos grises.** No hay color de marca. El único color de la
  página entra por las capturas del panel, que ya es blanco y negro.
- **El gris es jerarquía, no superficie.** Aparece en texto secundario, en
  líneas de 1px y en una sola banda de fondo (`Section tone="soft"`). Si algo se
  ve apagado, casi siempre es un gris que debería haber sido negro.
- **El negro aparece dos veces:** las cifras bajo el hero y el cierre. Usarlo en
  más lugares lo convierte en un fondo más.
- **Sin tarjetas, sin sombras, sin gradientes, sin iconos decorativos.** La
  estructura la dan el espacio y las líneas de 1px. Un bloque que necesita un
  borde para leerse suele estar mal espaciado.
- **Una sola animación:** opacidad y ocho píxeles al entrar en pantalla
  (`<Reveal>`). El estado escondido depende de la clase `js` que pone un script
  inline en `app/layout.tsx`: sin JavaScript la página se ve completa y quieta,
  nunca en blanco.
- **Ritmo vertical centralizado en `<Section>`.** Si una sección necesita otro
  aire, se cambia ahí, no con márgenes sueltos.

**Pendiente:** `app/icon.tsx` y `app/opengraph-image.tsx` son de la landing
vieja y todavía usan el azul (`#0b50e8`) y el fondo oscuro de entonces. No
contradicen nada de lo de arriba dentro de la página, pero sí en la pestaña del
navegador y en la vista previa de WhatsApp.

## Capturas de producto

Las imágenes de `public/product/` salen del panel real (`polaria/client`
corriendo con `NEXT_PUBLIC_DEMO_DATA=1`). Los archivos `*-detalle.png` son
recortes de esas tomas encuadrados a la zona con información: el panel es una
interfaz aireada y la pantalla entera, a media columna, se lee como una mancha
gris.

**Hoy `public/` está vacío**: las capturas y el script que las tomaba se
perdieron en el camino y hay que volver a generarlas. La que más falta es **la
agenda**, que es la mejor imagen posible para el hero —es la pantalla que
resume el producto—. Hoy el hero usa Analíticas.

## Mapa de rutas

`app/` está partido en dos grupos que no comparten nada más que el documento
(`app/layout.tsx`: fuente, estilos, `<body>` y el script de la clase `js`):

| Grupo             | Rutas                | Quién la lee                   |
| ----------------- | -------------------- | ------------------------------ |
| `app/(marketing)` | `/`                  | Un negocio evaluando Polaria   |
| `app/(legal)`     | `/privacy`, `/terms` | Meta, y quien busque el aviso  |

La navegación y el pie de la landing viven en `app/(marketing)/layout.tsx` y no
en el layout raíz: las legales tienen su propio encabezado —un wordmark que
vuelve al inicio— y su propio pie.

## Reglas del proyecto

- **`app/(marketing)/page.tsx` no lleva maquetación ni copy.** Sólo ordena
  secciones.
- **Todo el copy vive en `content/`.** Si estás escribiendo texto visible dentro
  de un `.tsx`, está en el lugar equivocado.
- **Server Components por defecto.** El único componente cliente es `<Reveal>`,
  y sólo porque necesita un observador.
- **Los CTA salen de `config/cta.ts`.** Hay un número real donde cualquiera
  puede probar el asistente; si cambia, se cambia ahí y en ningún otro lado.

## Antes de publicar

Buscar los `TODO` en `config/site.ts` y `content/legal.ts`: dominio, correo,
razón social y domicilio deben ser reales y verificables para la revisión de
Meta.

## Restricciones de marca (no negociables)

No usar el logotipo de WhatsApp, Meta ni Google, no imitar su interfaz al pixel
y no insinuar afiliación. El teléfono del hero evoca una conversación sin
copiar la interfaz de nadie y sin usar el verde de WhatsApp. El descargo va sí o
sí en el pie (`landing.footer.disclaimer` y `legalChrome.disclaimer`).
