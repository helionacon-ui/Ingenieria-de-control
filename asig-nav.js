/* Barra superior común de las guías GIEyA: portada de la asignatura, salto a otras asignaturas y lista de temas. */
(function(){
  if(window.__asigNav) return; window.__asigNav=1;
  var HUB='https://helionacon-ui.github.io/GIEIA-UPCT/';
  var LIST=[[1, "Matemáticas I", "https://helionacon-ui.github.io/GIEIA-UPCT/matematicas-i/"], [1, "Matemáticas II", "https://helionacon-ui.github.io/GIEIA-UPCT/matematicas-ii/"], [1, "Física I", "https://helionacon-ui.github.io/GIEIA-UPCT/fisica-i/"], [1, "Física II", "https://helionacon-ui.github.io/GIEIA-UPCT/fisica-ii/"], [1, "Química general", "https://helionacon-ui.github.io/GIEIA-UPCT/quimica-general/"], [1, "Informática aplicada", "https://helionacon-ui.github.io/Inform-tica-Aplicada/"], [1, "Expresión gráfica", "https://helionacon-ui.github.io/Expresi-n-gr-fica/"], [1, "Estadística aplicada", "https://helionacon-ui.github.io/GIEIA-UPCT/estadistica-aplicada/"], [1, "Ciencia e ingeniería de materiales", "https://helionacon-ui.github.io/Ciencia-e-ingenier-a-de-materiales/"], [1, "Análisis de circuitos", "https://helionacon-ui.github.io/GIEIA-UPCT/analisis-de-circuitos/"], [2, "Matemáticas III", "https://helionacon-ui.github.io/GIEIA-UPCT/matematicas-iii/"], [2, "Fundamentos de electrónica industrial", "https://helionacon-ui.github.io/GIEIA-UPCT/electronica-industrial/"], [2, "Mecánica de máquinas", "https://helionacon-ui.github.io/GIEIA-UPCT/mecanica-de-maquinas/"], [2, "Termodinámica aplicada", "https://helionacon-ui.github.io/GIEIA-UPCT/termodinamica-aplicada/"], [2, "Resistencia de materiales", "https://helionacon-ui.github.io/GIEIA-UPCT/resistencia-de-materiales/"], [2, "Inglés técnico", "https://helionacon-ui.github.io/GIEIA-UPCT/ingles-tecnico/"], [2, "Mecánica de fluidos", "https://helionacon-ui.github.io/GIEIA-UPCT/mecanica-de-fluidos/"], [2, "Electrotecnia", "https://helionacon-ui.github.io/GIEIA-UPCT/electrotecnia/"], [2, "Diseño y simulación electrónica", "https://helionacon-ui.github.io/GIEIA-UPCT/dise-o-y-simulacion-electronica/"], [2, "Transmisión del calor", "https://helionacon-ui.github.io/GIEIA-UPCT/transmision-del-calor/"], [2, "Regulación automática", "https://helionacon-ui.github.io/GIEIA-UPCT/regulacion-automatica/"], [2, "Organización y gestión de empresas", "https://helionacon-ui.github.io/GIEIA-UPCT/organizacion-gestion-empresas/"], [3, "Control por computador", "https://helionacon-ui.github.io/Control-por-computador-GIEIA/"], [3, "Tecnología medioambiental", "https://helionacon-ui.github.io/Tecnolog-a-Medioambiental/"], [3, "Electrónica digital", "https://helionacon-ui.github.io/Electr-nica-digital/"], [3, "Modelado y simulación de sistemas", "https://helionacon-ui.github.io/Modelado-y-Simulaci-n-de-Sistemas/"], [3, "Electrónica analógica", "https://helionacon-ui.github.io/GIEIA-UPCT/electronica-analogica/"], [3, "Sistemas basados en microprocesador", "https://helionacon-ui.github.io/GIEIA-UPCT/sistemas-microprocesador/"], [3, "Programación de sistemas en tiempo real", "https://helionacon-ui.github.io/GIEIA-UPCT/programacion-tiempo-real/"], [3, "Sistemas robotizados", "https://helionacon-ui.github.io/GIEIA-UPCT/sistemas-robotizados/"], [3, "Automatización industrial", "https://helionacon-ui.github.io/GIEIA-UPCT/automatizacion-industrial/"], [3, "Ingeniería de control", "https://helionacon-ui.github.io/Ingenieria-de-control/"], [3, "Ingeniería de los sistemas de producción", "https://helionacon-ui.github.io/GIEIA-UPCT/sistemas-produccion/"]];
  var PROG={"mates1-progreso": ["Matemáticas I", "https://helionacon-ui.github.io/GIEIA-UPCT/matematicas-i/", 13], "matematicas2-progreso": ["Matemáticas II", "https://helionacon-ui.github.io/GIEIA-UPCT/matematicas-ii/", 5], "fisica1-progreso": ["Física I", "https://helionacon-ui.github.io/GIEIA-UPCT/fisica-i/", 11], "fisica2-progreso": ["Física II", "https://helionacon-ui.github.io/GIEIA-UPCT/fisica-ii/", 9], "quimica-progreso": ["Química general", "https://helionacon-ui.github.io/GIEIA-UPCT/quimica-general/", 11], "informatica-progreso": ["Informática aplicada", "https://helionacon-ui.github.io/Inform-tica-Aplicada/", 9], "eg-progreso": ["Expresión gráfica", "https://helionacon-ui.github.io/Expresi-n-gr-fica/", 14], "estadistica-progreso": ["Estadística aplicada", "https://helionacon-ui.github.io/GIEIA-UPCT/estadistica-aplicada/", 8], "materiales-progreso": ["Ciencia e ingeniería de materiales", "https://helionacon-ui.github.io/Ciencia-e-ingenier-a-de-materiales/", 16], "circuitos-progreso": ["Análisis de circuitos", "https://helionacon-ui.github.io/GIEIA-UPCT/analisis-de-circuitos/", 10], "matematicas3-progreso": ["Matemáticas III", "https://helionacon-ui.github.io/GIEIA-UPCT/matematicas-iii/", 6], "fei-progreso": ["Fundamentos de electrónica industrial", "https://helionacon-ui.github.io/GIEIA-UPCT/electronica-industrial/", 5], "mecmaq-progreso": ["Mecánica de máquinas", "https://helionacon-ui.github.io/GIEIA-UPCT/mecanica-de-maquinas/", 8], "resmat-progreso": ["Resistencia de materiales", "https://helionacon-ui.github.io/GIEIA-UPCT/resistencia-de-materiales/", 10], "ingles-tecnico-progreso": ["Inglés técnico", "https://helionacon-ui.github.io/GIEIA-UPCT/ingles-tecnico/", 10], "fluidos-progreso": ["Mecánica de fluidos", "https://helionacon-ui.github.io/GIEIA-UPCT/mecanica-de-fluidos/", 10], "electrotecnia-progreso": ["Electrotecnia", "https://helionacon-ui.github.io/GIEIA-UPCT/electrotecnia/", 8], "dse-progreso": ["Diseño y simulación electrónica", "https://helionacon-ui.github.io/GIEIA-UPCT/dise-o-y-simulacion-electronica/", 10], "transmision-calor-progreso": ["Transmisión del calor", "https://helionacon-ui.github.io/GIEIA-UPCT/transmision-del-calor/", 11], "regulacion-automatica-progreso": ["Regulación automática", "https://helionacon-ui.github.io/GIEIA-UPCT/regulacion-automatica/", 9], "oge-progreso": ["Organización y gestión de empresas", "https://helionacon-ui.github.io/GIEIA-UPCT/organizacion-gestion-empresas/", 8], "analogica-progreso": ["Electrónica analógica", "https://helionacon-ui.github.io/GIEIA-UPCT/electronica-analogica/", 8], "micro-progreso": ["Sistemas basados en microprocesador", "https://helionacon-ui.github.io/GIEIA-UPCT/sistemas-microprocesador/", 9], "pstr-progreso": ["Programación de sistemas en tiempo real", "https://helionacon-ui.github.io/GIEIA-UPCT/programacion-tiempo-real/", 10], "robotizados-progreso": ["Sistemas robotizados", "https://helionacon-ui.github.io/GIEIA-UPCT/sistemas-robotizados/", 10], "automatizacion-progreso": ["Automatización industrial", "https://helionacon-ui.github.io/GIEIA-UPCT/automatizacion-industrial/", 10], "produccion-progreso": ["Ingeniería de los sistemas de producción", "https://helionacon-ui.github.io/GIEIA-UPCT/sistemas-produccion/", 10]};

  var REL=[
    ['Matemáticas I','Matemáticas II','Matemáticas III','Estadística aplicada'],
    ['Física I','Física II','Mecánica de fluidos','Termodinámica aplicada'],
    ['Mecánica de fluidos','Termodinámica aplicada','Transmisión del calor'],
    ['Resistencia de materiales','Mecánica de máquinas','Ciencia e ingeniería de materiales'],
    ['Análisis de circuitos','Electrotecnia','Electrónica analógica','Electrónica digital','Fundamentos de electrónica industrial','Diseño y simulación electrónica'],
    ['Regulación automática','Ingeniería de control','Control por computador','Modelado y simulación de sistemas','Matemáticas III'],
    ['Sistemas basados en microprocesador','Programación de sistemas en tiempo real','Automatización industrial','Sistemas robotizados','Electrónica digital'],
    ['Organización y gestión de empresas','Ingeniería de los sistemas de producción','Expresión gráfica'],
    ['Informática aplicada','Programación de sistemas en tiempo real','Modelado y simulación de sistemas']
  ];
  var CUR={1:'Primer curso',2:'Segundo curso',3:'Tercer curso',4:'Cuarto curso'};

  function norm(u){return u.replace(/^https?:\/\//,'').replace(/index\.html$/,'').replace(/\/+$/,'').toLowerCase();}
  var here=norm(location.href.split('#')[0].split('?')[0]);
  var cur=null;
  for(var i=0;i<LIST.length;i++){var b=norm(LIST[i][2]); if(here===b||here.indexOf(b+'/')===0){cur=LIST[i];break;}}
  if(cur){try{localStorage.setItem('gieia-last',JSON.stringify({t:cur[1],u:location.href.split('#')[0],p:(document.title||'').split('·')[0].trim(),ts:Date.now()}));}catch(e){}}
  var crumbA=document.querySelector('.crumb a');
  var title=cur?cur[1]:(crumbA?crumbA.textContent.trim():document.title.split('·')[0].trim());
  if(/^(portada|inicio)$/i.test(title)){var pp=document.title.split('·');title=pp[pp.length-1].trim()||title;}
  var home=crumbA&&crumbA.getAttribute('href')?crumbA.getAttribute('href'):'index.html';
  if(cur&&!crumbA) home=cur[2];

  var css=''
  +'.an-bar{position:sticky;top:0;z-index:60;background:var(--bg,#fff);border-bottom:1px solid var(--line,#ddd);font:14px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--fg,#111)}'
  +'.an-in{max-width:1180px;margin:0 auto;padding:7px 12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}'
  +'.an-bar a,.an-bar button{font:inherit;color:inherit}'
  +'.an-hub{display:inline-flex;align-items:center;gap:11px;min-width:0;padding:0 6px 0 0;border:0;background:none;color:var(--fg,#111)!important;text-decoration:none;white-space:nowrap;flex:none}'
  +'.an-hub .an-mk{flex:none;width:40px;height:40px;border-radius:12px;background:#1f4fd1;display:grid;place-items:center}'
  +'@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .an-hub .an-mk{background:#7ea4ff}:root:not([data-theme="light"]) .an-hub .an-mk path{stroke:#0f1519}}:root[data-theme="dark"] .an-hub .an-mk{background:#7ea4ff}:root[data-theme="dark"] .an-hub .an-mk path{stroke:#0f1519}'
  +'.an-hub{--hubc:#1f4fd1}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .an-hub{--hubc:#7ea4ff}}:root[data-theme="dark"] .an-hub{--hubc:#7ea4ff}'
  +'.an-hub .an-chip{background:none!important;width:62px;height:40px}.an-hub .an-chip g[stroke]{stroke:var(--hubc,#1f4fd1)!important}.an-hub .an-chip g[stroke] path{stroke:var(--hubc,#1f4fd1)!important}.an-hub .an-chip svg{width:62px;height:38px}'
  +'.an-brand .an-mk.an-art{background:var(--surface,#fff)!important;box-shadow:inset 0 0 0 2.5px var(--accent,#1f4fd1);overflow:hidden}.an-art svg{width:36px;height:36px;display:block}.an-art svg *{vector-effect:non-scaling-stroke;stroke-width:1.7px}.an-art svg circle[fill]:not([fill=none]){stroke-width:1px}.an-art .orbit{animation:none!important}.an-hub{margin-right:6px}'
  +'.an-hub b{font-family:var(--display,"Big Shoulders Display","Arial Narrow",Impact,sans-serif);font-weight:800;font-size:25px;line-height:1;letter-spacing:.01em;text-transform:uppercase}'
  +'.an-hub b span{color:#1f4fd1}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .an-hub b span{color:#7ea4ff}}:root[data-theme="dark"] .an-hub b span{color:#7ea4ff}.an-hub:hover .an-mk{filter:brightness(1.15)}.an-hub:hover b{text-decoration:underline;text-underline-offset:5px}'
  +'.an-brand{display:inline-flex;align-items:center;gap:11px;flex:0 1 auto;margin-right:auto;min-width:0;max-width:100%;padding:0 6px 0 0;border:0;background:none;color:var(--fg,#111)!important;text-decoration:none;white-space:nowrap}'
  +'.an-brand .an-mk{flex:none;width:40px;height:40px;border-radius:12px;background:var(--accent,#1f4fd1);display:grid;place-items:center}'
  +'.an-brand b{min-width:0;overflow:hidden;text-overflow:ellipsis;font-family:var(--display,"Big Shoulders Display","Arial Narrow",Impact,sans-serif);font-weight:800;font-size:25px;line-height:1;letter-spacing:.01em;text-transform:uppercase}'
  +'.an-brand b span{color:var(--accent,#1f4fd1)}.an-brand:hover .an-mk{filter:brightness(1.15)}'
  +'.an-bar .an-hub{color:var(--fg,#111)!important}'
  +'.an-btn{cursor:pointer;padding:7px 12px;border-radius:999px;border:1px solid var(--line,#ddd);background:var(--surface,#fff);font-weight:600;font-size:13px;white-space:nowrap}'
  +'.an-btn[aria-expanded="true"]{border-color:var(--accent,#0a6);color:var(--accent,#0a6)}'
  +'.an-btn:focus-visible,.an-hub:focus-visible,.an-brand:focus-visible,.an-pn a:focus-visible{outline:3px solid var(--accent,#0a6);outline-offset:2px}'
  +'.an-pn{border-top:1px solid var(--line,#ddd);background:var(--bg,#fff);max-height:min(70vh,560px);overflow:auto;box-shadow:0 12px 24px rgba(0,0,0,.12)}'
  +'.an-pn[hidden]{display:none}'
  +'.an-pi{max-width:1180px;margin:0 auto;padding:10px 12px 14px;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:2px 14px}'
  +'.an-g{grid-column:1/-1;font:700 11px/1 ui-monospace,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--accent,#0a6);margin:12px 0 4px}'
  +'.an-pn a{display:block;padding:7px 10px;border-radius:8px;text-decoration:none;color:var(--fg,#111);font-size:14px}'
  +'.an-pn a:hover{background:var(--surface,#f3f3f3)}'
  +'.an-pn a[aria-current]{background:var(--surface,#f3f3f3);font-weight:700;color:var(--accent,#0a6)}'
  +'.an-s{grid-column:1/-1;width:100%;box-sizing:border-box;padding:9px 12px;border-radius:10px;border:1px solid var(--line,#ddd);background:var(--surface,#fff);color:var(--fg,#111);font:inherit}'
  +'.an-bar~.wrap .toc{top:56px!important;max-height:calc(100vh - 60px)}'
  +'@media (max-width:860px){.an-bar~.wrap .toc{top:50px!important;max-height:none}.an-bar .an-hub b{display:none}}@media (max-width:560px){.an-bar .an-hub .an-chip{width:44px!important;height:28px!important}.an-bar .an-hub .an-chip svg{width:44px!important;height:27px!important}.an-bar .an-hub{margin-right:2px;padding:0}.an-bar .an-brand{flex:1 1 calc(100% - 66px)!important;min-width:0!important;margin-right:0}.an-bar .an-brand b{font-size:19px;min-width:0;overflow:hidden;text-overflow:ellipsis}.an-bar .an-brand .an-mk{width:34px;height:34px}.an-bar .an-brand .an-art svg{width:30px;height:30px}.an-bar{column-gap:8px}h1{overflow-wrap:anywhere}}@media (max-width:520px){.an-brand b{font-size:20px}.an-brand .an-mk{width:34px;height:34px}.an-bar .an-hub .an-chip{width:54px;height:34px}.an-bar .an-hub .an-chip svg{width:54px;height:33px}.an-hub{margin-right:10px}.an-brand{gap:8px}}'

  +'.an-pr{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:8px;text-decoration:none;color:var(--fg,#111);font-size:14px}'
  +'.an-pr:hover{background:var(--surface,#f3f3f3)}'
  +'.an-pr b{flex:1 1 auto;min-width:0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
  +'.an-pb{flex:0 0 90px;height:7px;border-radius:99px;background:var(--line,#ddd);overflow:hidden}'
  +'.an-pb i{display:block;height:100%;background:var(--accent,#0a6)}'
  +'.an-pr span{flex:0 0 64px;text-align:right;font-variant-numeric:tabular-nums;color:var(--muted,#666);font-size:13px}'
  +'.an-tot{grid-column:1/-1;font-weight:700;padding:4px 10px 8px}'
  +'.an-reset{grid-column:1/-1;justify-self:start;margin:8px 10px 0;font:inherit;font-size:13px;padding:6px 12px;border-radius:999px;border:1px solid var(--line,#ddd);background:var(--surface,#fff);color:var(--fg,#111);cursor:pointer}'
  +'@media print{.an-bar,.totop,.toc,.hub-bar,.pager,#totop{display:none!important}.wrap{display:block!important}body{background:#fff!important;color:#000!important}a{color:#000!important;text-decoration:none!important}section,figure,table,pre,.sol,.ejer,details{break-inside:avoid}h2,h3{break-after:avoid}details>*{display:block!important}}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  function el(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;}
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}

  var bar=el('div','an-bar'); bar.setAttribute('role','navigation'); bar.setAttribute('aria-label','Navegación entre asignaturas');
  var inn=el('div','an-in');
  var MARK=null;
  var hub=el('a','an-hub','<span class="an-mk an-chip"><svg viewBox="-128 -56 256 152" width="50" height="30" aria-hidden="true"><path d="M-109.1 31.0 L-123.0 39.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M109.1 31.0 L123.0 39.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M-84.9 45.0 L-98.7 53.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M84.9 45.0 L98.7 53.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M-60.6 59.0 L-74.5 67.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M60.6 59.0 L74.5 67.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M-36.4 73.0 L-50.2 81.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M36.4 73.0 L50.2 81.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M-12.1 87.0 L-26.0 95.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><path d="M12.1 87.0 L26.0 95.0" stroke="var(--hubc,#1f4fd1)" stroke-width="4" stroke-linecap="round"/><polygon points="-121.2,14.0 0.0,84.0 0.0,100.0 -121.2,30.0" fill="color-mix(in srgb,var(--hubc,#1f4fd1) 20%,var(--surface,#fff))" stroke="var(--hubc,#1f4fd1)" stroke-width="3" stroke-linejoin="round"/><polygon points="121.2,14.0 0.0,84.0 0.0,100.0 121.2,30.0" fill="color-mix(in srgb,var(--hubc,#1f4fd1) 32%,var(--surface,#fff))" stroke="var(--hubc,#1f4fd1)" stroke-width="3" stroke-linejoin="round"/><polygon points="0.0,-56.0 121.2,14.0 0.0,84.0 -121.2,14.0" fill="var(--surface,#fff)" stroke="var(--hubc,#1f4fd1)" stroke-width="3" stroke-linejoin="round"/><polygon points="-95.3,11.0 0.0,66.0 0.0,69.0 -95.3,14.0" fill="color-mix(in srgb,var(--hubc,#1f4fd1) 32%,var(--surface,#fff))" stroke="var(--hubc,#1f4fd1)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="95.3,11.0 0.0,66.0 0.0,69.0 95.3,14.0" fill="color-mix(in srgb,var(--hubc,#1f4fd1) 32%,var(--surface,#fff))" stroke="var(--hubc,#1f4fd1)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="0.0,-44.0 95.3,11.0 0.0,66.0 -95.3,11.0" fill="color-mix(in srgb,var(--hubc,#1f4fd1) 10%,var(--surface,#fff))" stroke="var(--hubc,#1f4fd1)" stroke-width="1.5" stroke-linejoin="round"/><g transform="matrix(0.866 .5 -0.866 .5 0 11)"><g transform="scale(0.27)" fill="none" stroke="var(--hubc,#1f4fd1)" stroke-width="72" stroke-miterlimit="6"><path d="M18 191L122 64L47 -65M-18 -191L-122 -64L-47 65"/></g></g></svg></span><b>Guías para <span>aprobar</span></b>'); hub.href=HUB; hub.title='Todas las guías para aprobar'; hub.setAttribute('aria-label','Todas las guías para aprobar');
  var brand=el('a','an-brand'); brand.href=home; brand.title='Portada de '+title;
  (function(){var w=title.trim().split(/\s+/),last=w.length>1?w.pop():'',first=w.join(' ');brand.innerHTML=(MARK?'<span class="an-mk an-art">'+MARK+'</span>':'<span class="an-mk"><svg viewBox="-190 -250 380 500" width="19" height="25" aria-hidden="true"><path d="M18 191L122 64L47 -65M-18 -191L-122 -64L-47 65" fill="none" stroke="#fff" stroke-width="90" stroke-miterlimit="6"/></svg></span>')+'<b>'+esc(first)+(last?(first?' ':'')+'<span>'+esc(last)+'</span>':'')+'</b>';})();
  var bA=el('button','an-btn','Asignaturas ▾'); bA.type='button'; bA.setAttribute('aria-expanded','false');
  var bP=el('button','an-btn','Progreso'); bP.type='button'; bP.setAttribute('aria-expanded','false');
  var bI=el('button','an-btn','🖨 PDF'); bI.type='button'; bI.title='Imprimir esta página o guardarla como PDF';
  var toc=document.querySelector('nav.toc');
  var bT=null; if(toc){bT=el('button','an-btn','Temas ▾'); bT.type='button'; bT.setAttribute('aria-expanded','false');}
  inn.appendChild(hub); inn.appendChild(brand); inn.appendChild(bA); if(bT) inn.appendChild(bT); inn.appendChild(bP); inn.appendChild(bI);
  bar.appendChild(inn);

  var pA=el('div','an-pn'); pA.hidden=true; var pAi=el('div','an-pi');
  var inp=el('input','an-s'); inp.type='search'; inp.placeholder='Buscar asignatura…'; inp.setAttribute('aria-label','Buscar asignatura'); inp.autocomplete='off';
  pAi.appendChild(inp);
  if(cur){
    var relT={}; REL.forEach(function(g){ if(g.indexOf(cur[1])>-1) g.forEach(function(t){ if(t!==cur[1]) relT[t]=1; }); });
    var relN=Object.keys(relT);
    if(relN.length){
      pAi.appendChild(el('div','an-g','Relacionadas con '+esc(cur[1])));
      relN.forEach(function(t){ LIST.forEach(function(a){ if(a[1]===t){ var l=el('a',null,'↗ '+esc(t)); l.href=a[2]; pAi.appendChild(l);} }); });
      pAi.appendChild(el('div','an-g','Todas las asignaturas'));
    }
  }
  var last=0, rows=[];
  LIST.forEach(function(a){
    if(a[0]!==last){last=a[0]; var g=el('div','an-g',esc(CUR[a[0]]||('Curso '+a[0]))); g.setAttribute('data-c',a[0]); pAi.appendChild(g);}
    var l=el('a',null,esc(a[1])); l.href=a[2]; if(cur&&cur===a) l.setAttribute('aria-current','page');
    l.setAttribute('data-t',a[1].toLowerCase()); l.setAttribute('data-c',a[0]); pAi.appendChild(l); rows.push(l);
  });
  inp.addEventListener('input',function(){
    var q=inp.value.trim().toLowerCase(), vis={};
    rows.forEach(function(r){var ok=!q||r.getAttribute('data-t').indexOf(q)>-1; r.hidden=!ok; if(ok)vis[r.getAttribute('data-c')]=1;});
    [].forEach.call(pAi.querySelectorAll('.an-g'),function(g){if(g.getAttribute('data-c')===null) return; g.hidden=!vis[g.getAttribute('data-c')];});
  });
  pA.appendChild(pAi);

  var pT=null;
  if(toc){
    pT=el('div','an-pn'); pT.hidden=true; var pTi=el('div','an-pi');
    var h=el('a',null,'🏠 Portada de '+esc(title)); h.href=home; h.style.fontWeight='700'; h.style.gridColumn='1/-1'; pTi.appendChild(h);
    [].forEach.call(toc.children,function(n){
      if(n.tagName==='A'){
        if(n.getAttribute('href')===home||n.getAttribute('href')==='index.html'&&/^Portada/i.test(n.textContent.trim())) return;
        var c=el('a',null,esc(n.textContent.trim())); c.href=n.getAttribute('href');
        if(n.classList.contains('on')||n.classList.contains('cur')||n.getAttribute('aria-current')) c.setAttribute('aria-current','page');
        pTi.appendChild(c);
      }else if(n.classList&&n.classList.contains('grp')){pTi.appendChild(el('div','an-g',esc(n.textContent.trim())));}
    });
    pT.appendChild(pTi);
  }

  var pP=el('div','an-pn'); pP.hidden=true; var pPi=el('div','an-pi');
  function buildProg(){
    pPi.innerHTML=''; var done=0,total=0,rowsP=[];
    Object.keys(PROG).forEach(function(k){
      var info=PROG[k], saved={}; try{saved=JSON.parse(localStorage.getItem(k)||'{}');}catch(e){}
      var n=0; for(var id in saved){ if(saved[id]===true) n++; }
      if(n>info[2]) n=info[2];
      done+=n; total+=info[2]; rowsP.push([info,n]);
    });
    var pct=total?Math.round(100*done/total):0;
    pPi.appendChild(el('div','an-tot','Temas marcados en todas las guías: '+done+' de '+total+' ('+pct+' %)'));
    rowsP.forEach(function(r){
      var a=el('a','an-pr'); a.href=r[0][1]; var p=r[0][2]?Math.round(100*r[1]/r[0][2]):0;
      a.innerHTML='<b>'+esc(r[0][0])+'</b><span class="an-pb"><i style="width:'+p+'%"></i></span><span>'+r[1]+'/'+r[0][2]+'</span>';
      pPi.appendChild(a);
    });
    var rs=el('button','an-reset','Borrar todo mi progreso'); rs.type='button';
    rs.addEventListener('click',function(){
      if(!confirm('¿Borrar las marcas de todas las guías en este navegador?')) return;
      Object.keys(PROG).forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
      buildProg();
    });
    pPi.appendChild(rs);
  }
  pP.appendChild(pPi);
  bI.addEventListener('click',function(){closeAll(); window.print();});
  window.addEventListener('beforeprint',function(){[].forEach.call(document.querySelectorAll('details'),function(d){if(!d.open){d.setAttribute('data-an-open','1');d.open=true;}});});
  window.addEventListener('afterprint',function(){[].forEach.call(document.querySelectorAll('details[data-an-open]'),function(d){d.open=false;d.removeAttribute('data-an-open');});});

  var panels=[[bA,pA],[bT,pT],[bP,pP]].filter(function(x){return x[0]&&x[1];});
  function closeAll(except){panels.forEach(function(p){if(p[1]!==except){p[1].hidden=true;p[0].setAttribute('aria-expanded','false');}});}
  panels.forEach(function(p){
    p[0].addEventListener('click',function(e){
      e.stopPropagation(); var open=p[1].hidden; closeAll(p[1]);
      p[1].hidden=!open; p[0].setAttribute('aria-expanded',open?'true':'false');
      if(open&&p[1]===pA){setTimeout(function(){inp.focus();},30);}
      if(open&&p[1]===pP){buildProg();}
    });
    p[1].addEventListener('click',function(e){if(e.target.tagName==='A')closeAll();});
  });
  document.addEventListener('click',function(e){if(!bar.contains(e.target))closeAll();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();}});

  bar.appendChild(pA); if(pT) bar.appendChild(pT); bar.appendChild(pP);

  function mount(){
    document.body.insertBefore(bar,document.body.firstChild);
    var hb=document.querySelector('.hub-bar>a'); if(hb) hb.style.display='none';
  }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);
  /* ---- Estilo común «guía de control»: titulares condensados, portada con tarjetas por página y color propio de cada asignatura ---- */
  (function(){
    if(window.__asigSkin) return; window.__asigSkin=1;
    var lk=document.createElement('link'); lk.rel='stylesheet'; lk.href='https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800&family=JetBrains+Mono:wght@400;500&display=swap'; document.head.appendChild(lk);
    var css='@media screen{'
    +':root{--display:"Big Shoulders Display","Arial Narrow",Impact,sans-serif;--f-display:var(--display);--mono:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;--f-mono:var(--mono)}'
    +'header.hero h1,.hero h1{font-weight:800!important;text-transform:uppercase;font-size:clamp(46px,7.2vw,84px)!important;line-height:.98!important;letter-spacing:0!important}'
    +'header.hero .sub,.hero .sub{font-family:var(--display);font-size:clamp(22px,2.8vw,30px)!important;letter-spacing:.05em;text-transform:uppercase;font-weight:500}'
    +'h2{font-family:var(--display);font-weight:700;font-size:clamp(32px,4.2vw,44px);line-height:1.08;letter-spacing:.015em;text-transform:uppercase}'
    +'h3{font-family:var(--display);font-weight:600;font-size:28px;line-height:1.15;letter-spacing:.02em}'
    +'.stats b{font-family:var(--display);font-weight:800;font-size:42px;line-height:1.05}'
    +'.an-ic{max-width:1180px;margin:0 auto 36px;padding:0 max(16px,env(safe-area-inset-right,0px))}'
    +'.an-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:0 0 38px}'
    +'.an-step{display:flex;gap:14px;align-items:flex-start;background:var(--surface,#fff);border:1px solid var(--line,#ddd);border-radius:16px;padding:16px 18px;box-shadow:var(--shadow,0 6px 24px rgba(0,0,0,.06));font-size:16.5px;line-height:1.6}'
    +'.an-step i{flex:none;width:38px;height:38px;border-radius:50%;background:var(--accent,#1f4fd1);color:#fff;display:grid;place-items:center;font:800 19px/1 var(--display);font-style:normal}'
    +'.an-step p{margin:0}'
    +'.an-ic h2{font-size:clamp(28px,3.4vw,36px);padding-left:12px;border-left:5px solid var(--accent,#1f4fd1);margin:0 0 18px}'
    +'.an-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}'
    +'.an-card{position:relative;display:flex;flex-direction:column;gap:8px;background:var(--surface,#fff);border:1px solid var(--line,#ddd);border-radius:16px;padding:20px 20px 16px;box-shadow:var(--shadow,0 6px 24px rgba(0,0,0,.06));overflow:hidden;text-decoration:none;color:var(--fg,#111);transition:transform .15s,border-color .15s}'
    +'.an-card::before{content:"";position:absolute;inset:0 0 auto 0;height:6px;background:var(--k)}'
    +'.an-card:hover{transform:translateY(-2px);border-color:var(--k)}'
    +'.an-card .ac{width:48px;height:48px;border-radius:12px;background:var(--k);color:#fff;display:grid;place-items:center;font:800 20px/1 var(--display);letter-spacing:.02em}'
    +'.an-card .al{font:500 11.5px/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#666)}'
    +'.an-card .at{font-family:var(--display);font-weight:700;font-size:24px;line-height:1.12;text-transform:uppercase;letter-spacing:.015em}'
    +'.an-card .ag{margin-top:auto;padding-top:6px;font:500 13px var(--mono);color:var(--k);letter-spacing:.03em}'
    +'@media (max-width:820px){.an-steps{grid-template-columns:minmax(0,1fr)}}'
    +'@media (prefers-reduced-motion:reduce){.an-card{transition:none}}'
    +'}@media print{.an-ic{display:none!important}}';
    var st=document.createElement('style'); st.id='an-skin'; st.textContent=css; document.head.appendChild(st);

    function cards(){
      var hero=document.querySelector('header.hero,.hero'); if(!hero||document.querySelector('.an-ic')) return;
      var nav=document.querySelector('nav.toc,nav.side,#side'); if(!nav) return;
      var host=nav.closest('.wrap,.shell,.layout'); if(!host||!host.parentNode) return;
      var items=[],seen={},grp='';
      [].forEach.call(nav.querySelectorAll('.grp,h5,a[href]'),function(n){
        if(n.tagName!=='A'){grp=n.textContent.trim(); return;}
        var h=n.getAttribute('href')||''; if(!h||h.indexOf('#')>-1||/^https?:/.test(h)||/^(index\.html)?$/.test(h)) return;
        if(seen[h]) return; seen[h]=1;
        var t=n.textContent.replace(/\s+/g,' ').replace(/^[\s\u2013\u2014\-\u2022\u00b7]+/,'').trim(); if(!t||/^Portada/i.test(t)) return;
        items.push({h:h,t:t,g:grp});
      });
      if(items.length<6) return;
      function col(g){ if(/empezar|consultar/i.test(g)) return 'var(--fg,#18232b)'; if(/practicar|examen/i.test(g)) return 'color-mix(in srgb,var(--accent,#1f4fd1) 62%,#000)'; return 'var(--accent,#1f4fd1)'; }
      var sec=el('section','an-ic');
      var steps=el('div','an-steps');
      [['Elige un tema de la lista o empieza por <b>«desde cero»</b> si partes de cero.'],['Sigue los temas en orden: <b>teoría, simuladores y vídeos</b>. Marca cada tema al terminarlo.'],['Practica con los <b>problemas y exámenes resueltos</b> antes de presentarte.']].forEach(function(s,i){
        steps.appendChild(el('div','an-step','<i>'+(i+1)+'</i><p>'+s[0]+'</p>'));
      });
      sec.appendChild(steps);
      sec.appendChild(el('h2',null,'Las '+items.length+' páginas de la guía'));
      var grid=el('div','an-cards');
      items.forEach(function(it){
        var m=it.t.match(/^(?:T|Tema\s*)(\d+)(?:\s*[\u2013\u2014-]\s*T?(\d+))?\b[\s.:·-]*(.*)$/i), code,title,lab=it.g||'Guía';
        if(m){code='T'+m[1]; title=m[3]||it.t; lab=(it.g?it.g+' · ':'')+(m[2]?'Temas '+m[1]+'–'+m[2]:'Tema '+m[1]);}
        else{title=it.t; var w=title.replace(/\b(de|del|la|las|los|y|e|en|el|a|para|por|con)\b/gi,'').split(/\s+/).filter(Boolean); code=((w[0]||'')[0]||'')+((w[1]||'')[0]||''); code=code.toUpperCase()||'·';}
        var a=el('a','an-card','<span class="ac">'+esc(code)+'</span><span class="al">'+esc(lab)+'</span><span class="at">'+esc(title)+'</span><span class="ag">Abrir →</span>');
        a.href=it.h; a.style.setProperty('--k',col(it.g)); grid.appendChild(a);
      });
      sec.appendChild(grid);
      host.parentNode.insertBefore(sec,host);
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',cards); else cards();
  })();
  /* ===== Fondo propio de cada asignatura ===== */
  (function(){
    if(document.getElementById('an-bg')) return;
    var S='fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
    function tx(x,y,s,t,r){return '<text x="'+x+'" y="'+y+'" font-size="'+s+'" font-family="Georgia,serif" fill="#000" stroke="none"'+(r?' transform="rotate('+r+' '+x+' '+y+')"':'')+'>'+t+'</text>';}
    function mo(x,y,s,t,r){return tx(x,y,s,t,r).replace('Georgia,serif','monospace');}
    function p(d){return '<path d="'+d+'"/>';}
    function c(x,y,r,f){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'"'+(f?' fill="#000"':'')+'/>';}
    function r(x,y,w,h,k){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(k||0)+'"/>';}
    function hex(cx,cy,R){var a=[];for(var i=0;i<6;i++)a.push((cx+R*Math.cos(Math.PI/3*i+Math.PI/6)).toFixed(1)+','+(cy+R*Math.sin(Math.PI/3*i+Math.PI/6)).toFixed(1));return '<polygon points="'+a.join(' ')+'"/>';}
    function gear(cx,cy,R,n,d){var a=[];for(var i=0;i<n;i++){var b=2*Math.PI*i/n,w=Math.PI/n;[[-.5,R],[-.28,R+d],[.28,R+d],[.5,R]].forEach(function(q){a.push((cx+q[1]*Math.cos(b+q[0]*w)).toFixed(1)+','+(cy+q[1]*Math.sin(b+q[0]*w)).toFixed(1));});}return '<polygon points="'+a.join(' ')+'"/>'+c(cx,cy,R*.35);}
    function arrow(x1,y1,x2,y2){var a=Math.atan2(y2-y1,x2-x1),L=9;return p('M'+x1+' '+y1+'L'+x2+' '+y2+'M'+x2+' '+y2+'L'+(x2-L*Math.cos(a-.5)).toFixed(1)+' '+(y2-L*Math.sin(a-.5)).toFixed(1)+'M'+x2+' '+y2+'L'+(x2-L*Math.cos(a+.5)).toFixed(1)+' '+(y2-L*Math.sin(a+.5)).toFixed(1));}
    function sine(x0,y0,A,L,ph,n){var d='';for(var i=0;i<=n;i++){var x=x0+L*i/n,y=y0-A*Math.sin(2*Math.PI*i/n+ph);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);}return p(d);}
    var M=[
     [/matematicas i$/,function(){return tx(14,70,64,'∫')+tx(120,60,50,'∑')+tx(30,170,46,'π')+tx(130,170,56,'∞')+tx(88,118,26,'√x')+tx(160,108,20,'dx');}],
     [/matematicas ii$/,function(){return p('M20 30h-10v60h10M80 30h10v60h-10')+tx(30,66,20,'1 0')+tx(30,84,20,'0 1')+arrow(130,40,190,70)+arrow(130,40,170,10)+tx(20,170,22,'A·v = λ·v')+tx(130,130,22,'det')+p('M120 190h70v-30');}],
     [/fisica i$/,function(){return p('M10 200Q110 -40 210 200')+c(60,128,6,1)+c(110,102,6,1)+c(160,128,6,1)+arrow(110,102,150,102)+arrow(110,102,110,60)+p('M20 30l60 20-60 20z');}],
     [/fisica ii$/,function(){var o='';for(var i=1;i<4;i++)o+=p('M110 110m-'+i*22+' 0a'+i*22+' '+i*22+' 0 1 0 '+i*44+' 0');return o+tx(100,118,26,'+')+tx(176,40,22,'−')+sine(10,196,10,200,0,24);}],
     [/quimica/,function(){return hex(70,70,34)+c(70,70,18)+hex(130,106,34)+hex(70,142,34)+p('M164 106h30M44 160l-26 18')+tx(190,112,18,'OH');}],
     [/informatica/,function(){return mo(12,56,40,'{ }')+mo(110,50,26,'&lt;/&gt;')+mo(20,120,30,'01')+mo(100,126,34,'=&gt;')+mo(20,190,28,'#;')+mo(124,190,24,'0x1F');}],
     [/expresion grafica/,function(){return p('M110 20l60 34v68l-60 34-60-34V54z M50 54l60 34 60-34 M110 88v68')+p('M20 190h120')+arrow(20,190,30,190)+arrow(140,190,130,190)+p('M20 182v16M140 182v16')+p('M160 170l30-30M170 180l30-30M180 190l30-30');}],
     [/estadistica/,function(){return p('M10 150C60 150 70 30 110 30s50 120 100 120')+p('M10 150h200')+r(30,128,16,22)+r(52,104,16,46)+r(150,110,16,40)+r(172,132,16,18)+c(110,30,5,1)+tx(30,200,18,'σ μ');}],
     [/ciencia e ingenieria de materiales/,function(){return r(30,30,70,70)+r(60,60,70,70)+p('M30 30l30 30M100 30l30 30M30 100l30 30M100 100l30 30')+c(30,30,5,1)+c(130,60,5,1)+c(60,130,5,1)+c(130,130,5,1)+p('M150 150l50 20-20 40')+c(150,150,5,1);}],
     [/analisis de circuitos/,function(){return p('M10 60h40l8-16 12 32 12-32 12 32 8-16h40')+c(10,60,5,1)+c(150,60,5,1)+p('M150 60v50M130 110h40M130 122h40M150 122v40')+tx(14,170,26,'KCL')+tx(100,200,20,'Σi=0');}],
     [/matematicas iii/,function(){return sine(10,60,24,200,0,28)+sine(10,110,16,200,1.2,28)+tx(14,176,34,'∇²')+tx(100,190,28,'e^iθ')+tx(160,150,30,'ℂ');}],
     [/electronica industrial/,function(){return p('M10 60h40')+p('M50 40v40l36-20z')+p('M86 40v40')+p('M86 60h30')+sine(120,150,30,90,0,16).replace('<path','<path stroke-dasharray="4 5"')+p('M10 150h40a30 30 0 0 1 60 0h30')+tx(14,200,22,'AC→DC');}],
     [/mecanica de maquinas/,function(){return gear(70,70,34,12,10)+gear(150,126,22,9,8)+gear(60,170,18,8,7);}],
     [/termodinamica/,function(){return p('M20 20v170h170')+p('M60 60C100 40 140 70 150 90C140 130 100 150 60 130C50 100 50 80 60 60')+arrow(90,56,110,60)+arrow(150,100,146,118)+tx(160,32,22,'P')+tx(176,210,22,'V');}],
     [/resistencia de materiales/,function(){return r(20,90,170,16)+p('M20 106l-14 26h28zM190 106l-14 26h28z')+arrow(70,40,70,88)+arrow(110,40,110,88)+arrow(150,40,150,88)+p('M20 170Q105 200 190 170')+tx(86,214,18,'σ = F/A');}],
     [/ingles tecnico/,function(){return tx(14,60,56,'Aa')+tx(110,50,28,'the')+tx(20,130,52,'“ ”')+tx(110,120,26,'to be')+r(120,150,80,40,12)+p('M140 190l-10 18 24-18')+tx(134,176,16,'EN');}],
     [/mecanica de fluidos/,function(){return c(110,110,20)+p('M10 70Q80 50 110 60T210 70M10 100Q70 90 90 110T10 130M210 100Q150 90 130 110T210 130M10 160Q80 180 110 160T210 160')+p('M170 30c-8 14-14 22 0 28s14-14 0-28z')+p('M40 186c-6 11-10 18 0 22s10-11 0-22z');}],
     [/electrotecnia/,function(){return sine(10,50,22,200,0,28)+sine(10,110,22,200,2.09,28)+sine(10,170,22,200,4.19,28)+tx(14,210,18,'3~ 400 V');}],
     [/diseno y simulacion electronica/,function(){return p('M10 40h70l30 30h100M10 110h50l30-30M60 110v70l30 30M200 40v50l-30 30h-60')+c(10,40,6)+c(210,70,6)+c(10,110,6)+c(90,80,6)+c(110,70,5,1)+c(170,120,6)+tx(130,196,18,'PCB');}],
     [/transmision del calor/,function(){return p('M30 20q-14 20 0 40t0 40t0 40')+p('M80 20q-14 20 0 40t0 40t0 40')+p('M130 20q-14 20 0 40t0 40t0 40')+arrow(150,160,200,160)+arrow(150,180,200,180)+tx(20,206,20,'q = −k∇T');}],
     [/regulacion automatica/,function(){return c(40,80,14)+p('M26 80h28M40 66v28')+arrow(0,80,26,80)+arrow(54,80,90,80)+r(90,60,60,40,4)+arrow(150,80,210,80)+p('M180 80v60h-140v-46')+arrow(40,140,40,96)+tx(102,86,18,'G(s)');}],
     [/organizacion/,function(){return r(80,10,60,30,5)+p('M110 40v22M40 62h140M40 62v22M110 62v22M180 62v22')+r(10,84,60,30,5)+r(80,84,60,30,5)+r(150,84,60,30,5)+p('M40 114v24M180 114v24')+r(10,138,60,30,5)+r(150,138,60,30,5)+p('M20 196h30M20 206h60M20 216h90');}],
     [/control por computador/,function(){var o=p('M10 110h200M10 10v200');for(var i=1;i<10;i++){var x=10+i*20,h=Math.round(70*Math.exp(-i/4)*Math.cos(i/1.5));o+=p('M'+x+' 110v'+(-h))+c(x,110-h,4);}return o+tx(150,40,24,'z⁻¹')+tx(150,196,20,'ZOH');}],
     [/tecnologia medioambiental/,function(){return p('M60 120C20 80 40 20 110 20c0 70-20 100-50 100z M60 120C80 90 90 60 110 20')+p('M160 140c-12 20-20 30 0 40s20-20 0-40z')+p('M30 160l30-14M60 146l-8 28M52 174l-30 6')+c(180,60,5)+p('M170 50l30 0M190 40l10 10-10 10');}],
     [/electronica digital/,function(){return p('M10 40h30M10 70h30M40 30v50h30a25 25 0 0 0 0-50z')+p('M95 55h30')+p('M20 130h30v-26M50 104h30v26h30v-26h30v26h30')+mo(14,200,26,'1 0 1 1')+p('M130 40l30 20-30 20zM160 60h20')+c(184,60,4);}],
     [/modelado y simulacion/,function(){return c(40,50,22)+c(160,50,22)+c(100,160,22)+arrow(62,50,138,50)+arrow(150,70,116,142)+arrow(84,144,50,70)+tx(32,56,18,'S0')+tx(152,56,18,'S1')+tx(92,166,18,'S2')+tx(90,38,16,'dt');}],
     [/electronica analogica/,function(){return p('M60 20v80l80-40z')+tx(66,52,22,'−')+tx(66,86,22,'+')+p('M10 44h50M10 84h50M140 60h70M175 60v60')+p('M175 120h-20l8-12 12 24 12-24 8 12z')+p('M20 160h80M60 160v26M40 186h40M50 196h20')+c(210,60,4,1);}],
     [/sistemas basados en microprocesador/,function(){var o=r(60,60,100,100,8)+c(74,74,4,1);for(var i=0;i<5;i++){var q=76+i*16;o+=p('M'+q+' 60v-22M'+q+' 160v22M60 '+q+'h-22M160 '+q+'h22');}return o+mo(80,118,22,'CPU')+mo(14,16,16,'0x3F');}],
     [/programacion de sistemas en tiempo real/,function(){return c(60,60,40)+p('M60 60V32M60 60l22 12')+p('M20 130h60v14H20zM60 156h90v14H60zM110 182h90v14h-90z')+arrow(20,210,210,210)+tx(150,50,20,'τ ≤ T')+tx(150,80,20,'RT');}],
     [/sistemas robotizados/,function(){return r(10,190,70,16,4)+p('M45 190V150')+c(45,142,10)+p('M45 132l60-60')+c(110,66,9)+p('M115 60l50 20')+c(170,82,7)+p('M174 78l24-14M174 88l24 14')+arrow(130,30,180,40);}],
     [/automatizacion industrial/,function(){return p('M20 10v200M200 10v200')+p('M20 50h50M70 36v28M86 36v28M86 50h70')+c(170,50,14)+tx(164,56,18,'Y')+p('M170 50h30')+p('M20 120h50M70 106v28M86 106v28M86 120h50M146 106l-10 28')+c(170,120,14)+tx(163,126,18,'M')+p('M170 120h30')+tx(30,200,16,'PLC · I0.0');}],
     [/ingenieria de control/,function(){return p('M10 110h200M110 10v200')+p('M110 110m-70 0a70 70 0 1 0 140 0a70 70 0 1 0 -140 0').replace('<path','<path stroke-dasharray="5 6"')+p('M30 110C70 110 90 60 110 20M30 110C70 110 90 160 110 200')+p('M60 100l12 12M72 100l-12 12M60 120l12 12M72 120l-12 12'.replace(/M60 120.*/,''))+tx(126,34,18,'Im')+tx(186,104,18,'Re');}],
     [/sistemas de produccion/,function(){return r(10,120,200,18,8)+c(26,150,10)+c(194,150,10)+r(30,90,34,30,3)+r(90,90,34,30,3)+r(150,90,34,30,3)+arrow(20,50,200,50)+p('M110 10v20M110 160v30')+tx(14,208,18,'JIT · OEE');}]
    ];
    function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ñ/g,'n').trim();}
    var key=norm(title), fn=null;
    for(var i=0;i<M.length;i++){ if(M[i][0].test(key)){fn=M[i][1];break;} }
    if(!fn) return;
    var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="220" height="220"><g '+S+'>'+fn()+'</g></svg>';
    window.__anMotifSvg=svg;
    var url='url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
    var fade='radial-gradient(ellipse 80% 70% at 50% 45%,rgba(0,0,0,.25) 0%,rgba(0,0,0,.55) 55%,#000 100%)';
    var css='#an-bg{position:fixed;inset:0;z-index:1;pointer-events:none;background:var(--accent,#1f4fd1);opacity:.055;-webkit-mask-image:'+url+','+fade+';-webkit-mask-size:300px 300px,100% 100%;-webkit-mask-repeat:repeat,no-repeat;-webkit-mask-composite:source-in;mask-image:'+url+','+fade+';mask-size:300px 300px,100% 100%;mask-repeat:repeat,no-repeat;mask-composite:intersect}'
      +'@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) #an-bg{opacity:.09}}:root[data-theme="dark"] #an-bg{opacity:.09}'
      +'@media print{#an-bg{display:none!important}}';
    var st=document.createElement('style'); st.id='an-bg-css'; st.textContent=css; document.head.appendChild(st);
    function add(){var b=document.createElement('div');b.id='an-bg';b.setAttribute('aria-hidden','true');document.body.insertBefore(b,document.body.firstChild);}
    if(document.body) add(); else document.addEventListener('DOMContentLoaded',add);
  })();
  /* ===== Iconos en los botones de la portada ===== */
  (function(){
    var I={
      play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
      sigma:'<path d="M18 5H6l7 7-7 7h12"/>',
      book:'<path d="M4 5a2 2 0 0 1 2-2h13v14H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h13v-4"/><path d="M9 8h6M9 11h4"/>',
      flask:'<path d="M9 3h6M10 3v6l-5.5 10a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7.5 15h9"/>',
      file:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 14l2 2 4-4"/>',
      pencil:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
      cal:'<path d="M4 6h16v14H4z"/><path d="M4 10h16M8 3v4M16 3v4"/><path d="M9 15l2 2 3-3"/>',
      target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
      timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/>',
      sliders:'<path d="M4 8h9M17 8h3M13 6v4h4V6zM4 16h3M11 16h9M7 14v4h4v-4z"/>',
      bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
      search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.5-4.5"/>',
      term:'<path d="M4 5h16v14H4z"/><path d="M7 10l3 2-3 2M12 15h5"/>',
      route:'<circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/><path d="M7 19h8a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h8"/>',
      mark:'<path d="M6 3h12v18l-6-4-6 4z"/>'
    };
    function pick(lab,href){
      var l=lab.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''), h=(href||'').toLowerCase();
      if(/empieza|empezar|^el examen$/.test(l)&&!/examen por/.test(l)) return /^el examen$/.test(l)?'search':'play';
      if(/que cae|por dentro|como es el examen/.test(l)) return 'search';
      if(/maxima|practicas r|en c$|sql/.test(l)) return 'term';
      if(/simulacro|hazte/.test(l)) return 'timer';
      if(/^simuladores$|^temas y simuladores$/.test(l)) return 'sliders';
      if(/simulador/.test(l)) return 'sliders';
      if(/autoevaluaci/.test(l)) return 'target';
      if(/demostra/.test(l)) return 'bulb';
      if(/estrategia/.test(l)) return 'route';
      if(/formulario|chuleta/.test(l)||/formulario/.test(h)) return 'sigma';
      if(/cuestiones|preguntas|teoria/.test(l)||/cuestiones/.test(h)) return 'book';
      if(/laboratorio|practicas|proyecto/.test(l)||/laboratorio/.test(h)) return 'flask';
      if(/examen|ep1|controles/.test(l)||/examenes|ep1|examen-/.test(h)) return 'file';
      if(/evaluaci|plan/.test(l)||/plan\.html/.test(h)) return 'cal';
      if(/problemas|hojas|boletines|recopilaci|ejercicios/.test(l)||/problemas/.test(h)) return 'pencil';
      if(/#t0|t01/.test(h)) return 'sliders';
      return 'mark';
    }
    function run(){
      var bs=document.querySelectorAll('.hero a.btn,.hero-in a.btn,.hero-txt a.btn,.an-acts a.btn');
      if(!bs.length){var pri=document.querySelector('a.btn.pri');if(pri&&pri.parentNode) bs=pri.parentNode.querySelectorAll('a.btn');}
      for(var i=0;i<bs.length;i++){
        var a=bs[i]; if(a.querySelector('svg')||a.dataset.anIc) continue; a.dataset.anIc='1';
        var k=pick(a.textContent.trim(),a.getAttribute('href'));
        a.insertAdjacentHTML('afterbegin','<svg class="an-bi" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+I[k]+'</svg>');
        a.classList.add('an-hasic');
      }
    }
    var st=document.createElement('style'); st.id='an-ic-css';
    st.textContent='a.btn.an-hasic{display:inline-flex;align-items:center;gap:.55em}.an-bi{flex:none;width:1.25em;height:1.25em}@media print{.an-bi{display:none}}';
    document.head.appendChild(st);
    window.__asigIcons=run;
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  })();
  /* ===== Portada estándar (guías con estructura propia) ===== */
  (function(){
    var HUBU='https://helionacon-ui.github.io/GIEIA-UPCT/';
    function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ñ/g,'n').trim();}
    var key=norm(title);
    var isIndex=/\/(index\.html)?$/.test(location.pathname)||/\/index\.html$/.test(location.pathname);
    var css='a[href="'+HUBU+'"]:not(.an-hub):not(.an-brand){display:none!important}.hubbar{display:none!important}'
      +'.an-hero{background:linear-gradient(135deg,color-mix(in srgb,var(--accent,#1f4fd1) 9%,var(--bg,#f5f7f6)),var(--bg,#f5f7f6) 70%);border-bottom:1px solid var(--line,#d3dcdf);margin-bottom:28px}'
      +'.an-hero-in{max-width:1180px;margin:0 auto;padding:clamp(28px,5vw,56px) max(16px,env(safe-area-inset-right,0px));display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:40px;align-items:center}'
      +'.an-hero .an-k{font:500 12.5px var(--mono,monospace);letter-spacing:.1em;text-transform:uppercase;color:var(--accent,#1f4fd1)}'
      +'.an-hero h1{font-family:var(--display,"Big Shoulders Display","Arial Narrow",Impact,sans-serif);font-weight:800;font-size:clamp(46px,8.6vw,108px);line-height:.94;letter-spacing:.005em;text-transform:uppercase;margin:12px 0 10px;color:var(--fg,#18232b)}'
      +'.an-hero h1 span{color:var(--accent,#1f4fd1)}'
      +'.an-hero .an-sub{font-family:var(--display,"Arial Narrow",sans-serif);font-weight:500;font-size:clamp(20px,2.6vw,28px);letter-spacing:.07em;text-transform:uppercase;color:var(--muted,#5a6870);margin:0 0 14px}'
      +'.an-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:22px 0 18px;max-width:660px}'
      +'.an-stats div{background:var(--surface,#fff);border:1px solid var(--line,#d3dcdf);border-radius:12px;padding:10px 12px;box-shadow:0 1px 2px rgba(0,0,0,.05),0 6px 16px -10px rgba(0,0,0,.25)}'
      +'.an-stats b{display:block;font-family:var(--display,"Arial Narrow",sans-serif);font-size:30px;line-height:1.1;color:var(--accent,#1f4fd1);font-variant-numeric:tabular-nums}'
      +'.an-stats span{display:block;font-size:12.5px;line-height:1.3;color:var(--muted,#5a6870)}'
      +'.an-acts{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}'
      +'.an-acts a.btn{display:inline-flex;align-items:center;gap:.55em;padding:11px 18px;border-radius:999px;border:1px solid var(--line,#d3dcdf);background:var(--surface,#fff);color:var(--fg,#18232b);text-decoration:none;font:600 14.5px/1 var(--body,system-ui,sans-serif)}'
      +'.an-acts a.btn:hover,.an-acts a.btn:focus-visible{border-color:var(--accent,#1f4fd1);outline:none}'
      +'.an-acts a.btn.pri{background:var(--accent,#1f4fd1);border-color:var(--accent,#1f4fd1);color:var(--surface,#fff)}'
      +'.an-art{aspect-ratio:1;border-radius:28px;background:var(--surface,#fff);border:1px solid var(--line,#d3dcdf);box-shadow:0 1px 2px rgba(0,0,0,.05),0 16px 40px -20px rgba(0,0,0,.3);position:relative;overflow:hidden}'
      +'.an-art i{position:absolute;inset:8%;background:var(--accent,#1f4fd1);opacity:.85;-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat}'
      +'@media (max-width:820px){.an-hero-in{grid-template-columns:minmax(0,1fr)}.an-art{display:none}.an-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}'
      +'@media print{.an-art{display:none}}';
    var st=document.createElement('style'); st.id='an-cover-css'; st.textContent=css; document.head.appendChild(st);

    var CFG=[
     [/^termodinamica/,{k:'GIEyA · 2.º curso',a:'Termodinámica',b:'aplicada',s:'Ciclos, balances y máquinas térmicas · guía para aprobar',
       btn:[['Empezar por el tema 1','t01.html',1],['Examen y estrategia','examen.html'],['Exámenes resueltos','examenes.html'],['Autoevaluación','autoevaluacion.html'],['Demostraciones','demos.html'],['Formulario','formulario.html'],['Plan de estudio','plan.html']]}],
     [/^electronica digital/,{k:'GIEyA · 3.er curso',a:'Electrónica',b:'digital',s:'Del álgebra de Boole a la lógica programable · guía para aprobar',
       btn:[['Empieza desde cero','empezar.html',1],['Exámenes resueltos','examenes.html'],['Hojas de problemas','hojas.html'],['Prácticas y simulador','laboratorio.html'],['Autoevaluación','autoevaluacion.html'],['Simulacros','simulacros.html'],['Formulario','formulario.html']]}]
    ];
    var cfg=null; for(var i=0;i<CFG.length;i++){ if(CFG[i][0].test(key)){cfg=CFG[i][1];break;} }

    function hero(){
      if(!cfg||!isIndex||document.querySelector('.an-hero')) return;
      var ic=document.querySelector('.an-ic'); if(!ic) return;
      var cards=[].slice.call(ic.querySelectorAll('.an-card'));
      var temas=0,prac=0,rep=0;
      cards.forEach(function(c){
        var lab=(c.querySelector('.al')||{}).textContent||'';
        var m=lab.match(/Temas?\s+(\d+)(?:–(\d+))?/);
        if(m){temas+=m[2]?(+m[2])-(+m[1])+1:1;}
        else if(/Pract|Pr[aá]ct/i.test(lab)) prac++;
        else if(/Repasar|Todo junto/i.test(lab)) rep++;
      });
      var stats=[[temas,'temas del programa'],[cards.length,'páginas en la guía'],[prac,'páginas para practicar'],[rep,'páginas de repaso y consulta']].filter(function(x){return x[0]>0;});
      var h=el('header','an-hero');
      var btns=cfg.btn.map(function(b){return '<a class="btn'+(b[2]?' pri':'')+'" href="'+esc(b[1])+'">'+esc(b[0])+'</a>';}).join('');
      h.innerHTML='<div class="an-hero-in"><div><div class="an-k">'+esc(cfg.k)+'</div><h1>'+esc(cfg.a)+' <span>'+esc(cfg.b)+'</span></h1><p class="an-sub">'+esc(cfg.s)+'</p>'
        +'<div class="an-stats">'+stats.map(function(x){return '<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('')+'</div><div class="an-acts">'+btns+'</div></div>'
        +'<div class="an-art" aria-hidden="true"><i></i></div></div>';
      if(window.__anMotifSvg){ h.querySelector('.an-art i').style.setProperty('--m','url("data:image/svg+xml,'+encodeURIComponent(window.__anMotifSvg)+'")'); }
      ic.parentNode.insertBefore(h,ic);
      window.__asigIcons&&window.__asigIcons();
    }
    function pcards(){
      if(document.querySelector('.an-ic')||!document.querySelector('header.hero')) return;
      var pcs=document.querySelectorAll('a.pcard'); if(pcs.length<6) return;
      var main=document.querySelector('.home-main'); if(!main) return;
      var host=main.parentNode;
      var sec=el('section','an-ic'), steps=el('div','an-steps');
      ['Elige un tema de la lista o empieza por <b>«desde cero»</b> si partes de cero.','Sigue los temas en orden: <b>teoría, simuladores y vídeos</b>. Marca cada tema al terminarlo.','Practica con los <b>problemas y exámenes resueltos</b> antes de presentarte.'].forEach(function(s,i){steps.appendChild(el('div','an-step','<i>'+(i+1)+'</i><p>'+s+'</p>'));});
      sec.appendChild(steps); sec.appendChild(el('h2',null,'Las '+pcs.length+' páginas de la guía'));
      var grid=el('div','an-cards');
      [].forEach.call(pcs,function(p){
        var g=p.closest('.hgrp'), kick=g&&g.querySelector('.kick')?g.querySelector('.kick').textContent.trim():'Guía';
        var gh=g&&g.querySelector('h2')?g.querySelector('h2').textContent.trim():'';
        var badge=(p.querySelector('.badge')||{}).textContent||'·', t=(p.querySelector('h3')||{}).textContent||p.textContent;
        var lab=/^T\d+$/i.test(badge.trim())?(gh+' · Tema '+badge.trim().slice(1)):gh||kick;
        var a=el('a','an-card','<span class="ac">'+esc(badge.trim()||'·')+'</span><span class="al">'+esc(lab)+'</span><span class="at">'+esc(t.trim())+'</span><span class="ag">Abrir →</span>');
        a.href=p.getAttribute('href');
        a.style.setProperty('--k',/empezar|consult/i.test(kick)?'var(--fg,#18232b)':/practic|examen/i.test(kick+gh)?'color-mix(in srgb,var(--accent,#1f4fd1) 62%,#000)':'var(--accent,#1f4fd1)');
        grid.appendChild(a);
      });
      sec.appendChild(grid); host.parentNode.insertBefore(sec,host);
      var s2=document.createElement('style'); s2.textContent='.home-main{display:none!important}'; document.head.appendChild(s2);
    }
    function go(){ pcards(); hero(); }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
  })();
  /* ===== Fondo tintado con el color de la guía (sin blanco liso) ===== */
  (function(){
    var n=title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    var cs=getComputedStyle(document.documentElement);
    var base=(cs.getPropertyValue('--bg')||'').trim()||'#f5f7f6';
    var dark=document.documentElement.getAttribute('data-theme')==='dark'||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches&&document.documentElement.getAttribute('data-theme')!=='light');
    if(dark) base='#f5f7f6';
    var css=':root{--bg:color-mix(in srgb,var(--accent,#1f4fd1) 6%,'+base+');--surface:color-mix(in srgb,var(--accent,#1f4fd1) 4%,#fff)}'
      +'@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:color-mix(in srgb,var(--accent,#7ea4ff) 13%,#0d1318);--surface:color-mix(in srgb,var(--accent,#7ea4ff) 7%,#141b21)}}'
      +':root[data-theme="dark"]{--bg:color-mix(in srgb,var(--accent,#7ea4ff) 13%,#0d1318);--surface:color-mix(in srgb,var(--accent,#7ea4ff) 7%,#141b21)}'
      +'html,body{background:var(--bg)!important}header.top,.topbar{background:color-mix(in srgb,var(--accent,#1f4fd1) 5%,var(--bg))!important}.hub-bar,.hubbar,.crumb{background:transparent!important}'
      +'.an-bar~.topbar .brand{display:none}.an-bar~.topbar .tb-in{justify-content:flex-end}';
    var st=document.createElement('style'); st.id='an-tint-css'; st.textContent=css; document.head.appendChild(st);
  })();
})();
