# Ingeniería de Control · Guía para aprobar

Guía interactiva de Ingeniería de Control (UPCT): Bode, Nyquist, márgenes de fase y de ganancia, PID, compensadores de adelanto y retardo, exámenes resueltos, simulacro y entrenadores.

Es una sola página estática (`index.html`), sin compilación ni dependencias locales. MathJax y las fuentes se cargan desde CDN.

## Estructura

- `index.html`: portada con el mapa de las 15 páginas.
- `empezar.html`, `pid.html`, `frecuencia.html`, `bode.html`, `nyquist.html`, `margenes.html`, `diseno.html`, `examenes.html`, `simulacro.html`, `entrena.html`, `problemas.html`, `maqueta.html`, `calculadora.html`, `consultar.html`, `recursos.html`: una página por bloque, con anterior/siguiente.
- `assets/`: estilos (`guia.css`), código de los simuladores (`guia.js`) e índice de búsqueda (`datos.js`), compartidos por todas las páginas.
- `guia-completa.html`: la guía entera en una sola página.
- `Ingenieria-de-Control-Guia.pdf`: versión en PDF.

Se publica con GitHub Pages desde la rama `gh-pages`.
