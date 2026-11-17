/* Animaciones tipo «Manim» para las guías. Motor común + plantillas.
   Cada <div class="manim" data-anim="..."> se convierte en un reproductor con lienzo, controles y subtítulo.
   Las animaciones de cada guía se registran con MANIM.reg(nombre, spec) en anim-temas.js. */
(function(){
'use strict';
if(window.MANIM) return;

/* ---------- paleta y utilidades ---------- */
var C={bg:'#0c0d12',ax:'#a7a2c8',grid:'rgba(255,255,255,.07)',f:'#5fd3f3',g:'#ff5c8a',m:'#b07cff',mf:'rgba(176,124,255,.42)',
       y:'#f5e663',w:'#ece9f7',mut:'#8f8ca8',ok:'#7ee08a',bad:'#ff6b6b'};
var SERIF='"STIX Two Text","Cambria Math",Cambria,"Latin Modern Roman",Georgia,serif';
var W=640,FS=1;
function RG(c,a){c=String(c).trim();var r,g,b,m;
  if(c[0]==='#'){if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];r=parseInt(c.substr(1,2),16);g=parseInt(c.substr(3,2),16);b=parseInt(c.substr(5,2),16);}
  else if((m=c.match(/rgba?\(([^)]*)\)/))){var v=m[1].split(/[ ,\/]+/).map(parseFloat);r=v[0];g=v[1];b=v[2];}else return c;
  return 'rgba('+r+','+g+','+b+','+a+')';}
function rgb(c){c=String(c).trim();if(c[0]==='#'){if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return [parseInt(c.substr(1,2),16),parseInt(c.substr(3,2),16),parseInt(c.substr(5,2),16)];}
  var m=c.match(/rgba?\(([^)]*)\)/);if(m){var v=m[1].split(/[ ,\/]+/).map(parseFloat);return [v[0],v[1],v[2]];}return null;}
function mix(a,b,t){var A=rgb(a),B=rgb(b);if(!A||!B)return a;return 'rgb('+A.map(function(x,i){return Math.round(x*(1-t)+B[i]*t);}).join(',')+')';}
function theme(el){try{var cs=getComputedStyle(el),v=function(n,d){var x=cs.getPropertyValue(n).trim();return x||d;};
  C.bg=v('--surface','#ffffff');C.w=v('--fg','#16211d');C.mut=v('--muted','#56635e');C.ax=C.mut;C.grid=RG(v('--line','#d5dcd9'),.9);
  C.f=v('--c2','#0b7f93');C.g=v('--c5','#c43d63');C.m=v('--c3','#7d45c9');C.y=v('--tc',v('--accent','#0d6e5a'));C.hl=v('--c4','#b8730c');
  C.ok=v('--c6','#2c8a52');C.bad=v('--warn','#b2482a');C.w=mix(C.w,C.y,.6);C.ax=mix(C.mut,C.y,.45);C.mut=mix(C.mut,C.y,.3);
  var ff=getComputedStyle(document.body).fontFamily;if(ff)SERIF=ff;}catch(e){}}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function seg(t,a,b){return clamp((t-a)/(b-a),0,1);}
function ease(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;}
function lerp(a,b,u){return a+(b-a)*u;}
function nf(v,d){if(d===undefined)d=2;var s=(Math.abs(v)<5e-13?0:v).toFixed(d);return s.replace('-','−').replace('.',',');}


