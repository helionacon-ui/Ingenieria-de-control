/* Selector de aspecto: clásico o minimalista, tema y fondo oscuro.
   La elección se guarda en el navegador y vale para todas las asignaturas. */
(function () {
  'use strict';
  var D = document.documentElement;
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }

  var PIEL = { clasico: 'Clásico', min: 'Minimalista' };
  var TEMA = { auto: 'Automático', light: 'Claro', dark: 'Oscuro' };
  var FONDO = [
    ['calido', 'Cálido'], ['grafito', 'Grafito'], ['elevado', 'Elevado'],
    ['oled', 'Negro OLED'], ['pizarra', 'Pizarra']
  ];

  var estado = {
    piel: leer('apuntes-piel') === 'min' ? 'min' : 'clasico',
    tema: (function () { var t = leer('apuntes-tema'); return t === 'dark' || t === 'light' ? t : 'auto'; })(),
    fondo: (function () { var f = leer('apuntes-fondo'); return FONDO.some(function (x) { return x[0] === f; }) ? f : 'calido'; })()
  };

  function aplicar() {
    estado.piel === 'min' ? D.setAttribute('data-piel', 'min') : D.removeAttribute('data-piel');
    estado.tema === 'auto' ? D.removeAttribute('data-theme') : D.setAttribute('data-theme', estado.tema);
    D.setAttribute('data-fondo', estado.fondo);
    guardar('apuntes-piel', estado.piel === 'min' ? 'min' : null);
    guardar('apuntes-tema', estado.tema === 'auto' ? null : estado.tema);
    guardar('apuntes-fondo', estado.fondo);
    pintar();
  }

  /* ---------- armado ---------- */
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pl-b';
  btn.setAttribute('aria-label', 'Cambiar el aspecto de la guía');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>';

  var pan = document.createElement('div');
  pan.className = 'pl-p';
  pan.setAttribute('role', 'dialog');
  pan.setAttribute('aria-label', 'Aspecto de la guía');
  pan.hidden = true;

  function fila(titulo, nombre, pares, actual, cb) {
    var w = document.createElement('div');
    w.className = 'pl-f';
    var h = document.createElement('p');
    h.className = 'pl-t';
    h.textContent = titulo;
    w.appendChild(h);
    var g = document.createElement('div');
    g.className = 'pl-g';
    pares.forEach(function (par) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pl-o' + (par[0] === actual ? ' on' : '');
      b.textContent = par[1];
      b.dataset.v = par[0];
      b.setAttribute('aria-pressed', par[0] === actual ? 'true' : 'false');
      b.addEventListener('click', function () { cb(par[0]); });
      g.appendChild(b);
    });
    w.appendChild(g);
    w.dataset.k = nombre;
    return w;
  }

  function pintar() {
    pan.textContent = '';
    var tit = document.createElement('p');
    tit.className = 'pl-h';
    tit.textContent = 'Aspecto';
    pan.appendChild(tit);
    pan.appendChild(fila('Estilo', 'piel', [['clasico', PIEL.clasico], ['min', PIEL.min]], estado.piel,
      function (v) { estado.piel = v; aplicar(); }));
    pan.appendChild(fila('Tema', 'tema', [['auto', TEMA.auto], ['light', TEMA.light], ['dark', TEMA.dark]], estado.tema,
      function (v) { estado.tema = v; aplicar(); }));
    if (estado.piel === 'min') {
      pan.appendChild(fila('Fondo oscuro', 'fondo', FONDO, estado.fondo,
        function (v) { estado.fondo = v; aplicar(); }));
    }
    var n = document.createElement('p');
    n.className = 'pl-n';
    n.textContent = estado.piel === 'min'
      ? 'El fondo oscuro se ve al usar el tema oscuro. Se guarda para todas las asignaturas.'
      : 'El clásico es el de siempre. El minimalista se queda guardado para todas las asignaturas.';
    pan.appendChild(n);
  }

  function abrir(v) {
    pan.hidden = !v;
    btn.setAttribute('aria-expanded', v ? 'true' : 'false');
    if (v) { var p = pan.querySelector('.pl-o'); if (p) p.focus(); }
  }

  btn.addEventListener('click', function (e) { e.stopPropagation(); abrir(pan.hidden); });
  pan.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', function () { if (!pan.hidden) abrir(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !pan.hidden) { abrir(false); btn.focus(); }
  });

  /* Varias guías ya tienen botones flotantes abajo a la derecha:
     el selector se coloca encima del más alto, nunca sobre ellos. */
  var caja = null, vecinos = [];

  function censar() {
    vecinos = [];
    var todos = document.body.getElementsByTagName('*');
    for (var i = 0; i < todos.length; i++) {
      var el = todos[i];
      if (caja && caja.contains(el)) continue;
      var s = window.getComputedStyle(el);
      if (s.position !== 'fixed') continue;
      var r = el.getBoundingClientRect();
      if (r.width > 20 && r.width < 130 && r.right > window.innerWidth - 150) vecinos.push(el);
    }
  }

  function colocar() {
    if (!caja) return;
    var suelo = window.innerHeight, alto = suelo;
    for (var i = 0; i < vecinos.length; i++) {
      var r = vecinos[i].getBoundingClientRect();
      if (r.height > 0 && r.bottom > suelo - 260 && r.top < alto) alto = r.top;
    }
    caja.style.bottom = alto < suelo
      ? 'calc(' + Math.round(suelo - alto + 10) + 'px + env(safe-area-inset-bottom,0px))'
      : '';
  }

  function montar() {
    caja = document.createElement('div');
    caja.className = 'pl-w';
    caja.appendChild(pan);
    caja.appendChild(btn);
    document.body.appendChild(caja);
    pintar();
    D.setAttribute('data-fondo', estado.fondo);
    censar();
    colocar();
    setTimeout(function () { censar(); colocar(); }, 900);
    var t = null;
    function luego() { clearTimeout(t); t = setTimeout(colocar, 120); }
    window.addEventListener('resize', luego);
    window.addEventListener('scroll', luego, { passive: true });
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', montar)
    : montar();
})();
