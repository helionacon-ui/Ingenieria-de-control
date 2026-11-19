/* Sugerencias de las guías.
   Cada página lleva un recuadro para anotar qué mejorar. Lo anotado se guarda en
   este navegador (no se envía a ningún sitio), se revisa en un panel con todas las
   asignaturas juntas y se copia o se descarga de una vez para pedir los cambios. */
(function () {
  'use strict';
  var CLAVE = 'apuntes-sugerencias', TOPE = 500, TOPE_TEXTO = 1200;
  var TIPOS = [
    ['fallo', 'Hay un error'],
    ['confuso', 'No se entiende'],
    ['falta', 'Falta algo'],
    ['idea', 'Idea o mejora']
  ];

  function leer() {
    try {
      var v = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function guardar(l) {
    try { localStorage.setItem(CLAVE, JSON.stringify(l.slice(-TOPE))); return true; }
    catch (e) { return false; }
  }
  function guia() {
    var t = (document.title || '').split('·');
    if (t.length >= 2) return t[t.length - 2].trim();
    var p = location.pathname.split('/').filter(Boolean);
    return p.length ? decodeURIComponent(p[0]).replace(/-/g, ' ') : 'Guía';
  }
  function pagina() {
    var f = location.pathname.split('/').pop();
    return f || 'index.html';
  }
  function titulo() { return (document.title || '').split('·')[0].trim() || pagina(); }
  function fecha(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
  }
  function etiqueta(t) {
    for (var i = 0; i < TIPOS.length; i++) if (TIPOS[i][0] === t) return TIPOS[i][1];
    return 'Sugerencia';
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- el texto que se copia o se descarga ---------- */
  function comoTexto(lista) {
    var hoy = new Date(), out = ['# Sugerencias para las guías', '',
      'Exportadas el ' + fecha(hoy.toISOString()) + ' · ' + lista.length +
      (lista.length === 1 ? ' sugerencia' : ' sugerencias'), ''];
    var porGuia = {};
    lista.forEach(function (s) { (porGuia[s.guia] = porGuia[s.guia] || []).push(s); });
    Object.keys(porGuia).sort().forEach(function (g) {
      out.push('## ' + g, '');
      var porPag = {};
      porGuia[g].forEach(function (s) { (porPag[s.titulo + ' (' + s.pagina + ')'] = porPag[s.titulo + ' (' + s.pagina + ')'] || []).push(s); });
      Object.keys(porPag).sort().forEach(function (p) {
        out.push('### ' + p);
        porPag[p].forEach(function (s) {
          out.push('- [' + etiqueta(s.tipo).toLowerCase() + '] ' + fecha(s.fecha) + ' — ' +
            String(s.texto).replace(/\s*\n\s*/g, ' / '));
        });
        out.push('');
      });
    });
    return out.join('\n');
  }

  /* ---------- estilos ---------- */
  (function () {
    if (document.getElementById('sug-css')) return;
    var s = document.createElement('style'); s.id = 'sug-css';
    s.textContent =
      '.sug{margin:40px 0 8px;border:1px solid var(--line);border-radius:16px;padding:20px 22px;background:var(--surface)}' +
      '.sug h2{font:600 clamp(19px,2.4vw,23px)/1.25 var(--display);letter-spacing:-.015em;margin:0 0 4px;color:var(--fg)}' +
      '.sug>p.sug-i{margin:0 0 14px;font-size:.82em;line-height:1.6;color:var(--muted);max-width:60ch}' +
      '.sug textarea{width:100%;box-sizing:border-box;min-height:84px;resize:vertical;font:inherit;font-size:.9em;' +
      'line-height:1.6;color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:10px 12px}' +
      '.sug textarea:focus-visible,.sug select:focus-visible,.sug button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}' +
      '.sug-f{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px}' +
      '.sug select{font:inherit;font-size:.82em;color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:8px 12px;min-height:40px}' +
      '.sug button{font:inherit;font-size:.82em;font-weight:600;color:var(--fg);background:var(--bg);border:1px solid var(--line);' +
      'border-radius:999px;padding:9px 16px;cursor:pointer;min-height:40px}' +
      '.sug button:hover{border-color:var(--accent)}' +
      '.sug button.pr{background:var(--accent);color:var(--sobre-acento,#fff);border-color:transparent}' +
      '.sug-ok{margin:10px 0 0;font-size:.82em;color:var(--accent);min-height:1.3em}' +
      '.sug-l{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:8px}' +
      '.sug-l li{font-size:.84em;line-height:1.55;background:var(--bg);border:1px solid var(--line);' +
      'border-radius:12px;padding:9px 12px}' +
      '.sug-c{display:flex;gap:9px;align-items:baseline;flex-wrap:wrap}' +
      '.sug-l .tp{flex:0 0 auto;font-size:.84em;font-weight:600;color:var(--accent)}' +
      '.sug-l .pg{flex:1 1 auto;min-width:0;color:var(--muted);font-size:.84em;overflow:hidden;' +
      'text-overflow:ellipsis;white-space:nowrap}' +
      '.sug-l .tx{margin:4px 0 0;overflow-wrap:anywhere;color:var(--fg);max-width:none}' +
      '.sug-l .fh{flex:0 0 auto;color:var(--muted);font-size:.84em;margin-left:auto}' +
      '.sug-l .qt{flex:0 0 auto;margin-left:2px;background:none;border:0;color:var(--muted);cursor:pointer;font-size:1.05em;' +
      'line-height:1;padding:2px 4px;min-height:0}' +
      '.sug-l .qt:hover{color:var(--warn,#b2482a)}' +
      '.sug-todas{margin-top:14px;border-top:1px solid var(--line);padding-top:14px}' +
      '.sug-g{margin:0 0 6px;font:600 .9em/1.4 var(--display);color:var(--fg)}' +
      '.sug-p{margin:10px 0 4px;font-size:.8em;color:var(--muted)}' +
      '.sug-vacio{margin:14px 0 0;font-size:.84em;color:var(--muted)}' +
      '.sug .sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;'+
      'clip:rect(0 0 0 0);white-space:nowrap;border:0}'+
      '@media print{.sug{display:none!important}}';
    document.head.appendChild(s);
  })();

  /* ---------- armado ---------- */
  function monta() {
    if (document.querySelector('.sug')) return;
    var destino = document.querySelector('main section.sec') || document.querySelector('main') || document.body;
    var pager = document.querySelector('main .pager');

    var sec = document.createElement('section');
    sec.className = 'sug';
    sec.setAttribute('aria-labelledby', 'sug-t');
    var opciones = TIPOS.map(function (t) { return '<option value="' + t[0] + '">' + t[1] + '</option>'; }).join('');
    sec.innerHTML =
      '<h2 id="sug-t">¿Qué mejorarías de esta página?</h2>' +
      '<p class="sug-i">Se guarda solo en este navegador: no se envía a ningún sitio. Luego puedes repasarlas todas juntas y copiarlas de una vez.</p>' +
      '<label class="sr-only" for="sug-tx">Tu sugerencia</label>' +
      '<textarea id="sug-tx" maxlength="' + TOPE_TEXTO + '" placeholder="Por ejemplo: el paso de la tabla D-H a la matriz va muy rápido, hace falta un ejemplo intermedio."></textarea>' +
      '<div class="sug-f">' +
      '<label class="sr-only" for="sug-tp">Tipo</label><select id="sug-tp">' + opciones + '</select>' +
      '<button type="button" class="pr sug-add">Guardar</button>' +
      '<button type="button" class="sug-ver"></button>' +
      '</div><p class="sug-ok" role="status"></p>' +
      '<div class="sug-aqui"></div><div class="sug-todas" hidden></div>';

    if (pager && pager.parentNode) pager.parentNode.insertBefore(sec, pager);
    else destino.parentNode ? destino.parentNode.insertBefore(sec, destino.nextSibling) : destino.appendChild(sec);

    var tx = sec.querySelector('#sug-tx'), tp = sec.querySelector('#sug-tp'),
        bAdd = sec.querySelector('.sug-add'), bVer = sec.querySelector('.sug-ver'),
        ok = sec.querySelector('.sug-ok'), aqui = sec.querySelector('.sug-aqui'),
        todas = sec.querySelector('.sug-todas');

    function avisa(m) { ok.textContent = m || ''; if (m) setTimeout(function () { if (ok.textContent === m) ok.textContent = ''; }, 4000); }

    function fila(s, conTitulo) {
      var li = document.createElement('li');
      li.className = 'sug-r';
      var cab = document.createElement('div');
      cab.className = 'sug-c';
      cab.innerHTML = '<span class="tp">' + esc(etiqueta(s.tipo)) + '</span>' +
        (conTitulo ? '<span class="pg">' + esc(s.titulo) + '</span>' : '') +
        '<span class="fh">' + fecha(s.fecha) + '</span>';
      var q = document.createElement('button');
      q.type = 'button'; q.className = 'qt'; q.textContent = '✕';
      q.setAttribute('aria-label', 'Borrar esta sugerencia');
      q.addEventListener('click', function () {
        var l = leer().filter(function (x) { return x.id !== s.id; });
        guardar(l); pinta(); avisa('Sugerencia borrada.');
      });
      cab.appendChild(q);
      var tx = document.createElement('p');
      tx.className = 'tx'; tx.textContent = s.texto;
      li.append(cab, tx);
      return li;
    }

    function pinta() {
      var l = leer(), mias = l.filter(function (s) { return s.pagina === pagina() && s.guia === guia(); });
      aqui.innerHTML = '';
      if (mias.length) {
        var h = document.createElement('p'); h.className = 'sug-p';
        h.textContent = mias.length === 1 ? 'Tu sugerencia en esta página:' : 'Tus ' + mias.length + ' sugerencias en esta página:';
        var ul = document.createElement('ul'); ul.className = 'sug-l';
        mias.slice().reverse().forEach(function (s) { ul.appendChild(fila(s)); });
        aqui.append(h, ul);
      }
      bVer.textContent = l.length ? 'Ver las ' + l.length + ' guardadas' : 'Ver las guardadas';
      bVer.disabled = !l.length;
      bVer.style.opacity = l.length ? '' : '.55';
      if (!todas.hidden) pintaTodas();
    }

    function pintaTodas() {
      var l = leer();
      todas.innerHTML = '';
      if (!l.length) { todas.innerHTML = '<p class="sug-vacio">Todavía no has guardado ninguna.</p>'; return; }
      var porGuia = {};
      l.forEach(function (s) { (porGuia[s.guia] = porGuia[s.guia] || []).push(s); });
      Object.keys(porGuia).sort().forEach(function (g) {
        var hg = document.createElement('p'); hg.className = 'sug-g';
        hg.textContent = g + ' · ' + porGuia[g].length;
        var ul = document.createElement('ul'); ul.className = 'sug-l';
        porGuia[g].slice().reverse().forEach(function (s) { ul.appendChild(fila(s, true)); });
        todas.append(hg, ul);
      });
      var pie = document.createElement('div'); pie.className = 'sug-f';
      var bCop = document.createElement('button'); bCop.type = 'button'; bCop.className = 'pr'; bCop.textContent = 'Copiar todas';
      var bDes = document.createElement('button'); bDes.type = 'button'; bDes.textContent = 'Descargar .md';
      var bVac = document.createElement('button'); bVac.type = 'button'; bVac.textContent = 'Borrar todas';
      bCop.addEventListener('click', function () {
        var t = comoTexto(leer());
        function alterno() {
          var ta = document.createElement('textarea'); ta.value = t;
          ta.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); avisa('Copiadas. Pégaselas a Claude y dile qué quieres que cambie.'); }
          catch (e) { avisa('No he podido copiarlas; usa «Descargar .md».'); }
          ta.remove();
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).then(function () {
            avisa('Copiadas. Pégaselas a Claude y dile qué quieres que cambie.');
          })['catch'](alterno);
        } else alterno();
      });
      bDes.addEventListener('click', function () {
        try {
          var b = new Blob([comoTexto(leer())], { type: 'text/markdown;charset=utf-8' });
          var a = document.createElement('a'); a.href = URL.createObjectURL(b);
          a.download = 'sugerencias.md'; document.body.appendChild(a); a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
          avisa('Descargadas.');
        } catch (e) { avisa('Este navegador no ha dejado descargar el archivo.'); }
      });
      bVac.addEventListener('click', function () {
        if (bVac.dataset.seguro !== '1') {
          bVac.dataset.seguro = '1'; bVac.textContent = '¿Seguro? Pulsa otra vez';
          setTimeout(function () { bVac.dataset.seguro = ''; bVac.textContent = 'Borrar todas'; }, 5000);
          return;
        }
        guardar([]); pinta(); avisa('Borradas todas.');
      });
      pie.append(bCop, bDes, bVac);
      todas.appendChild(pie);
    }

    bAdd.addEventListener('click', function () {
      var t = tx.value.trim();
      if (!t) { tx.focus(); avisa('Escribe primero qué mejorarías.'); return; }
      var l = leer();
      l.push({ id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
               fecha: new Date().toISOString(), guia: guia(), pagina: pagina(),
               titulo: titulo(), tipo: tp.value, texto: t.slice(0, TOPE_TEXTO) });
      if (guardar(l)) { tx.value = ''; pinta(); avisa('Guardada. Solo está en este navegador.'); }
      else avisa('No he podido guardarla: el navegador no deja escribir aquí.');
    });
    bVer.addEventListener('click', function () {
      todas.hidden = !todas.hidden;
      if (!todas.hidden) pintaTodas();
    });

    pinta();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', monta)
    : monta();
})();