/* ---------- estilos del reproductor ---------- */
(function(){if(document.getElementById('manim-css'))return;var s=document.createElement('style');s.id='manim-css';s.textContent=
'.manim{background:transparent;border:0;padding:0;margin:4px 0 2px;color:var(--fg,#16211d)}'+
'.manim canvas{display:block;width:100%;height:auto;border-radius:8px}'+
'.manim-bar{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}'+
'.manim-bar button,.manim-bar select{font:600 15px/1 var(--body,inherit);color:var(--fg,#16211d);background:var(--bg,#f4f6f5);border:1px solid var(--line,#d5dcd9);border-radius:8px;padding:8px 12px;cursor:pointer;min-height:40px}'+
'.manim-bar button:hover{border-color:var(--tc,var(--accent))}.manim-bar button:focus-visible,.manim-bar input:focus-visible,.manim-bar select:focus-visible{outline:2px solid var(--tc,var(--accent));outline-offset:2px}'+
'.manim-bar input[type=range]{flex:1 1 140px;accent-color:var(--tc,var(--accent));min-width:120px}'+
'.manim-try{display:none;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap;padding:6px 10px;border:1px dashed var(--tc,var(--accent));border-radius:8px}.manim-try.on{display:flex}'+
'.manim-try b{font:600 14px/1.2 var(--body,inherit);color:var(--tc,var(--accent))}.manim-try input{flex:1 1 160px;accent-color:var(--tc,var(--accent));min-width:120px}.manim-try button{font:600 14px/1 var(--body,inherit);color:var(--fg,#16211d);background:var(--bg,#f4f6f5);border:1px solid var(--line,#d5dcd9);border-radius:8px;padding:7px 10px;cursor:pointer;min-height:36px}'+
'.manim-t{font:13px/1 var(--mono,ui-monospace,monospace);color:var(--muted);min-width:62px;text-align:right}'+
'.manim-cap{font:inherit;color:var(--fg,#16211d);margin:8px 4px 2px;min-height:2.9em}'+
'@media (max-width:560px){figure.fig.manim-fig{padding-left:6px!important;padding-right:6px!important}.manim-fig .manim{padding:0;margin-left:-2px;margin-right:-2px}}';
document.head.appendChild(s);})();

/* ---------- primitivas de dibujo ---------- */
function mk(ctx){
  var o={ctx:ctx};
  o.text=function(s,x,y,op){op=op||{};ctx.save();ctx.fillStyle=op.c||C.w;ctx.textBaseline=op.b||'alphabetic';ctx.globalAlpha*=op.al===undefined?1:op.al;
    var sz=op.s||18;sz=sz<=20?sz*FS:sz*Math.min(FS,1.3);var fam=(op.mono?'ui-monospace,monospace':SERIF),st=(op.it?'italic ':'')+(op.bold?'600 ':'');
    var parts=[],re=/([\^_])\{([^}]*)\}/g,m,i=0;while((m=re.exec(s))){if(m.index>i)parts.push([s.slice(i,m.index),0]);parts.push([m[2],m[1]==='^'?1:-1]);i=re.lastIndex;}if(i<s.length)parts.push([s.slice(i),0]);
    var wsum=0;parts.forEach(function(q){ctx.font=st+(q[1]?Math.round(sz*.68):sz)+'px '+fam;q.push(ctx.measureText(q[0]).width);wsum+=q[2];});
    if(wsum>W-16){var k=(W-16)/wsum;sz*=k;wsum=0;parts.forEach(function(q){ctx.font=st+(q[1]?Math.round(sz*.68):sz)+'px '+fam;q[2]=ctx.measureText(q[0]).width;wsum+=q[2];});}
    var a=op.a||'left',xx=a==='center'?x-wsum/2:(a==='right'?x-wsum:x);ctx.textAlign='left';
    parts.forEach(function(q){ctx.font=st+(q[1]?Math.round(sz*.68):sz)+'px '+fam;ctx.fillText(q[0],xx,y+(q[1]===1?-sz*.42:(q[1]===-1?sz*.22:0)));xx+=q[2];});
    ctx.restore();};
  o.line=function(x1,y1,x2,y2,c,w,d,al){ctx.save();ctx.strokeStyle=c||C.ax;ctx.lineWidth=w||1.5;if(d)ctx.setLineDash(d);ctx.globalAlpha*=al===undefined?1:al;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();};
  o.dot=function(x,y,r,c,al){ctx.save();ctx.fillStyle=c;ctx.globalAlpha*=al===undefined?1:al;ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.fill();ctx.restore();};
  o.ring=function(x,y,r,c,w){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=w||2;ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.stroke();ctx.restore();};
  o.cross=function(x,y,r,c){o.line(x-r,y-r,x+r,y+r,c,2.4);o.line(x-r,y+r,x+r,y-r,c,2.4);};
  o.head=function(x,y,ang,c,sz){sz=sz||10;ctx.save();ctx.fillStyle=c;ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-sz,-sz*.5);ctx.lineTo(-sz,sz*.5);ctx.closePath();ctx.fill();ctx.restore();};
  o.arrow=function(x1,y1,x2,y2,c,w){o.line(x1,y1,x2,y2,c,w||2);o.head(x2,y2,Math.atan2(y2-y1,x2-x1),c,9);};
  o.path=function(pts,c,w,fill,al){if(pts.length<2)return;ctx.save();ctx.globalAlpha*=al===undefined?1:al;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(var i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
    if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill();}if(c){ctx.strokeStyle=c;ctx.lineWidth=w||2;ctx.lineJoin='round';ctx.stroke();}ctx.restore();};
  o.rect=function(x,y,w,h,stroke,fill,lw){ctx.save();if(fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2.4;ctx.strokeRect(x,y,w,h);}ctx.restore();};
  /* ejes estilo Manim: devuelve X(v), Y(v) */
  o.axes=function(r){var X=function(v){return r.x+(v-r.xr[0])/(r.xr[1]-r.xr[0])*r.w;},Y=function(v){return r.y+r.h-(v-r.yr[0])/(r.yr[1]-r.yr[0])*r.h;};
    var y0=Y(clamp(0,r.yr[0],r.yr[1])),x0=X(clamp(0,r.xr[0],r.xr[1]));
    if(r.grid){(r.yt||[]).forEach(function(v){o.line(r.x,Y(v),r.x+r.w,Y(v),C.grid,1);});}
    o.line(r.x,y0,r.x+r.w+12,y0,C.ax,1.6);o.head(r.x+r.w+16,y0,0,C.ax,11);
    if(!r.noY){o.line(x0,r.y+r.h,x0,r.y-12,C.ax,1.6);o.head(x0,r.y-16,-Math.PI/2,C.ax,11);}
    (r.xt||[]).forEach(function(v){var xx=X(v);o.line(xx,y0-4,xx,y0+4,C.ax,1.4);o.text(r.xf?r.xf(v):nf(v,r.xd===undefined?1:r.xd),xx,y0+19,{s:13,a:'center',c:C.mut});});
    (r.yt||[]).forEach(function(v){if(Math.abs(v)<1e-9)return;var yy=Y(v);o.line(x0-4,yy,x0+4,yy,C.ax,1.4);o.text(r.yf?r.yf(v):nf(v,r.yd===undefined?1:r.yd),x0-9,yy+4,{s:13,a:'right',c:C.mut});});
    if(r.xl)o.text(r.xl,r.x+r.w+18,y0-12,{it:true,s:19,c:C.w,a:'right'});
    if(r.yl&&!r.noY)o.text(r.yl,x0,r.y-24,{it:true,s:19,c:C.w,a:'center'});
    return {X:X,Y:Y,y0:y0,x0:x0};};
  o.stem=function(A,n,v,c,al,r){var x=A.X(n),y=A.Y(v);o.line(x,A.y0,x,y,c,2.6,null,al);o.dot(x,y,r||5.5,c,al);};
  return o;
}

