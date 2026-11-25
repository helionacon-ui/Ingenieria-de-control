// Guarda la guía para poder leerla sin conexión.
// Las páginas se piden primero a la red, así que una actualización se ve en cuanto hay cobertura.
const CACHE = 'ingenieria-de-control-v1-tip10';
const CORE = ["./", "./anim-manim.js", "./anim-temas.js", "./asig-nav.js", "./bode.html", "./calculadora.html", "./consultar.html", "./diseno.html", "./empezar.html", "./entrena.html", "./examenes.html", "./frecuencia.html", "./guia-completa.html", "./index.html", "./manifest.webmanifest", "./maqueta.html", "./margenes.html", "./nyquist.html", "./pid.html", "./piel.css?v=4", "./piel.js?v=4","./sugerencias.js?v=2", "./problemas.html", "./recursos.html", "./simulacro.html", "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(CORE.map(u => c.add(new Request(u, {mode: u.startsWith('http') ? 'no-cors' : 'same-origin'})).catch(() => {}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'saltar') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  const esPagina = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (esPagina) {
    e.respondWith(fetch(req)
      .then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req, {ignoreSearch: true}).then(h => h || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const red = fetch(req).then(r => {
      if (r && (r.ok || r.type === 'opaque')) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return r;
    }).catch(() => hit);
    return hit || red;
  }));
});