/* ---------- reproductor ---------- */
function Player(el,spec){
  var dpr=Math.min(window.devicePixelRatio||1,2.5),H=spec.H;
  el.innerHTML='';el.setAttribute('role','group');el.setAttribute('aria-label','Animación: '+spec.title);
  var cv=document.createElement('canvas');cv.width=W*dpr;cv.height=H*dpr;cv.setAttribute('role','img');cv.setAttribute('aria-label',spec.alt||spec.title);el.appendChild(cv);
  var cap=document.createElement('p');cap.className='manim-cap';cap.setAttribute('aria-live','polite');el.appendChild(cap);
  var bar=document.createElement('div');bar.className='manim-bar';
  bar.innerHTML='<button type="button" class="mp" aria-label="Reproducir">▶ Reproducir</button><button type="button" class="mr" aria-label="Volver a empezar">↺</button>'+
    '<input type="range" min="0" max="1000" value="0" aria-label="Posición de la animación"><span class="manim-t">0,0 s</span>'+
    '<select aria-label="Velocidad"><option value="0.5">0,5×</option><option value="1" selected>1×</option><option value="1.5">1,5×</option><option value="2">2×</option></select>';
  el.appendChild(bar);
  var tr=document.createElement('div');tr.className='manim-try';tr.innerHTML='<b>Prueba tú:</b><input type="range" min="0" max="1000" value="500" aria-label="Mover el parámetro de la animación"><button type="button">Automático</button>';el.appendChild(tr);
  var tin=tr.querySelector('input'),tauto=tr.querySelector('button'),man=null;
  var bp=bar.querySelector('.mp'),br=bar.querySelector('.mr'),rg=bar.querySelector('input'),tl=bar.querySelector('.manim-t'),sp=bar.querySelector('select');
  var ctx=cv.getContext('2d'),D=mk(ctx),t=0,playing=false,last=0,speed=1,lastCap='';
  function render(){theme(el);var cw=cv.clientWidth||W;FS=clamp(560/cw,1,2);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    if(spec.title)D.text(spec.title,W/2,40,{s:32,a:'center',c:C.y,bold:true});
    OVR=man;USED=false;spec.draw(D,t);OVR=null;if(USED&&!tr.classList.contains('on'))tr.classList.add('on');var c=spec.cap(t).replace(/\^\{([^}]*)\}/g,'<sup>$1</sup>');if(c!==lastCap){cap.innerHTML=c;lastCap=c;}
    rg.value=Math.round(t/spec.dur*1000);tl.textContent=nf(t,1)+' s';}
  function frame(ts){if(!playing)return;var dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;t+=dt*speed;
    if(t>=spec.dur){t=spec.loop===false?spec.dur:0;if(spec.loop===false){pause();render();return;}}render();requestAnimationFrame(frame);}
  function play(){if(playing)return;man=null;if(t>=spec.dur)t=0;playing=true;last=0;bp.textContent='⏸ Pausa';bp.setAttribute('aria-label','Pausa');requestAnimationFrame(frame);}
  function pause(){playing=false;bp.textContent='▶ Reproducir';bp.setAttribute('aria-label','Reproducir');}
  bp.addEventListener('click',function(){playing?pause():play();});
  br.addEventListener('click',function(){t=0;render();play();});
  rg.addEventListener('input',function(){t=rg.value/1000*spec.dur;render();});
  sp.addEventListener('change',function(){speed=+sp.value;});
  tin.addEventListener('input',function(){man=tin.value/1000;if(playing)pause();render();});
  tauto.addEventListener('click',function(){man=null;render();play();});
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>.55){if(!reduce&&!el.__auto){el.__auto=true;play();}}else if(!e.isIntersecting&&playing)pause();});},{threshold:[0,.55]});io.observe(el);}
  window.addEventListener('resize',function(){if(!playing)render();});
  try{new MutationObserver(function(){if(!playing)render();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class']});
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(!playing)render();});}catch(e){}
  /* estado inicial: un fotograma representativo */
  t=spec.poster||0;render();t=spec.poster||0;
  if(document.fonts&&document.fonts.load){document.fonts.ready.then(function(){if(!playing)render();}).catch(function(){});}
}


/* ---------- plantillas ---------- */
function capf(caps){return function(t){for(var i=0;i<caps.length;i++)if(t<caps[i][0])return caps[i][1];return caps[caps.length-1][1];};}
var OVR=null,USED=false;
function sw(v){USED=true;return OVR!==null?OVR:v;}
function pp(t,d){USED=true;if(OVR!==null)return OVR;return t<d*0.62?ease(seg(t,1,d*0.5)):1-ease(seg(t,d*0.66,d*0.95));}
function cols(){return [C.m,C.f,C.g,C.hl,C.ok,C.bad];}
function colOf(c,i){if(typeof c==='string'&&C[c])return C[c];if(typeof c==='string')return c;return cols()[(c===undefined?i:c)%6];}
function plotf(D,A,f,c,w,al,n){var r=A.r,N=n||400,seg=[],segs=[];for(var i=0;i<=N;i++){var x=r.xr[0]+(r.xr[1]-r.xr[0])*i/N,y=f(x);
  if(isFinite(y)&&y>=r.yr[0]-(r.yr[1]-r.yr[0])*0.02&&y<=r.yr[1]+(r.yr[1]-r.yr[0])*0.02){seg.push([A.X(x),A.Y(y)]);}else{if(seg.length>1)segs.push(seg);seg=[];}}
  if(seg.length>1)segs.push(seg);segs.forEach(function(s){D.path(s,c,w||2.6,null,al===undefined?1:al);});}
function clipA(D,A,f){var r=A.r,c=D.ctx;c.save();c.beginPath();c.rect(r.x-2,r.y-4,r.w+8,r.h+8);c.clip();f();c.restore();}
function axes(D,ax,def){var r={};for(var k in def)r[k]=def[k];for(var k2 in ax)r[k2]=ax[k2];var A=D.axes(r);A.r=r;return A;}
function readout(D,lines,y0){(lines||[]).forEach(function(s,i){D.text(s,W/2,y0+i*34,{it:true,s:22,a:'center',c:i?C.w:C.m});});}
function base(o,draw){return {title:o.title,H:o.H||560,dur:o.dur||18,poster:o.poster===undefined?(o.dur||18)*0.35:o.poster,alt:o.alt||o.title,draw:draw,cap:capf(o.caps||[[99,'']])};}

/* 1. curva: barrido de un parámetro p en y = f(x, p) */
function curva(o){var d=o.dur||18;return base(o,function(D,t){var u=sw(o.u?o.u(t,d):pp(t,d)),p=lerp(o.p[0],o.p[1],u);
  var A=axes(D,o.ax,{x:80,y:96,w:500,h:o.h||300,grid:true});
  (o.curvas||[{f:o.f}]).forEach(function(c,i){var cl=colOf(c.c,i);if(o.ghost!==false&&!c.fija)plotf(D,A,function(x){return c.f(x,o.p[0]);},cl,1.4,0.28);plotf(D,A,function(x){return c.f(x,p);},cl,c.w||2.8,1);});
  if(o.extra)o.extra(D,A,p,t,u);readout(D,o.read?o.read(p,t):[],96+(o.h||300)+72);});}

/* 2. traza: dibuja f(x) poco a poco con un punto que avanza (área o tangente opcionales) */
function traza(o){var d=o.dur||16;return base(o,function(D,t){var A=axes(D,o.ax,{x:80,y:96,w:500,h:o.h||300,grid:true}),r=A.r;
  var x0=o.x0===undefined?r.xr[0]:o.x0,x1=o.x1===undefined?r.xr[1]:o.x1,xx=lerp(x0,x1,sw(ease(seg(t,1,d*0.8))));
  plotf(D,A,o.f,C.mut,1.2,0.35);
  if(o.fill){var pts=[[A.X(x0),A.Y(0)]];for(var i=0;i<=200;i++){var x=lerp(x0,xx,i/200);pts.push([A.X(x),A.Y(clamp(o.f(x),r.yr[0],r.yr[1]))]);}pts.push([A.X(xx),A.Y(0)]);D.path(pts,null,0,RG(C.m,.25));}
  var pts2=[];for(var j=0;j<=300;j++){var x2=lerp(x0,xx,j/300),y2=o.f(x2);if(y2>=r.yr[0]&&y2<=r.yr[1])pts2.push([A.X(x2),A.Y(y2)]);}D.path(pts2,C.m,3);
  var yy=o.f(xx);if(yy>=r.yr[0]&&yy<=r.yr[1]){
    if(o.tangent){var h=1e-4*(r.xr[1]-r.xr[0]),m=(o.f(xx+h)-o.f(xx-h))/(2*h),L=(r.xr[1]-r.xr[0])*0.18;clipA(D,A,function(){D.line(A.X(xx-L),A.Y(yy-m*L),A.X(xx+L),A.Y(yy+m*L),C.hl,2.2);});}
    D.line(A.X(xx),A.Y(0),A.X(xx),A.Y(yy),C.m,1,[4,4]);D.dot(A.X(xx),A.Y(yy),6.5,C.m);}
  if(o.extra)o.extra(D,A,xx,t);readout(D,o.read?o.read(xx,t):[],96+(o.h||300)+72);});}

/* 3. fasores: vectores que giran y la onda que dibujan */
function fasor(o){var d=o.dur||18;return base(o,function(D,t){var w0=o.w||1.4,th=t*w0,cx=o.cx||150,cy=o.cy||230,S=o.S||80,x0=o.x0||300,span=W-x0-24;
  var vs=o.vec(t),ctx=D.ctx,x=cx,y=cy;
  D.line(cx-S*1.35,cy,cx+S*1.35,cy,C.ax,1.2);D.line(cx,cy-S*1.35,cx,cy+S*1.35,C.ax,1.2);D.ring(cx,cy,S,C.grid,1);
  D.line(x0,cy,x0+span,cy,C.ax,1.2,[4,4]);
  vs.forEach(function(v,i){var cl=colOf(v.c,i),sx=o.chain?x:cx,sy=o.chain?y:cy,ex=sx+S*v.m*Math.cos(v.a),ey=sy-S*v.m*Math.sin(v.a);D.arrow(sx,sy,ex,ey,cl,2.6);
    if(v.l)D.text(v.l,ex+8,ey-6,{it:true,s:18,c:cl});if(o.chain){x=ex;y=ey;}
    if(!o.chain&&o.waves!==false){var pts=[];for(var u=0;u<=span;u+=2){var vv=o.vec(t-u/(o.px||60))[i];pts.push([x0+u,cy-S*vv.m*Math.sin(vv.a)]);}D.path(pts,cl,2,null,0.9);D.line(ex,ey,x0,ey,cl,1,[3,3],0.6);}});
  if(o.chain&&o.waves!==false){var pts2=[];for(var u2=0;u2<=span;u2+=2){var vv2=o.vec(t-u2/(o.px||60)),yy=0;vv2.forEach(function(v){yy+=v.m*Math.sin(v.a);});pts2.push([x0+u2,cy-S*yy]);}D.path(pts2,C.m,2.6);D.line(x,y,x0,y,C.m,1,[3,3]);D.dot(x,y,4,C.m);}
  if(o.extra)o.extra(D,t,{cx:cx,cy:cy,S:S});readout(D,o.read?o.read(t):[],o.ry||cy+S+80);});}

/* 4. trayectoria: un punto recorre (x(s), y(s)) con sus vectores */
function tray(o){var d=o.dur||16;return base(o,function(D,t){var A=axes(D,o.ax,{x:80,y:90,w:500,h:o.h||320,grid:true}),r=A.r;
  var s0=o.s[0],s1=o.s[1],s=lerp(s0,s1,sw(o.lin?seg(t,1,d*0.85):ease(seg(t,1,d*0.85)))),full=[],done=[];
  for(var i=0;i<=400;i++){var q=lerp(s0,s1,i/400),P=o.path(q);full.push([A.X(P[0]),A.Y(P[1])]);if(q<=s)done.push([A.X(P[0]),A.Y(P[1])]);}
  D.path(full,C.mut,1.2,null,0.4);D.path(done,C.m,3);var P0=o.path(s),px=A.X(P0[0]),py=A.Y(P0[1]);
  if(o.vel){var v=o.vel(s),k=o.kv||1;D.arrow(px,py,A.X(P0[0]+v[0]*k),A.Y(P0[1]+v[1]*k),C.f,2.6);D.text(o.lv||'v',A.X(P0[0]+v[0]*k)+6,A.Y(P0[1]+v[1]*k)-6,{it:true,s:18,c:C.f});}
  if(o.acc){var a=o.acc(s),ka=o.ka||1;D.arrow(px,py,A.X(P0[0]+a[0]*ka),A.Y(P0[1]+a[1]*ka),C.g,2.6);D.text(o.la||'a',A.X(P0[0]+a[0]*ka)+6,A.Y(P0[1]+a[1]*ka)+16,{it:true,s:18,c:C.g});}
  D.dot(px,py,7,C.m);if(o.extra)o.extra(D,A,s,t);readout(D,o.read?o.read(s,t):[],90+(o.h||320)+70);});}

/* 5. barras: diagrama de barras que cambia con un parámetro */
function barras(o){var d=o.dur||18;return base(o,function(D,t){var u=sw(o.u?o.u(t,d):pp(t,d)),p=lerp(o.p[0],o.p[1],u);
  var A=axes(D,o.ax,{x:80,y:96,w:500,h:o.h||300,grid:true}),r=A.r,n=o.n,bw=(A.X(1)-A.X(0))*(o.bw||0.7);
  for(var i=0;i<n;i++){var xv=o.xs?o.xs(i):i,v=o.val(i,p),cl=o.col?colOf(o.col(i,p),0):C.m;D.rect(A.X(xv)-bw/2,Math.min(A.Y(v),A.Y(0)),bw,Math.abs(A.Y(v)-A.Y(0)),cl,RG(cl,.32),1.6);
    if(o.lab)D.text(o.lab(i),A.X(xv),A.Y(0)+20,{s:13,a:'center',c:C.mut});}
  if(o.extra)o.extra(D,A,p,t);readout(D,o.read?o.read(p,t):[],96+(o.h||300)+72);});}

/* 6. campo: flechas de un campo vectorial y partículas que lo siguen */
function campo(o){var d=o.dur||18,parts=null;return base(o,function(D,t){var u=sw(o.u?o.u(t,d):pp(t,d)),p=o.p?lerp(o.p[0],o.p[1],u):0;
  var A=axes(D,o.ax,{x:80,y:90,w:480,h:o.h||340}),r=A.r,nx=o.nx||15,ny=o.ny||11,ctx=D.ctx;
  for(var i=0;i<=nx;i++)for(var j=0;j<=ny;j++){var x=lerp(r.xr[0],r.xr[1],i/nx),y=lerp(r.yr[0],r.yr[1],j/ny),F=o.field(x,y,p),m=Math.hypot(F[0],F[1]);if(!(m>1e-9))continue;
    var L=Math.min(1,m/(o.fm||1))*0.42*(r.xr[1]-r.xr[0])/nx,ux=F[0]/m,uy=F[1]/m,X1=A.X(x-ux*L/2),Y1=A.Y(y-uy*L/2),X2=A.X(x+ux*L/2),Y2=A.Y(y+uy*L/2);
    ctx.save();ctx.globalAlpha=0.35+0.5*Math.min(1,m/(o.fm||1));D.line(X1,Y1,X2,Y2,C.f,1.6);D.head(X2,Y2,Math.atan2(Y2-Y1,X2-X1),C.f,6);ctx.restore();}
  if(o.np!==0){var np=o.np||16;if(!parts||t<0.05){parts=[];for(var k=0;k<np;k++){parts.push({x:lerp(r.xr[0],r.xr[1],Math.random()),y:lerp(r.yr[0],r.yr[1],Math.random()),tr:[]});}}
    parts.forEach(function(q){for(var s=0;s<3;s++){var F=o.field(q.x,q.y,p),m=Math.hypot(F[0],F[1])||1,h=(o.step||0.012)*(r.xr[1]-r.xr[0]);q.x+=F[0]/(o.norm?m:1)*h;q.y+=F[1]/(o.norm?m:1)*h;}
      q.tr.push([q.x,q.y]);if(q.tr.length>40)q.tr.shift();
      if(q.x<r.xr[0]||q.x>r.xr[1]||q.y<r.yr[0]||q.y>r.yr[1]||Math.random()<0.004||(o.sink&&o.sink(q.x,q.y))){q.x=lerp(r.xr[0],r.xr[1],Math.random());q.y=lerp(r.yr[0],r.yr[1],Math.random());q.tr=[];}
      if(q.tr.length>1)D.path(q.tr.map(function(z){return [A.X(z[0]),A.Y(z[1])];}),C.m,1.6,null,0.7);D.dot(A.X(q.x),A.Y(q.y),3.4,C.m);});}
  if(o.extra)o.extra(D,A,p,t);readout(D,o.read?o.read(p,t):[],90+(o.h||340)+66);});}

/* 7. pasos: líneas que aparecen una tras otra, con la que está activa resaltada */
function pasos(o){var d=o.dur||20;return base(o,function(D,t){var L=o.lines,n=L.length,dt=(d-3)/n,y0=o.y0||110,gap=o.gap||(o.H?((o.H-y0-40)/n):46);
  for(var i=0;i<n;i++){var ti=1+i*dt,al=ease(seg(t,ti,ti+0.6));if(al<=0)continue;var on=t>=ti&&t<ti+dt,ln=L[i],y=y0+i*gap;
    if(on){D.rect(40,y-gap*0.62,W-80,gap*0.86,null,RG(C.y,.10));D.rect(40,y-gap*0.62,5,gap*0.86,null,C.y);}
    D.text(ln.s||ln,ln.x||W/2,y,{it:ln.it!==false,s:ln.size||22,a:ln.a||'center',c:on?C.y:(ln.c?colOf(ln.c,0):C.w),al:al,bold:on&&ln.b});}
  if(o.extra)o.extra(D,t);});}

var SPECS={};
window.MANIM={reg:function(n,s){SPECS[n]=s;if(document.readyState!=='loading')init();},C:C,W:W,
  util:{clipA:clipA,clamp:clamp,seg:seg,ease:ease,lerp:lerp,nf:nf,RG:RG,plotf:plotf,axes:axes,readout:readout,capf:capf,pp:pp},
  base:base,curva:curva,traza:traza,fasor:fasor,tray:tray,barras:barras,campo:campo,pasos:pasos};
function init(){document.querySelectorAll('.manim[data-anim]').forEach(function(el){if(el.__p)return;var s=SPECS[el.getAttribute('data-anim')];if(s){el.__p=true;Player(el,s);}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
