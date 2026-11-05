
(function(){
"use strict";
const __stub={};const $=id=>document.getElementById(id)||__stub[id]||(__stub[id]=(()=>{const w=document.createElement('section');const e=document.createElement('input');e.id='__'+id;w.appendChild(e);return e})());
/* ---------- complejos y funciones de transferencia ---------- */
const C=(re,im=0)=>({re,im});
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const div=(a,b)=>{const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)};
const cabs=a=>Math.hypot(a.re,a.im);
const pval=(p,s)=>p.reduce((acc,c)=>{const m=mul(acc,s);return C(m.re+c,m.im)},C(0));
const pmul=(a,b)=>{const r=new Array(a.length+b.length-1).fill(0);a.forEach((x,i)=>b.forEach((y,j)=>r[i+j]+=x*y));return r};
const pm=(...ps)=>ps.reduce(pmul,[1]);
const padd=(a,b)=>{const n=Math.max(a.length,b.length),r=new Array(n).fill(0);a.forEach((v,i)=>r[n-a.length+i]+=v);b.forEach((v,i)=>r[n-b.length+i]+=v);return r};
function freq(num,den,ws){let prev=null,off=0;
  /* fase inicial: número de integradores y signo de la ganancia, para que el unwrap empiece bien */
  return ws.map(w=>{const s=C(0,w);const g=div(pval(num,s),pval(den,s));let ph=Math.atan2(g.im,g.re)*180/Math.PI;
  if(prev!==null){while(ph+off-prev>180)off-=360;while(ph+off-prev<-180)off+=360;}else{const n0=den.length-1-den.map((v,i)=>v!==0?i:-1).reduce((a,b)=>Math.max(a,b),-1);const z0=num.length-1-num.map((v,i)=>v!==0?i:-1).reduce((a,b)=>Math.max(a,b),-1);const exp=-90*(n0-z0);while(ph-exp>180)ph-=360;while(ph-exp<-180)ph+=360;}
  ph+=off;prev=ph;return{w,mag:20*Math.log10(cabs(g)),ph,g}})}
const logspace=(a,b,n)=>Array.from({length:n},(_,i)=>Math.pow(10,a+(b-a)*i/(n-1)));
function margins(fr){let wc=null,mf=null,w180=null,mg=Infinity;
  for(let i=1;i<fr.length;i++){const a=fr[i-1],b=fr[i];
    if(wc===null&&a.mag>=0&&b.mag<0){const t=a.mag/(a.mag-b.mag);wc=Math.pow(10,Math.log10(a.w)+t*(Math.log10(b.w)-Math.log10(a.w)));mf=180+(a.ph+t*(b.ph-a.ph));}
    if(w180===null&&((a.ph>-180&&b.ph<=-180)||(a.ph<-180&&b.ph>=-180))){const t=(a.ph+180)/(a.ph-b.ph);w180=Math.pow(10,Math.log10(a.w)+t*(Math.log10(b.w)-Math.log10(a.w)));mg=-(a.mag+t*(b.mag-a.mag));}}
  return{wc,mf,w180,mg}}
const fmt=(x,d=1)=>(x<0&&Math.abs(x)<Math.pow(10,-d)/2?0:x).toFixed(d).replace('.',',');
const fdb=x=>isFinite(x)?fmt(x,1)+' dB':'∞';

/* ---------- simulación de sistemas lineales (forma canónica controlable, RK4) ---------- */
function sys(num,den){const a0=den[0];den=den.map(v=>v/a0);num=num.map(v=>v/a0);const n=den.length-1;while(num.length<n+1)num.unshift(0);
  const D=num[0],a=den.slice(1),b=[];for(let i=1;i<=n;i++)b.push(num[i]-D*den[i]);return{n,a,b,D,x:new Array(n).fill(0)}}
function deriv(S,x,u){const n=S.n,dx=new Array(n);for(let i=0;i<n-1;i++)dx[i]=x[i+1];let s=u;for(let k=0;k<n;k++)s-=S.a[k]*x[n-1-k];dx[n-1]=s;return dx}
function out(S,u){let y=S.D*u;for(let k=0;k<S.n;k++)y+=S.b[k]*S.x[S.n-1-k];return y}
function adv(S,u,dt){if(!S.n)return;const x=S.x,k1=deriv(S,x,u),x2=x.map((v,i)=>v+dt/2*k1[i]),k2=deriv(S,x2,u),x3=x.map((v,i)=>v+dt/2*k2[i]),k3=deriv(S,x3,u),x4=x.map((v,i)=>v+dt*k3[i]),k4=deriv(S,x4,u);
  S.x=x.map((v,i)=>v+dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]))}
const yout=S=>out(S,0); /* salida sin término directo (plantas estrictamente propias) */

/* ---------- motor de gráficas SVG ---------- */
function niceTicks(min,max,n=5){const step=Math.pow(10,Math.floor(Math.log10((max-min)/n)));const err=(max-min)/n/step;const s=step*(err>=7.5?10:err>=3.5?5:err>=1.5?2:1);const out=[];for(let v=Math.ceil(min/s-1e-9)*s;v<=max+1e-9;v+=s)out.push(+v.toFixed(10));return out}
const nfmt=v=>{const s=Math.abs(v)>=1000?v.toExponential(0):String(+v.toPrecision(6));return s.replace('.',',')};
function plot(opt){
  const W=opt.w||640,H=opt.h||260,m={l:opt.ml||54,r:opt.r||18,t:opt.t||14,b:opt.xlabel?42:26};
  const pw=W-m.l-m.r,ph=H-m.t-m.b,xl=opt.xlog;
  const X=v=>m.l+(xl?(Math.log10(v)-Math.log10(opt.x[0]))/(Math.log10(opt.x[1])-Math.log10(opt.x[0])):(v-opt.x[0])/(opt.x[1]-opt.x[0]))*pw;
  const Y=v=>m.t+(1-(v-opt.y[0])/(opt.y[1]-opt.y[0]))*ph;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${opt.aria||''}"><defs><clipPath id="c${opt.id}"><rect x="${m.l}" y="${m.t}" width="${pw}" height="${ph}"/></clipPath></defs>`;
  const xt=xl?(()=>{const r=[];for(let e=Math.ceil(Math.log10(opt.x[0])-1e-9);e<=Math.log10(opt.x[1])+1e-9;e++)r.push(Math.pow(10,e));return r})():(opt.xticks||niceTicks(opt.x[0],opt.x[1]));
  if(xl){for(let e=Math.floor(Math.log10(opt.x[0]));e<Math.log10(opt.x[1]);e++)for(let k=2;k<10;k++){const v=k*Math.pow(10,e);if(v>opt.x[0]&&v<opt.x[1])s+=`<line class="gr" x1="${X(v)}" x2="${X(v)}" y1="${m.t}" y2="${m.t+ph}" stroke-opacity=".55"/>`}}
  xt.forEach(v=>{s+=`<line class="gr" x1="${X(v)}" x2="${X(v)}" y1="${m.t}" y2="${m.t+ph}"/><text x="${X(v)}" y="${m.t+ph+16}" text-anchor="middle">${nfmt(v)}</text>`});
  (opt.yticks||niceTicks(opt.y[0],opt.y[1])).forEach(v=>{s+=`<line class="gr" x1="${m.l}" x2="${m.l+pw}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${m.l-8}" y="${Y(v)+4}" text-anchor="end">${nfmt(v)}</text>`});
  s+=`<rect class="ax" x="${m.l}" y="${m.t}" width="${pw}" height="${ph}"/>`;
  if(opt.xlabel)s+=`<text x="${m.l+pw/2}" y="${H-6}" text-anchor="middle">${opt.xlabel}</text>`;
  if(opt.ylabel)s+=`<text transform="translate(13 ${m.t+ph/2}) rotate(-90)" text-anchor="middle">${opt.ylabel}</text>`;
  s+=`<g clip-path="url(#c${opt.id})">`;
  (opt.hl||[]).forEach(h=>s+=`<line class="ref" x1="${m.l}" x2="${m.l+pw}" y1="${Y(h)}" y2="${Y(h)}"/>`);
  (opt.tl||[]).forEach(h=>s+=`<line class="tgt" x1="${m.l}" x2="${m.l+pw}" y1="${Y(h)}" y2="${Y(h)}"/>`);
  (opt.vl||[]).forEach(v=>s+=`<line class="ref" x1="${X(v)}" x2="${X(v)}" y1="${m.t}" y2="${m.t+ph}"/>`);
  const lo=opt.y[0]-(opt.y[1]-opt.y[0])*3,hi=opt.y[1]+(opt.y[1]-opt.y[0])*3;
  (opt.series||[]).forEach(se=>{const d=se.pts.filter(p=>isFinite(p[1])&&isFinite(p[0])&&(!xl||p[0]>0)).map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(Math.max(lo,Math.min(hi,p[1]))).toFixed(1)).join('');s+=`<path class="${se.cls}" d="${d}"/>`});
  (opt.dots||[]).forEach(p=>s+=`<circle class="${p.cls||'dot'}" cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.r||4}"/>`);
  s+='</g>';
  (opt.labels||[]).forEach(l=>s+=`<text class="${l.cls||'lab'}" x="${X(l.x)+(l.dx||0)}" y="${Y(l.y)+(l.dy||0)}" text-anchor="${l.a||'start'}">${l.t}</text>`);
  return s+'</svg>'}
const put=(id,html)=>{const el=$(id);if(el)el.innerHTML=html};
function bodePair(id,list,{x=[0.01,100],magR=[-60,60],phR=[-270,-90],wc,w=640,tgt}){
  const phT=[];for(let v=Math.ceil(phR[0]/45)*45;v<=phR[1];v+=45)phT.push(v);
  const mag=plot({id:id+'m',w,h:190,xlog:true,x,y:magR,ylabel:'|L| (dB)',hl:[0],vl:wc?[wc]:[],series:list.map(l=>({pts:l.fr.map(p=>[p.w,p.mag]),cls:l.cls})),dots:list.filter(l=>l.magDot).map(l=>l.magDot)});
  const ph=plot({id:id+'p',w,h:190,xlog:true,x,y:phR,yticks:phT,ylabel:'fase (°)',xlabel:'ω (rad/s)',hl:[-180],tl:tgt!=null?[tgt]:[],vl:wc?[wc]:[],
    series:list.map(l=>({pts:l.fr.map(p=>[p.w,p.ph]),cls:l.cls})),dots:list.filter(l=>l.mfDot).map(l=>l.mfDot)});
  return mag+ph}
function seg(ids,cb){ids.forEach(id=>$(id).addEventListener('click',()=>{ids.forEach(j=>$(j).setAttribute('aria-pressed',j===id));cb(id)}))}

/* ---------- diagramas de bloques ---------- */
function bd(W,H,items){let s=`<svg viewBox="0 0 ${W} ${H}" role="img"><defs>
<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arr" d="M0 0L10 5L0 10z"/></marker>
<marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arr2" d="M0 0L10 5L0 10z"/></marker></defs>`;
  items.forEach(it=>{
    if(it.b){const[x,y,w,h]=it.b;s+=`<rect class="${it.c||'blk'}" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/><text class="bt" x="${x+w/2}" y="${y+h/2+4.5}" text-anchor="middle">${it.t}</text>`;if(it.sub)s+=`<text class="st" x="${x+w/2}" y="${y+h+14}" text-anchor="middle">${it.sub}</text>`}
    else if(it.s){const[x,y]=it.s;s+=`<circle class="sum" cx="${x}" cy="${y}" r="11"/><text class="st" x="${x}" y="${y+4}" text-anchor="middle">Σ</text>`;(it.signs||[]).forEach(g=>s+=`<text class="bt" x="${x+g[1]}" y="${y+g[2]}" text-anchor="middle" style="font-size:12px">${g[0]}</text>`)}
    else if(it.w){s+=`<polyline class="${it.c||'wire'}" points="${it.w.map(p=>p.join(',')).join(' ')}" ${it.end===false?'':`marker-end="url(#${it.c==='wire2'?'ah2':'ah'})"`}/>`}
    else if(it.l){s+=`<text class="${it.c||'st'}" x="${it.l[0]}" y="${it.l[1]}" text-anchor="${it.a||'middle'}">${it.t}</text>`}
    else if(it.d){s+=`<circle cx="${it.d[0]}" cy="${it.d[1]}" r="3" class="arr"/>`}
    else if(it.sat){const[x,y,w,h]=it.sat;s+=`<rect class="blk" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/><polyline class="wire" points="${x+8},${y+h-10} ${x+w/2-8},${y+h-10} ${x+w/2+8},${y+10} ${x+w-8},${y+10}"/>`}
  });return s+'</svg>'}

try{put('dLoop',bd(640,170,[
 {l:[22,66],t:'r',c:'bt'},{w:[[32,70],[108,70]]},{s:[120,70],signs:[['+',-16,-10],['−',10,26]]},
 {w:[[131,70],[200,70]]},{l:[166,62],t:'e'},{b:[200,48,90,44],t:'C(s)',sub:'controlador'},
 {w:[[290,70],[370,70]]},{l:[330,62],t:'u'},{b:[370,48,100,44],t:'G(s)',sub:'planta'},
 {l:[420,18],t:'d (perturbación)'},{w:[[420,24],[420,46]]},
 {w:[[470,70],[600,70]]},{l:[612,74],t:'y',c:'bt'},{d:[540,70]},
 {w:[[540,70],[540,140],[370,140]]},{b:[290,120,80,40],t:'H(s)'},{w:[[290,140],[120,140],[120,82]]},{l:[200,156],t:'medida'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
try{put('dAW',window.__dAW=bd(420,230,[
 {l:[16,54],t:'e',c:'bt'},{w:[[26,58],[62,58]]},{d:[44,58]},
 {b:[62,38,64,40],t:'Kp'},{w:[[44,58],[44,128],[62,128]]},{b:[62,108,64,40],t:'Kp/Ti'},
 {w:[[126,128],[156,128]]},{s:[168,128],signs:[['+',-18,-6],['+',12,26]]},{w:[[179,128],[206,128]]},{b:[206,108,48,40],t:'1/s'},
 {w:[[254,128],[282,128],[282,70]]},{w:[[126,58],[270,58]]},{s:[282,58],signs:[['+',-16,-10],['+',12,-14]]},
 {w:[[293,58],[322,58]]},{l:[306,50],t:'v'},{sat:[322,38,50,40]},{w:[[372,58],[410,58]]},{l:[392,50],t:'u'},
 {d:[306,58]},{d:[392,58]},
 {w:[[392,58],[392,190],[317,190]],c:'wire2'},{w:[[306,58],[306,179]],c:'wire2'},
 {s:[306,190],signs:[['+',20,-8],['−',-12,-14]]},{w:[[295,190],[262,190]],c:'wire2'},{b:[206,170,56,40],t:'1/Tt',c:'blk2'},
 {w:[[206,190],[168,190],[168,140]],c:'wire2'},{l:[244,224],t:'lazo de recálculo: u − v'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
try{put('dFF',bd(680,210,[
 {l:[22,150],t:'ysp',c:'bt'},{w:[[44,146],[96,146]]},{s:[108,146],signs:[['+',-16,-10],['−',10,26]]},{w:[[119,146],[170,146]]},
 {b:[170,124,84,44],t:'C(s)'},{w:[[254,146],[316,146]]},{s:[328,146],signs:[['+',-18,-6],['+',12,-14]]},{w:[[339,146],[390,146]]},
 {b:[390,124,84,44],t:'Gp(s)'},{w:[[474,146],[536,146]]},{s:[548,146],signs:[['+',-18,-6],['+',12,-14]]},{w:[[559,146],[640,146]]},{l:[656,150],t:'y',c:'bt'},
 {l:[220,24],t:'d (medida)',c:'bt'},{w:[[250,20],[280,20]],end:false},{d:[280,20]},
 {w:[[280,20],[280,48]],c:'wire2'},{b:[240,48,80,40],t:'Gff(s)',c:'blk2'},{w:[[280,88],[328,88],[328,135]],c:'wire2'},
 {w:[[280,20],[548,20],[548,48]]},{b:[508,48,80,40],t:'Gd(s)'},{w:[[548,88],[548,135]]},
 {d:[600,146]},{w:[[600,146],[600,196],[108,196],[108,158]]},{l:[360,110],t:'feedforward'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
try{put('dCas',bd(700,230,[
 {l:[18,98],t:'r₁',c:'bt'},{w:[[32,94],[72,94]]},{s:[84,94],signs:[['+',-16,-10],['−',10,26]]},{w:[[95,94],[130,94]]},
 {b:[130,72,72,44],t:'C₁(s)',sub:'primario'},{w:[[202,94],[246,94]]},{l:[224,86],t:'r₂'},
 {s:[258,94],signs:[['+',-16,-10],['−',10,26]]},{w:[[269,94],[300,94]]},{b:[300,72,72,44],t:'C₂(s)',sub:'secundario'},
 {w:[[372,94],[400,94]]},{s:[412,94],signs:[['+',-16,-10],['+',12,-14]]},{w:[[423,94],[450,94]]},
 {b:[450,72,72,44],t:'G₂(s)',sub:'rápido'},{w:[[522,94],[566,94]]},{l:[544,86],t:'y₂'},{b:[566,72,72,44],t:'G₁(s)',sub:'lento'},
 {w:[[638,94],[690,94]]},{l:[690,84],t:'y₁',c:'bt',a:'end'},{l:[412,24],t:'d₂',c:'bt'},{w:[[412,30],[412,82]]},
 {d:[544,94]},{w:[[544,94],[544,160],[258,160],[258,106]]},{l:[400,154],t:'lazo secundario'},
 {d:[668,94]},{w:[[668,94],[668,212],[84,212],[84,106]]},{l:[400,206],t:'lazo primario'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= T0 ================= */
let mode0='m0p';
function draw0(){const Kp=+$('k0').value;$('k0V').textContent=Kp.toFixed(1);const G=sys([1],[5,1]);let I=0;const pts=[],dt=0.02;let y=0;
  for(let k=0;k*dt<=50;k++){const t=k*dt,d=t>=20?-0.4:0,e=1-y;let u;
    if(mode0==='m0open')u=1;else if(mode0==='m0p')u=Kp*e;else{u=Kp*e+I;I+=dt*Kp/3*e}
    adv(G,u+d,dt);y=yout(G);if(k%5===0)pts.push([t,y])}
  put('p0',plot({id:'p0',h:260,x:[0,50],y:[0,1.4],xlabel:'t (s)',ylabel:'temperatura (relativa)',hl:[1],vl:[20],series:[{pts,cls:'s1'}],labels:[{x:20,y:1.3,dx:6,t:'perturbación'}]}));
  const yf=pts[pts.length-1][1],y19=pts.find(p=>p[0]>=19.9)[1];
  $('r0').innerHTML=`<span class="chip">antes de la perturbación: ${fmt(y19,2)}</span><span class="chip ${Math.abs(1-yf)<0.02?'ok':'bad'}">al final: ${fmt(yf,2)} (error ${fmt(1-yf,2)})</span>`;
  $('k0').disabled=mode0==='m0open'}
try{seg(['m0open','m0p','m0pi'],id=>{mode0=id;draw0()});
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('k0').addEventListener('input',draw0);
}catch(__e){if(window.__DBG)console.warn(__e)}try{draw0();
}catch(__e){if(window.__DBG)console.warn(__e)}

function drawVec(){const lw=+$('w0').value,w=Math.pow(10,lw);$('w0V').textContent=w<10?w.toFixed(2):w.toFixed(1);
  const g=div(C(1),C(1,w)),mod=cabs(g),ang=Math.atan2(g.im,g.re)*180/Math.PI;
  const circ=[];for(let t=0;t<=Math.PI+0.01;t+=0.03)circ.push([0.5+0.5*Math.cos(t),-0.5*Math.sin(t)]);
  put('pVec',plot({id:'vec',w:360,h:270,x:[-0.2,1.2],y:[-0.8,0.3],xticks:[0,0.5,1],yticks:[-0.5,0],xlabel:'parte real',ylabel:'parte imaginaria',hl:[0],vl:[0],
    series:[{pts:circ,cls:'ref'},{pts:[[0,0],[g.re,g.im]],cls:'vec'}],dots:[{x:g.re,y:g.im,r:5}],labels:[{x:g.re,y:g.im,dx:8,dy:14,t:`|G| = ${fmt(mod,2)}`,cls:'l2'}]}));
  const ws=logspace(-2,2,200),fr=freq([1],[1,1],ws);
  put('pVecBode',bodePair('vb',[{fr,cls:'s1',magDot:{x:w,y:20*Math.log10(mod)},mfDot:{x:w,y:ang}}],{magR:[-40,5],phR:[-90,0],w:420}));
  $('rw0').innerHTML=`<span class="chip">|G| = ${fmt(mod,3)} = ${fmt(20*Math.log10(mod),1)} dB</span><span class="chip">∠G = ${fmt(ang,1)}°</span>`}
try{$('w0').addEventListener('input',drawVec);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawVec();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= T1 ================= */
function drawTau(){const tau=+$('tau').value;$('tauV').textContent=tau.toFixed(1);const pts=[];for(let t=0;t<=30;t+=0.1)pts.push([t,1-Math.exp(-t/tau)]);
  put('pTau',plot({id:'tau',h:240,x:[0,30],y:[0,1.15],xlabel:'t (s)',ylabel:'y(t)',hl:[1,0.632],vl:[tau,4*tau],series:[{pts,cls:'s1'},{pts:[[0,0],[tau,1]],cls:'s2 dash'}],
    dots:[{x:tau,y:0.632,cls:'dotb'}],labels:[{x:tau,y:0.632,dx:8,dy:16,t:'t = τ → 63,2 %'},{x:4*tau,y:0.3,dx:6,t:'4τ → 98 %'}]}));
  $('rtau').innerHTML=`<span class="chip">polo en s = −${fmt(1/tau,2)}</span><span class="chip">establecimiento ≈ ${fmt(4*tau,1)} s</span>`}
try{$('tau').addEventListener('input',drawTau);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawTau();
}catch(__e){if(window.__DBG)console.warn(__e)}

function step2(z,t){if(z<1){const wd=Math.sqrt(1-z*z);return 1-Math.exp(-z*t)*(Math.cos(wd*t)+z/Math.sqrt(1-z*z)*Math.sin(wd*t))}
  if(Math.abs(z-1)<1e-6)return 1-Math.exp(-t)*(1+t);const a=z-Math.sqrt(z*z-1),b=z+Math.sqrt(z*z-1);return 1-(b*Math.exp(-a*t)-a*Math.exp(-b*t))/(b-a)}
function draw2(){const z=+$('zeta').value;$('zetaV').textContent=z.toFixed(2);const ts=[];for(let t=0;t<=20;t+=0.05)ts.push([t,step2(z,t)]);
  const mp=z<1?Math.exp(-z*Math.PI/Math.sqrt(1-z*z)):0,mf=Math.atan(2*z/Math.sqrt(Math.sqrt(1+4*z**4)-2*z*z))*180/Math.PI;
  put('pStep2',plot({id:'s2',w:420,h:250,x:[0,20],y:[0,2],xlabel:'t (s)',ylabel:'y(t)',hl:[1],series:[{pts:ts,cls:'s1'}],dots:z<1?[{x:Math.PI/Math.sqrt(1-z*z),y:1+mp}]:[]}));
  const p=z<1?[[-z,Math.sqrt(1-z*z)],[-z,-Math.sqrt(1-z*z)]]:[[-z+Math.sqrt(z*z-1),0],[-z-Math.sqrt(z*z-1),0]];
  const circ=[];for(let a=Math.PI/2;a<=3*Math.PI/2+0.01;a+=0.05)circ.push([Math.cos(a),Math.sin(a)]);
  put('pPoles',plot({id:'pp',w:300,h:250,x:[-3,0.5],y:[-1.5,1.5],xticks:[-3,-2,-1,0],yticks:[-1,0,1],xlabel:'Re(s)',ylabel:'Im(s)',vl:[0],hl:[0],series:[{pts:circ,cls:'ref'}].concat(z<1?[{pts:[[0,0],p[0]],cls:'sm dash'}]:[]),dots:p.map(q=>({x:q[0],y:q[1],r:5}))}));
  $('zetaR').innerHTML=`<span class="chip">Mp = ${fmt(mp*100,1)} %</span><span class="chip">ts ≈ ${fmt(4/z,1)} s</span><span class="chip ${z>=0.4&&z<=0.8?'ok':'bad'}">MF ≈ ${fmt(mf,0)}°</span>`}
try{$('zeta').addEventListener('input',draw2);
}catch(__e){if(window.__DBG)console.warn(__e)}try{draw2();
}catch(__e){if(window.__DBG)console.warn(__e)}

let ty='ty0',inp='inS';
function drawType(){const K=+$('kty').value;$('ktyV').textContent=K.toFixed(1);const L=ty==='ty0'?[[K],[1,1]]:[[K],[1,1,0]];
  const S=sys(L[0],padd(L[1],L[0]));const T=20,dt=0.005,pts=[],ref=[];let y=0;
  for(let k=0;k*dt<=T;k++){const t=k*dt,r=inp==='inS'?1:t;adv(S,r,dt);y=yout(S);if(k%20===0){pts.push([t,y]);ref.push([t,r])}}
  const r=inp==='inS'?1:T,e=r-y;const th=ty==='ty0'?(inp==='inS'?1/(1+K):Infinity):(inp==='inS'?0:1/K);
  put('pType',plot({id:'ty',h:250,x:[0,T],y:inp==='inS'?[0,1.6]:[0,22],xlabel:'t (s)',ylabel:'y(t)',series:[{pts:ref,cls:'sm dash'},{pts,cls:'s1'}]}));
  $('rty').innerHTML=`<span class="chip">error final ≈ ${fmt(e,3)}</span><span class="chip">teórico: ${isFinite(th)?fmt(th,3):'∞ (crece sin límite)'}</span>`}
try{seg(['ty0','ty1'],id=>{ty=id;drawType()});
}catch(__e){if(window.__DBG)console.warn(__e)}try{seg(['inS','inR'],id=>{inp=id;drawType()});
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('kty').addEventListener('input',drawType);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawType();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= T2 ================= */
function simPID({Kp,Ti=1e9,Td=0,umax=null,Tt=null,T=25,dt=0.005,N=10,b=1,dOnE=false,plant=[[1],[1,3,3,1]]}){const P=sys(...plant);let I=0,D=0,ep=0,yp=0;const Y=[],U=[];
  for(let k=0;k*dt<=T;k++){const y=yout(P),r=1,e=r-y;
    const sig=dOnE?e:-y,sigp=dOnE?ep:-yp; if(Td>0)D=(Td/(Td+N*dt))*D+Kp*Td*N/(Td+N*dt)*(sig-sigp);
    if(k===0&&!dOnE)D=0;
    const v=Kp*(b*r-y)+I+D;const u=umax===null?v:Math.max(-umax,Math.min(umax,v));I+=dt*(Kp/Ti*e+(Tt?(u-v)/Tt:0));ep=e;yp=y;
    adv(P,u,dt);if(k%10===0){Y.push([k*dt,y]);U.push([k*dt,u])}}
  return{Y,U}}
function metrics(Y){const yf=Y[Y.length-1][1];const mx=Math.max(...Y.map(p=>p[1]));let ts=0;for(let i=Y.length-1;i>=0;i--)if(Math.abs(Y[i][1]-yf)>0.02*Math.max(Math.abs(yf),0.05)){ts=Y[i][0];break}
  return{yf,mp:yf>0?Math.max(0,(mx-yf)/yf*100):0,ts}}
function drawPlay(){const Kp=+$('pk').value,Ti=+$('pi').value,Td=+$('pd').value;$('pkV').textContent=Kp.toFixed(1);$('piV').textContent=Ti>=19.95?'∞':Ti.toFixed(1);$('pdV').textContent=Td.toFixed(2);
  const r=simPID({Kp,Ti:Ti>=19.95?1e9:Ti,Td,T:40});const m=metrics(r.Y);const unstable=Math.max(...r.Y.map(p=>Math.abs(p[1])))>5;
  put('pPlay',plot({id:'play',h:270,x:[0,40],y:[0,2],xlabel:'t (s)',ylabel:'y(t)',hl:[1],series:[{pts:r.Y,cls:'s1'}]}));
  $('rpid').innerHTML=unstable?`<span class="chip bad">inestable: la salida crece sin límite</span>`:`<span class="chip ${m.mp<25?'ok':'bad'}">sobrepico ${fmt(m.mp,0)} %</span><span class="chip">establecimiento (2 %) ${m.ts>=39?'> 40':fmt(m.ts,1)} s</span><span class="chip ${Math.abs(1-m.yf)<0.01?'ok':'bad'}">error final ${fmt(1-m.yf,3)}</span>`}
try{['pk','pi','pd'].forEach(id=>$(id).addEventListener('input',()=>{['prP','prPI','prPID'].forEach(j=>$(j).setAttribute('aria-pressed',false));drawPlay()}));
}catch(__e){if(window.__DBG)console.warn(__e)}
const presets={prP:[4,20,0],prPI:[3.6,3.0,0],prPID:[4.8,1.8,0.45]};
try{seg(['prP','prPI','prPID'],id=>{const[a,b,c]=presets[id];$('pk').value=a;$('pi').value=b;$('pd').value=c;drawPlay()});
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawPlay();
}catch(__e){if(window.__DBG)console.warn(__e)}

function drawWind(){const um=+$('umax').value;$('umaxV').textContent=um.toFixed(2);const aw=$('awOn').checked;
  const n=simPID({Kp:3.6,Ti:3.02,umax:um,T:30}),a=simPID({Kp:3.6,Ti:3.02,umax:um,Tt:aw?1.5:null,T:30});
  const yS=plot({id:'wy',w:420,h:200,x:[0,30],y:[0,1.6],ylabel:'y(t)',hl:[1],series:[{pts:n.Y,cls:'s4'},{pts:a.Y,cls:'s1'}]});
  const uS=plot({id:'wu',w:420,h:170,x:[0,30],y:[-1,4.5],ylabel:'u(t)',xlabel:'t (s)',hl:[um,-um],series:[{pts:n.U,cls:'s4'},{pts:a.U,cls:'s1'}]});
  put('pWind',yS+uS)}
try{$('umax').addEventListener('input',drawWind);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('awOn').addEventListener('change',drawWind);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawWind();
}catch(__e){if(window.__DBG)console.warn(__e)}

function drawKick(){const b=+$('bw2').value;$('bw2V').textContent=b.toFixed(2);
  const e=simPID({Kp:4.8,Ti:1.814,Td:0.4535,dOnE:true,T:15,dt:0.002}),m=simPID({Kp:4.8,Ti:1.814,Td:0.4535,b,T:15,dt:0.002});
  put('pKickY',plot({id:'ky',w:420,h:240,x:[0,15],y:[0,1.8],xlabel:'t (s)',ylabel:'y(t)',hl:[1],series:[{pts:e.Y,cls:'s4'},{pts:m.Y,cls:'s1'}]}));
  put('pKickU',plot({id:'ku',w:420,h:240,x:[0,15],y:[-4,12],xlabel:'t (s)',ylabel:'u(t)',hl:[0],series:[{pts:e.U,cls:'s4'},{pts:m.U,cls:'s1'}],labels:[{x:0.3,y:11,t:'patada',cls:'l4'}]}))}
try{$('bw2').addEventListener('input',drawKick);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawKick();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= T3 ================= */
try{{const zn=[];for(let t=0;t<=10;t+=0.05)zn.push([t,1-Math.exp(-t)*(1+t+t*t/2)]);
 const yi=1-5*Math.exp(-2),sl=2*Math.exp(-2),L=2-yi/sl,TT=(2+(1-yi)/sl)-L;
 put('pZN',plot({id:'zn',h:260,x:[0,10],y:[0,1.15],xlabel:'t (s)',ylabel:'y(t)',hl:[1],vl:[L,L+TT],series:[{pts:zn,cls:'s1'},{pts:[[L-0.3,-0.3*sl],[L+TT+0.4,1+0.4*sl]],cls:'s2 dash'}],dots:[{x:2,y:yi,cls:'dotb'}],
  labels:[{x:2,y:yi,dx:10,dy:14,t:'inflexión'},{x:L,y:1.06,dx:4,t:`L = ${fmt(L,2)} s`,cls:'l2'},{x:L+TT,y:0.15,dx:6,t:`L + T = ${fmt(L+TT,2)} s`,cls:'l2'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}
function drawKcr(){const K=+$('kcr').value;$('kcrV').textContent=K.toFixed(1);const S=sys([K],padd([1,3,3,1],[K]));const pts=[];const dt=0.01;
  for(let k=0;k*dt<=40;k++){adv(S,1,dt);if(k%10===0)pts.push([k*dt,yout(S)])}
  const st=K<7.9?'amortigua: estable':K<=8.1?'oscilación sostenida: ¡ganancia crítica!':'crece: inestable';
  put('pKcr',plot({id:'kc',h:250,x:[0,40],y:[-0.5,2.5],xlabel:'t (s)',ylabel:'y(t)',hl:[K/(1+K)],series:[{pts,cls:'s1'}]}));
  $('rkcr').innerHTML=`<span class="chip ${K<7.9?'ok':K<=8.1?'':'bad'}">${st}</span><span class="chip">exacto: Kcr = 8 · Pcr = 3,63 s</span>`}
try{$('kcr').addEventListener('input',drawKcr);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawKcr();
}catch(__e){if(window.__DBG)console.warn(__e)}
function drawRelay(){const d=+$('rd').value;$('rdV').textContent=d.toFixed(1);const S=sys([1],[1,3,3,1]);const Y=[],U=[];const dt=0.005;let u=d;const ups=[];let lastSign=1,ymax=-1e9,ymin=1e9;
  for(let k=0;k*dt<=30;k++){const t=k*dt,y=yout(S),e=-y;const nu=e>=0?d:-d;if(nu>0&&u<0&&t>8)ups.push(t);u=nu;if(t>15){ymax=Math.max(ymax,y);ymin=Math.min(ymin,y)}adv(S,u,dt);if(k%10===0){Y.push([t,y]);U.push([t,u])}}
  const a=(ymax-ymin)/2,Ku=4*d/(Math.PI*a);const per=ups.length>2?(ups[ups.length-1]-ups[1])/(ups.length-2):NaN;
  put('pRelay',plot({id:'rl',h:250,x:[0,30],y:[-2.2,2.2],xlabel:'t (s)',ylabel:'u, y',hl:[0],series:[{pts:U,cls:'s2'},{pts:Y,cls:'s1'}]}));
  $('rrel').innerHTML=`<span class="chip">a = ${fmt(a,3)}</span><span class="chip">Ku ≈ 4d/(πa) = ${fmt(Ku,2)}</span><span class="chip">Pu ≈ ${fmt(per,2)} s</span>`}
try{$('rd').addEventListener('input',drawRelay);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawRelay();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= T4 ================= */
function simFF(useFF,g){const Gp=sys([1],[5,1]),Gd=sys([1],[2,1]),Ff=sys([-5*g,-g],[2,1]);let I=0;const Y=[];const dt=0.01;
  for(let k=0;k*dt<=40;k++){const t=k*dt,d=t>=5?1:0;const y=yout(Gp)+yout(Gd);const e=-y;const uff=useFF?out(Ff,d):0;adv(Ff,d,dt);const u=2*e+I+uff;I+=dt*2/5*e;adv(Gp,u,dt);adv(Gd,d,dt);if(k%10===0)Y.push([t,y])}
  return Y}
function drawFF(){const g=+$('ffG').value/100;$('ffGV').textContent=Math.round(g*100);const on=$('ffOn').checked;const a=simFF(false,0),b=simFF(on,g);
  const pk=Y=>Math.max(...Y.map(p=>Math.abs(p[1])));
  put('pFF',plot({id:'ff',h:250,x:[0,40],y:[-0.3,0.5],xlabel:'t (s)',ylabel:'desviación de y',hl:[0],vl:[5],series:[{pts:a,cls:'s4'},{pts:b,cls:'s1'}]}));
  $('rff').innerHTML=`<span class="chip bad">solo feedback: pico ${fmt(pk(a),3)}</span><span class="chip ok">elegido: pico ${fmt(pk(b),3)}</span>`}
try{$('ffG').addEventListener('input',drawFF);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('ffOn').addEventListener('change',drawFF);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawFF();
}catch(__e){if(window.__DBG)console.warn(__e)}
function simCas(cascade,Kc2){const G2=sys([1],[1,1]),G1=sys([1],[10,1]);let I=0;const Y=[];const dt=0.005;const Kp=cascade?2:1.5,Ti=cascade?8:10;
  for(let k=0;k*dt<=60;k++){const t=k*dt,d2=t>=5?1:0;const y2=yout(G2),y1=yout(G1);const e=-y1;const c1=Kp*e+I;I+=dt*Kp/Ti*e;const u=cascade?Kc2*(c1-y2):c1;adv(G2,u+d2,dt);adv(G1,y2,dt);if(k%20===0)Y.push([t,y1])}
  return Y}
function drawCas(){const K=+$('kc2').value;$('kc2V').textContent=K;const a=simCas(false,K),b=simCas(true,K);const pk=Y=>Math.max(...Y.map(p=>Math.abs(p[1])));
  put('pCas',plot({id:'cs',h:250,x:[0,60],y:[-0.2,0.6],xlabel:'t (s)',ylabel:'desviación de y₁',hl:[0],vl:[5],series:[{pts:a,cls:'s4'},{pts:b,cls:'s1'}]}));
  $('rcas').innerHTML=`<span class="chip bad">un lazo: pico ${fmt(pk(a),3)}</span><span class="chip ok">cascada: pico ${fmt(pk(b),3)}</span>`}
try{$('kc2').addEventListener('input',drawCas);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawCas();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= T5 ================= */
let ws;try{ws=logspace(-2,2,600);}catch(__e){if(window.__DBG)console.warn(__e)}
function drawSine(){const w=Math.pow(10,+$('ws').value);$('wsV').textContent=w<10?w.toFixed(2):w.toFixed(1);const g=div(C(1),pval([1,2,1],C(0,w))),A=cabs(g);let ph=-2*Math.atan(w);
  const Tp=2*Math.PI/w,tmax=3*Tp,xin=[],yo=[];for(let i=0;i<=400;i++){const t=tmax*i/400;xin.push([t,Math.sin(w*t)]);yo.push([t,A*Math.sin(w*t+ph)])}
  put('pSine',plot({id:'sn',w:420,h:250,x:[0,tmax],y:[-1.2,1.2],xlabel:'t (s)',ylabel:'x(t), y(t)',hl:[0],series:[{pts:xin,cls:'sm'},{pts:yo,cls:'s1'}]}));
  const fr=freq([1],[1,2,1],logspace(-1,1.3,200));
  put('pSineB',bodePair('sb',[{fr,cls:'s1',magDot:{x:w,y:20*Math.log10(A)},mfDot:{x:w,y:ph*180/Math.PI}}],{x:[0.1,20],magR:[-60,5],phR:[-180,0],w:420}));
  $('rws').innerHTML=`<span class="chip">amplitud × ${fmt(A,3)}</span><span class="chip">desfase ${fmt(ph*180/Math.PI,1)}°</span><span class="chip">retraso ${fmt(-ph/w,2)} s</span>`}
try{$('ws').addEventListener('input',drawSine);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawSine();
}catch(__e){if(window.__DBG)console.warn(__e)}
function drawK(){const K=Math.pow(10,+$('kB').value);$('kBV').textContent=fmt(K,1);const fr=freq([4*K],[1,2,0],ws),mg=margins(fr);
  put('pBodeK',bodePair('bk',[{fr,cls:'s1',mfDot:mg.wc?{x:mg.wc,y:mg.mf-180}:null}],{magR:[-40,80],phR:[-180,-90],wc:mg.wc}));
  $('kBR').innerHTML=`<span class="chip">Kv = ${fmt(2*K,1)} s⁻¹</span><span class="chip">ωc = ${fmt(mg.wc||0,2)} rad/s</span><span class="chip ${mg.mf>=50?'ok':'bad'}">MF = ${fmt(mg.mf||0,1)}°</span><span class="chip">MG = ∞</span>`}
try{$('kB').addEventListener('input',drawK);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawK();
}catch(__e){if(window.__DBG)console.warn(__e)}
function drawNyq(){const K=+$('kN').value;$('kNV').textContent=K.toFixed(1);const den=pm([1,0],[1,1],[0.5,1]);const fr=freq([K],den,logspace(-1.3,2,900));const pts=fr.map(p=>[p.g.re,p.g.im]);
  const uc=[];for(let t=0;t<=2*Math.PI+0.01;t+=0.05)uc.push([Math.cos(t),Math.sin(t)]);const mg=margins(fr);
  put('pNyq',plot({id:'nq',h:300,x:[-4,1],y:[-3,0.6],xticks:[-4,-3,-2,-1,0,1],yticks:[-3,-2,-1,0],xlabel:'Re L(jω)',ylabel:'Im L(jω)',hl:[0],vl:[0],
    series:[{pts:uc,cls:'ref'},{pts,cls:K<3?'s1':'s4'}],dots:[{x:-1,y:0,r:5,cls:'dotb'},{x:-K/3,y:0,r:3.5}],labels:[{x:-1,y:0,dx:-6,dy:-10,t:'−1',a:'end'}]}));
  $('rN').innerHTML=`<span class="chip ${K<3?'ok':'bad'}">${K<2.95?'no rodea −1: estable':K<=3.05?'pasa por −1: límite':'rodea −1: inestable'}</span><span class="chip">corte en −${fmt(K/3,2)}</span><span class="chip">MG = ${fdb(mg.mg)}</span><span class="chip">MF = ${mg.mf!=null?fmt(mg.mf,1)+'°':'—'}</span>`}
try{$('kN').addEventListener('input',drawNyq);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawNyq();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* hero */
const G726=[[40],[1,2,0]],L726=[pm([41.7*4],[1,4.41]),pm([1,2,0],[1,18.4])];
try{{const a=freq(G726[0],G726[1],ws),b=freq(L726[0],L726[1],ws),mb=margins(b);
 put('heroBode',bodePair('hb',[{fr:a,cls:'sm dash'},{fr:b,cls:'s1',mfDot:{x:mb.wc,y:mb.mf-180}}],{magR:[-40,80],phR:[-180,-90],wc:mb.wc,w:520}))}
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= T6 ================= */
function drawLead(){const a=+$('la').value,wm=Math.pow(10,+$('lw').value);$('laV').textContent=a.toFixed(2);$('lwV').textContent=wm.toFixed(1);
  const T=1/(wm*Math.sqrt(a));const num=pm([40],[T,1]),den=pm([1,2,0],[a*T,1]);const g0=freq(G726[0],G726[1],ws),g1=freq(num,den,ws),m=margins(g1);
  const phi=Math.asin((1-a)/(1+a))*180/Math.PI;
  put('pLead',bodePair('ld',[{fr:g0,cls:'s4 dash'},{fr:g1,cls:'s1',mfDot:m.wc?{x:m.wc,y:m.mf-180}:null}],{magR:[-40,80],phR:[-180,-90],wc:m.wc,tgt:-130}));
  $('rla').innerHTML=`<span class="chip">φm = ${fmt(phi,1)}° en ωm</span><span class="chip">cero ${fmt(1/T,2)} · polo ${fmt(1/(a*T),2)}</span><span class="chip">ωc = ${fmt(m.wc,2)} rad/s</span><span class="chip ${m.mf>=50?'ok':'bad'}">MF = ${fmt(m.mf,1)}° ${m.mf>=50?'✓':'(objetivo 50°)'}</span>`}
try{['la','lw'].forEach(id=>$(id).addEventListener('input',drawLead));
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('laOg').addEventListener('click',()=>{$('la').value=0.24;$('lw').value=Math.log10(9);drawLead()});
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawLead();
}catch(__e){if(window.__DBG)console.warn(__e)}
const G727=[[5],pm([1,0],[1,1],[0.5,1])];
function drawLag(){const b=+$('gb').value,z=Math.pow(10,+$('gz').value);$('gbV').textContent=b.toFixed(1);$('gzV').textContent=z.toFixed(3);
  const T=1/z;const num=pm(G727[0],[T,1]),den=pm(G727[1],[b*T,1]);const wl=logspace(-3,2,700);const g0=freq(G727[0],G727[1],wl),g1=freq(num,den,wl),m=margins(g1),m0=margins(g0);
  put('pLag',bodePair('lg',[{fr:g0,cls:'s4 dash'},{fr:g1,cls:'s1',mfDot:m.wc?{x:m.wc,y:m.mf-180}:null}],{x:[0.001,100],magR:[-60,100],phR:[-270,-90],wc:m.wc,tgt:-140}));
  const ok=m.mf>=40&&m.mg>=10;
  $('rgb').innerHTML=`<span class="chip">baja ${fmt(20*Math.log10(b),1)} dB</span><span class="chip">cero ${fmt(z,3)} · polo ${fmt(z/b,4)}</span><span class="chip">ωc = ${fmt(m.wc,2)} rad/s</span><span class="chip ${m.mf>=40?'ok':'bad'}">MF = ${fmt(m.mf,1)}°</span><span class="chip ${m.mg>=10?'ok':'bad'}">MG = ${fdb(m.mg)}</span><span class="chip ${ok?'ok':'bad'}">${ok?'cumple':'no cumple'}</span>`}
try{['gb','gz'].forEach(id=>$(id).addEventListener('input',drawLag));
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('gbOg').addEventListener('click',()=>{$('gb').value=10;$('gz').value=-1;drawLag()});
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawLag();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= Calculadora ================= */
function parsePoly(str){let s=str.replace(/\s+/g,'').replace(/,/g,'.').replace(/·|\*/g,'');let i=0;
  const peek=()=>s[i];
  function number(){const m=/^\d*\.?\d+(e[+-]?\d+)?/i.exec(s.slice(i));if(!m)return null;i+=m[0].length;return parseFloat(m[0])}
  function power(p){if(peek()==='^'){i++;const n=number();if(n===null||!Number.isInteger(n)||n<0||n>12)throw Error('Potencia no válida');let r=[1];for(let k=0;k<n;k++)r=pmul(r,p);return r}return p}
  function factor(){if(peek()==='('){i++;const p=sum();if(peek()!==')')throw Error('Falta un paréntesis de cierre');i++;return power(p)}
    if(peek()==='s'){i++;return power([1,0])}const n=number();if(n===null)throw Error(`No entiendo «${s.slice(i,i+6)||'final'}»`);return power([n])}
  function product(){let p=factor();while(i<s.length&&(peek()==='('||peek()==='s'||/[\d.]/.test(peek())))p=pmul(p,factor());return p}
  function sum(){let sign=1;if(peek()==='+'){i++}else if(peek()==='-'){i++;sign=-1}let p=product().map(v=>v*sign);
    while(peek()==='+'||peek()==='-'){const sg=peek()==='-'?-1:1;i++;p=padd(p,product().map(v=>v*sg))}return p}
  if(!s)throw Error('Campo vacío');const r=sum();if(i<s.length)throw Error(`Sobra «${s.slice(i)}»`);
  while(r.length>1&&Math.abs(r[0])<1e-14)r.shift();return r}
function calc(){const err=$('cErr');try{const K=+$('cK').value||1;const num=parsePoly($('cNum').value).map(v=>v*K),den=parsePoly($('cDen').value);
  if(num.length>den.length)throw Error('El numerador tiene más grado que el denominador');err.hidden=true;
  const wl=logspace(-3,3,1500),fr=freq(num,den,wl),m=margins(fr);
  /* constantes de error */
  let n0=0;for(let k=den.length-1;k>=0&&Math.abs(den[k])<1e-14;k--)n0++;const dr=den.slice(0,den.length-n0);const k0=num[num.length-1]/dr[dr.length-1];
  const kp=n0===0?k0:Infinity,kv=n0===0?0:n0===1?k0:Infinity;
  /* ancho de banda en lazo cerrado */
  const cl=padd(den,num);const t0=cabs(div(pval(num,C(0,1e-6)),pval(cl,C(0,1e-6))));let bw=null;const Tm=w=>cabs(div(pval(num,C(0,w)),pval(cl,C(0,w))))-t0/Math.SQRT2;for(let i=1;i<wl.length;i++){if(Tm(wl[i])<0){let a=wl[i-1],b=wl[i];for(let k=0;k<40;k++){const c=Math.sqrt(a*b);if(Tm(c)<0)b=c;else a=c}bw=Math.sqrt(a*b);break}}
  const rts=cl.length;const stable=routhStable(cl);
  const w=+$('cW').value,A=+$('cA').value;const fw=freq(num,den,logspace(-4,Math.log10(Math.max(w,1e-3)),800));const gw=fw[fw.length-1];
  $('cOut').innerHTML=`<span class="chip">tipo ${n0}</span><span class="chip">Kp = ${isFinite(kp)?fmt(kp,3):'∞'}</span><span class="chip">Kv = ${isFinite(kv)?fmt(kv,3):'∞'}</span>`+
    `<span class="chip">ωc = ${m.wc?fmt(m.wc,3):'—'}</span><span class="chip ${m.mf!=null&&m.mf>0?'ok':'bad'}">MF = ${m.mf!=null?fmt(m.mf,2)+'°':'—'}</span><span class="chip">ω180 = ${m.w180?fmt(m.w180,3):'—'}</span><span class="chip ${m.mg>0?'ok':'bad'}">MG = ${fdb(m.mg)}</span>`+
    `<span class="chip ${stable?'ok':'bad'}">lazo cerrado ${stable?'estable':'inestable'}</span><span class="chip">BW = ${stable&&bw?fmt(bw,3)+' rad/s':'—'}</span>`+
    `<span class="chip">senoide: y = ${fmt(A*cabs(gw.g),4)}·sen(${fmt(w,2)}t ${gw.ph<0?'−':'+'} ${fmt(Math.abs(gw.ph),1)}°)</span>`;
  const mags=fr.map(p=>p.mag).filter(isFinite),phs=fr.map(p=>p.ph);const lo=Math.max(-120,Math.floor(Math.min(...fr.filter(p=>p.w<=300).map(p=>p.mag))/20)*20),hi=Math.min(140,Math.ceil(Math.max(...fr.filter(p=>p.w>=0.003).map(p=>p.mag))/20)*20);
  const pl=Math.floor(Math.min(...phs)/90)*90,ph=Math.ceil(Math.max(...phs)/90)*90;
  put('cBode',bodePair('cb',[{fr,cls:'s1',mfDot:m.wc?{x:m.wc,y:m.mf-180}:null}],{x:[0.001,1000],magR:[Math.min(lo,-20),Math.max(hi,20)],phR:[Math.min(pl,-180),Math.max(ph,0)],wc:m.wc}));nyqInto('cNyq',num,den)
 }catch(e){err.textContent=e.message;err.hidden=false}}
function routhStable(p){p=p.slice();if(p[0]<0)p=p.map(v=>-v);const n=p.length;if(p.some(v=>v<=0))return false;let r1=p.filter((_,i)=>i%2===0),r2=p.filter((_,i)=>i%2===1);
  for(let k=0;k<n-2;k++){if(!r2.length)break;const nr=[];for(let j=0;j<r1.length-1;j++){nr.push((r2[0]*r1[j+1]-r1[0]*(r2[j+1]||0))/r2[0])}if(!nr.length)break;if(nr[0]<=0)return false;r1=r2;r2=nr}return true}
try{['cNum','cDen','cK','cW','cA'].forEach(id=>$(id).addEventListener('input',calc));
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('cForm').addEventListener('submit',e=>e.preventDefault());
}catch(__e){if(window.__DBG)console.warn(__e)}try{calc();
}catch(__e){if(window.__DBG)console.warn(__e)}
function load(n,d,k,w,a){if(!document.getElementById('cNum')){location.href='calculadora.html#calc='+encodeURIComponent(JSON.stringify([n,d,k,w,a]));return}$('cNum').value=n;$('cDen').value=d;$('cK').value=k||1;if(w)$('cW').value=w;if(a)$('cA').value=a;calc();$('calculadora').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}

/* ================= Ejercicios ================= */
function exCard(e,kind){const tag=`<span class="tag ${kind}">${e.src}</span>`;
  const ap=e.ap?`<ol class="ap">${e.ap.map(x=>`<li>${x}</li>`).join('')}</ol>`:'';
  const chk=e.chk?`<button class="btn" type="button" data-chk='${JSON.stringify(e.chk)}'>Comprobar en la calculadora</button>`:'';
  return `<article class="ex"><div class="ex-top"><h4>${e.t}</h4>${tag}<span class="tag">${e.tema}</span></div><div class="enun">${e.q}</div>${ap}
  <details class="sol"><summary>Ver solución paso a paso</summary><div class="body">${e.s}${chk?`<div>${chk}</div>`:''}</div></details></article>`}
const EX=[
{t:'Problema de frecuencia: G(s) = 30/(s²+2s+1)',src:'Sept 2015 · 4 pts',tema:'T5 · T6',q:'<p>Sistema en lazo cerrado con G(s) = 30/(s² + 2s + 1) = 30/(s+1)² y H(s) = 1.</p>',
 ap:['¿Cuál es el MF actual?','¿Y el ancho de banda?','Calcular un compensador de adelanto para conseguir un MF de 50°. ¿Qué MG tiene el sistema compensado?','Calcular un compensador de atraso para conseguir un MF de 50°. ¿Qué MG tiene el sistema compensado?'],
 s:`<ol><li><b>a)</b> Cruce de ganancia: |G(jω)| = 30/(1+ω²) = 1 → ω² = 29 → <b>ω<sub>c</sub> = 5,385 rad/s</b>. Fase: ∠G = −2·arctan(5,385) = −158,96°. <b>MF = 180° − 158,96° = 21,04°</b>.</li>
<li><b>b)</b> Lazo cerrado: T(s) = 30/(s² + 2s + 31), con |T(0)| = 30/31. Se busca |T(jω)| = (30/31)/√2, es decir, (31 − ω²)² + 4ω² = 2·31² = 1922. Con x = ω²: x² − 58x − 961 = 0 → x = 71,4 → <b>ω<sub>b</sub> = 8,45 rad/s</b>.</li>
<li><b>c) Adelanto.</b> No hay requisito de error, así que K = 1 y G₁ = G. Fase a añadir: φ<sub>m</sub> = 50° − 21° + 8° = 37° → α = (1 − sen 37°)/(1 + sen 37°) = 0,249. Nueva ω<sub>c</sub>: |G| = −10·log(1/0,249) = −6,04 dB → 30/(1+ω²) = 0,499 → <b>ω<sub>m</sub> = 7,69 rad/s</b>. T = 1/(ω<sub>m</sub>√α) = 0,261 s; αT = 0,065 s.</li>
<li>G<sub>c</sub>(s) = (0,261s + 1)/(0,065s + 1), en notación del Ogata 4,02·(s + 3,84)/(s + 15,4). Resultado: <b>MF = 51,8°</b>. <b>MG = ∞</b>: la planta es de orden 2 y el adelanto no la hace cruzar −180°.</li>
<li><b>d) Atraso.</b> Fase objetivo −180° + 50° + 5° = −125° → −2·arctan ω = −125° → <b>ω<sub>c</sub> = tan 62,5° = 1,92 rad/s</b>. Ahí |G| = 30/(1 + 3,69) = 6,40 → <b>β = 6,40</b> (16,1 dB). Cero una década por debajo: 1/T = 0,192 → T = 5,21 s, βT = 33,3 s.</li>
<li>G<sub>c</sub>(s) = (5,21s + 1)/(33,3s + 1). Resultado: <b>MF = 50,1°</b>, <b>MG = ∞</b>.</li></ol>
<p class="res">Comparación: con adelanto ω<sub>c</sub> ≈ 7,7 rad/s (rápido); con atraso ω<sub>c</sub> ≈ 1,9 rad/s (unas 4 veces más lento, pero filtra el ruido).</p>`,chk:['30','(s+1)^2',1,5,1]},
{t:'Mínimo compensador con ζ y ωn',src:'Problemas de examen · 3 pts',tema:'T1 · T5',q:'<p>Sistema en lazo cerrado con G(s) = ω<sub>n</sub>²/(s(s + 2ζω<sub>n</sub>)) y H(s) = 1.</p>',
 ap:['¿Cuál es el MF actual, en función de ζ?','¿Y el ancho de banda?','Si ζ = 0,1 y ω<sub>n</sub> = 1, calcular el mínimo compensador para conseguir un MF de 50°. ¿Qué MG tiene el sistema compensado?'],
 s:`<ol><li><b>a)</b> |G(jω)| = ω<sub>n</sub>²/(ω·√(ω² + 4ζ²ω<sub>n</sub>²)) = 1 da una bicuadrada: ω⁴ + 4ζ²ω<sub>n</sub>²ω² − ω<sub>n</sub>⁴ = 0 → ω<sub>c</sub> = ω<sub>n</sub>·√(√(1+4ζ⁴) − 2ζ²). La fase es −90° − arctan(ω<sub>c</sub>/(2ζω<sub>n</sub>)), así que <b>MF = arctan(2ζ/√(√(1+4ζ⁴) − 2ζ²))</b>. No depende de ω<sub>n</sub>.</li>
<li><b>b)</b> El lazo cerrado es el segundo orden estándar: <b>ω<sub>b</sub> = ω<sub>n</sub>·√(1 − 2ζ² + √(4ζ⁴ − 4ζ² + 2))</b>.</li>
<li><b>c)</b> Con ζ = 0,1 y ω<sub>n</sub> = 1: G = 1/(s(s + 0,2)), y el MF actual es de solo 11,4°. El mínimo compensador es una ganancia K. Se busca dónde la fase vale −130°: −90° − arctan(ω/0,2) = −130° → ω = 0,2·tan 40° = <b>0,1678 rad/s</b>.</li>
<li>Se elige K para que ahí cruce 0 dB: K = ω·√(ω² + 0,04) = <b>K = 0,0438</b>. El MG sigue siendo ∞ (orden 2).</li></ol>
<p class="res">C(s) = 0,0438. Bajar la ganancia mueve el cruce a donde el polo en −0,2 aún no ha quitado mucha fase.</p>`,chk:['1','s(s+0.2)',0.0438,0.1678,1]},
{t:'Problema completo: G(s) = K/(s(s+1)²(s+3))',src:'Junio 2013',tema:'T5 · T6',q:'<p>Sistema en lazo cerrado con G(s) = K/(s(s+1)²(s+3)) y H(s) = 1.</p>',
 ap:['Hallar la K más sencilla que cumpla un error a rampa ≤ 0,1.','Hallar MF y MG para K = 3.','Hallar un compensador para conseguir MF = 50° (con K = 3).','Hallar el ancho de banda (K = 3).'],
 s:`<ol><li><b>a)</b> Tipo 1: K<sub>v</sub> = lím s·G = K/3. e = 3/K ≤ 0,1 → <b>K ≥ 30</b>. Con K = 30 el sistema es inestable (MF ≈ −66°): habría que compensar mucho.</li>
<li><b>b)</b> Con K = 3: ω<sub>c</sub> = 0,672 rad/s y fase −170,4° → <b>MF = 9,6°</b>. Para el MG, el denominador en jω vale (ω⁴ − 7ω²) + j(3ω − 5ω³); la parte imaginaria se anula en ω<sub>180</sub> = √(3/5) = 0,775 rad/s. Ahí |G| = 3/|ω⁴ − 7ω²| = 3/3,84 = 0,781 → <b>MG = 2,14 dB</b>. Estable, pero al límite.</li>
<li><b>c)</b> Con un adelanto, el procedimiento pide φ<sub>m</sub> ≈ 50° − 9,6° + 12° ≈ 52°. Pero al comprobarlo, el MF final se queda en unos 22°: la fase de esta planta cae muy deprisa (cuatro polos) y al subir el cruce se pierde más de lo que aporta el compensador. <b>Un solo adelanto no sirve.</b></li>
<li>Con un <b>atraso</b>: fase objetivo −180° + 50° + 5° = −125° en ω<sub>c</sub> = 0,267 rad/s, donde |G| = 3,48 → β = 3,48. Cero en 1/T = 0,0267 (T = 37,4 s), polo en 1/(βT) = 0,0077. G<sub>c</sub> = (37,4s + 1)/(130s + 1) → <b>MF = 50,8°</b>, <b>MG = 12,6 dB</b>.</li>
<li><b>d)</b> Lazo cerrado con K = 3: |T(jω)| = 3/|D(jω) + 3| = 1/√2 → <b>ω<sub>b</sub> ≈ 1,04 rad/s</b>.</li></ol>
<p class="res">Lección: comprueba siempre el MF final del adelanto. Si no llega, la respuesta correcta es atraso o adelanto-atraso.</p>`,chk:['3','s(s+1)^2(s+3)',1,0.775,1]},
{t:'Sintonía de Ziegler–Nichols (segundo método)',src:'Sept 2020 · 1,5 pts',tema:'T3',q:'<p>Se desea un error de posición igual a cero. Calcular las constantes k, a y b del regulador R(s) = k(s + a)(s + b)/s aplicando el segundo método de Ziegler–Nichols a G(s) = 1/((s + p₁)(s + p₂)(s + p₃)).</p><p class="note">Los valores de p₁, p₂, p₃ no se leen en el escaneo; se resuelve con p₁ = 1, p₂ = 2, p₃ = 3.</p>',
 s:`<ol><li>Error de posición cero en una planta de tipo 0 → hace falta integral: el R(s) del enunciado es un PID (polo en el origen y dos ceros).</li>
<li>Lazo cerrado con solo K: 1 + K·G = 0 → s³ + 6s² + 11s + (6 + K) = 0.</li>
<li>Routh: fila s¹ = (6·11 − (6 + K))/6. Se anula con <b>K<sub>cr</sub> = 60</b>. Ecuación auxiliar de la fila s²: 6s² + 66 = 0 → ω = √11 = 3,317 rad/s → <b>P<sub>cr</sub> = 2π/ω = 1,894 s</b>.</li>
<li>Tabla 8-2 (PID): K<sub>p</sub> = 0,6·60 = 36; T<sub>i</sub> = 0,5·1,894 = 0,947 s; T<sub>d</sub> = 0,125·1,894 = 0,237 s.</li>
<li>Se pasa a la forma pedida: R(s) = K<sub>p</sub>(1 + 1/(T<sub>i</sub>s) + T<sub>d</sub>s) = K<sub>p</sub>T<sub>d</sub>·(s² + s/T<sub>d</sub> + 1/(T<sub>i</sub>T<sub>d</sub>))/s = 8,53·(s² + 4,22s + 4,46)/s.</li>
<li>El trinomio es un cuadrado perfecto (siempre ocurre con ZN): (s + 2,11)².</li></ol>
<p class="res">k = 8,53 · a = b = 2,11 (= 4/P<sub>cr</sub>)</p>`,chk:['60','(s+1)(s+2)(s+3)',1,3.317,1]},
{t:'PI por asignación de polos',src:'Sept 2017 · cuestión 2',tema:'T3',q:'<p>Calcular un PI por asignación de polos para una planta de primer orden, cumpliendo M<sub>p</sub> &lt; 5 % y t<sub>s</sub> &lt; 20 s.</p><p class="note">La planta del enunciado no se lee en el escaneo; se resuelve con G(s) = 3/(10s + 1).</p>',
 s:`<ol><li>Del sobrepico: M<sub>p</sub> = e<sup>−ζπ/√(1−ζ²)</sup> &lt; 0,05 → ζ &gt; 0,69. Tomamos <b>ζ = 0,7</b>.</li>
<li>Del establecimiento: 4/(ζω<sub>n</sub>) &lt; 20 → ζω<sub>n</sub> &gt; 0,2 → ω<sub>n</sub> &gt; 0,286. Tomamos <b>ω<sub>n</sub> = 0,3 rad/s</b>.</li>
<li>Ecuación característica con el PI: s² + (1 + 3K<sub>p</sub>)/10·s + 3K<sub>p</sub>/(10T<sub>i</sub>) = s² + 2·0,7·0,3·s + 0,3².</li>
<li>Primer coeficiente: (1 + 3K<sub>p</sub>)/10 = 0,42 → <b>K<sub>p</sub> = 1,067</b>. Segundo: 3·1,067/(10T<sub>i</sub>) = 0,09 → <b>T<sub>i</sub> = 3,56 s</b>.</li></ol>
<p class="res">C(s) = 1,067·(1 + 1/(3,56s)). Matiz: el PI añade un cero, así que el sobrepico real sale algo mayor que el de la fórmula; por eso se elige ζ con margen.</p>`},
{t:'Concentración en un reactor ante una entrada senoidal',src:'Feb 2020 · cuestión',tema:'T5',q:'<p>La función de transferencia entre la concentración de compuesto A a la entrada y a la salida es G(s) = K<sub>p</sub>/(τs + 1)², con K<sub>p</sub> = 0,448 y τ = 8,25 min. La concentración de alimentación varía de forma senoidal con ω = 0,2 rad/min.</p><p class="note">Amplitud de entrada 0,1 mol/m³ y límite de 0,05 a la salida.</p>',
 s:`<ol><li>Régimen senoidal: amplitud de salida = A·|G(jω)|.</li>
<li>|G(j0,2)| = 0,448/|1 + j·8,25·0,2|² = 0,448/(1 + 1,65²) = 0,448/3,72 = <b>0,120</b>.</li>
<li>Amplitud de salida = 0,1·0,120 = <b>0,012</b>, menor que 0,05: el proceso amortigua la perturbación lo suficiente y no hace falta controlador.</li>
<li>Desfase: −2·arctan(1,65) = −117,6°.</li></ol>
<p class="res">y(t) = 0,012·sen(0,2t − 117,6°)</p>`,chk:['0.448','(8.25s+1)^2',1,0.2,0.1]},
{t:'Problema de frecuencia: alerón de avión',src:'Dic 2024',tema:'T5 · T6',q:'<p>Alerón con G(s) = 0,1/(s(s + 0,1)), entrada U(s) en voltios, salida Q en grados, realimentación unitaria.</p>',
 ap:['Calcular Q(t) cuando la entrada es x·sen(ωt).','Calcular el mínimo compensador que consiga un error &lt; 1.','Con ese compensador, calcular MF y MG, y dibujar la respuesta al escalón.','Calcular el mínimo compensador para MF &gt; 90° y MG &gt; 70 dB.'],
 s:`<ol><li><b>a)</b> Lazo cerrado T = 0,1/(s² + 0,1s + 0,1). Q<sub>ss</sub>(t) = x·0,1/√((0,1 − ω²)² + (0,1ω)²) · sen(ωt − arctan(0,1ω/(0,1 − ω²))), sumando −180° a la fase cuando ω² &gt; 0,1.</li>
<li><b>b)</b> Tipo 1: el error al escalón ya es 0, así que se pide el de rampa. K<sub>v</sub> = K → e = 1/K &lt; 1 → <b>K algo mayor que 1</b>.</li>
<li><b>c)</b> Con K ≈ 1: ω<sub>c</sub> = 0,31 rad/s, <b>MF ≈ 18°</b>, <b>MG = ∞</b>. En lazo cerrado ζ = 0,16 y ω<sub>n</sub> = 0,32 → sobrepico ≈ 60 %, pico a los 10 s, asentamiento hacia los 80 s.</li>
<li><b>d)</b> Con un integrador y un polo, la fase nunca pasa de −90°: hace falta un cero. Un PD que cancela el polo (τ = 10) da L = K/s y MF = 90° justos. Con τ = 20: <b>C = K(20s + 1)</b> → MF ≈ 91,4°, MG = ∞. En la práctica se añade un polo lejano (≥ 100·ω<sub>c</sub>).</li></ol>`,chk:['0.1','s(s+0.1)',1.1,0.3,1]}
];
const AC=[
{t:'Salida ante una senoide (primer orden)',src:'Complementario 1',tema:'T5',q:'<p>Dado G(s) = 1/(1 + 3s) y la entrada x(t) = 2·sen(5t), calcular la salida.</p>',
 s:`<ol><li>G(j5) = 1/(1 + 15j). Módulo: 1/√(1 + 225) = 1/15,03 = 0,0665. Argumento: −arctan(15) = −86,2° = −1,504 rad.</li><li>Amplitud = 2·0,0665 = 0,133.</li></ol><p class="res">y(t) = 0,133·sen(5t − 1,504)</p>`,chk:['1','3s+1',1,5,2]},
{t:'Ancho de banda y respuestas temporales',src:'Complementario 2',tema:'T1 · T5',q:'<p>Para G(s) = 1/(5s + 1), obtener el ancho de banda y la salida ante un escalón y ante una rampa unitarios.</p>',
 s:`<ol><li>Ancho de banda: |G(jω)| = 1/√(1 + 25ω²) = 1/√2 → 25ω² = 1 → <b>BW = 0,2 rad/s</b> (= 1/τ).</li>
<li>Escalón: Y = 1/(s(5s + 1)) = 1/s − 5/(5s + 1) → <b>y(t) = 1 − e<sup>−t/5</sup></b>.</li>
<li>Rampa: Y = 1/(s²(5s + 1)) = 1/s² − 5/s + 25/(5s + 1) → <b>y(t) = t − 5 + 5e<sup>−t/5</sup></b>. Sigue a la rampa con un retraso de 5 s (= τ).</li></ol>`},
{t:'Diagrama de Bode asintótico (1)',src:'Complementario 8',tema:'T5',q:'<p>Obtener el diagrama de Bode de G(s) = 2/(s(1 + s)(1 + 3s)).</p>',
 s:`<ol><li>Factores: constante 2 (6,02 dB); integrador (−20 dB/dec, −90°); polo en ω = 1/3 y polo en ω = 1 (cada uno −20 dB/dec más y hasta −90° más).</li>
<li>Recta inicial: 20·log(2/ω). En ω = 0,1 vale 26 dB (real: 25,6 dB).</li>
<li>En ω = 1/3 la asíntota vale 20·log(6) = 15,6 dB y pasa a −40 dB/dec. En ω = 1 vale 15,6 − 40·log(3) = −3,5 dB y pasa a −60 dB/dec.</li>
<li>Fase: de −90° (baja frecuencia) a −270° (alta frecuencia).</li></ol>`,chk:['2','s(s+1)(3s+1)',1,0.1,1]},
{t:'Diagrama de Bode asintótico (2): doble integrador y un cero',src:'Complementario 9',tema:'T5',q:'<p>Obtener el Bode de G(s) = 2(s + 3)/(s²(1 + 5s)).</p>',
 s:`<ol><li>Forma normalizada: G = 6(1 + s/3)/(s²(1 + 5s)). Constante 6 (15,6 dB), doble integrador (−40 dB/dec, −180°), polo en 0,2, cero en 3.</li>
<li>En ω = 0,1: 15,6 + 40 − 1,0 = 54,6 dB (real).</li>
<li>Pendientes: −40 hasta 0,2; −60 entre 0,2 y 3; −40 desde 3.</li>
<li>Fase: empieza en −180°, baja hacia −270° por el polo y vuelve hacia −180° por el cero.</li></ol>`,chk:['2(s+3)','s^2(5s+1)',1,0.1,1]},
{t:'Salida ante una senoide (sistema con integrador)',src:'Complementario 13',tema:'T5',q:'<p>En G(s) = (s + 3)/(s(s + 1)(s + 5)) se introduce una senoide de amplitud 5 y frecuencia 10 rad/s. Calcular la amplitud y la fase de la salida.</p>',
 s:`<ol><li>Denominador en j10: j10·(1 + j10)(5 + j10) = −600 − 950j → módulo 1123,6.</li><li>Numerador: 3 + 10j → módulo 10,44.</li><li>|G| = 10,44/1123,6 = 0,00929 → amplitud = 5·0,00929 = <b>0,0465</b>.</li>
<li>Fase: arctan(10/3) − [90° + arctan(10) + arctan(2)] = 73,3° − 237,7° = <b>−164,4°</b>.</li></ol><p class="res">y(t) = 0,0465·sen(10t − 164,4°). La frecuencia no cambia: 10 rad/s.</p>`,chk:['s+3','s(s+1)(s+5)',1,10,5]},
{t:'Margen de fase de un tercer orden',src:'Complementario 12',tema:'T5',q:'<p>Calcular el margen de fase de G(s)H(s) = 12/(s(s + 2)(s + 4)).</p>',
 s:`<ol><li>|G(jω)|² = 144/(ω²(ω² + 4)(ω² + 16)) = 1 → <b>ω<sub>c</sub> = 1,224 rad/s</b>.</li><li>Fase: −90° − arctan(0,612) − arctan(0,306) = −138,5°.</li><li><b>MF = 41,5°</b>. De paso: ω<sub>180</sub> = √8 = 2,83 y MG = 12,0 dB.</li></ol>`,chk:['12','s(s+2)(s+4)',1,1,1]},
{t:'Margen de fase y de ganancia',src:'Complementario 14 y 15',tema:'T5',q:'<p>Para G(s)H(s) = 5/(s(s + 1)(s + 6)), calcular el margen de fase y el margen de ganancia.</p>',
 s:`<ol><li>MF: |G| = 1 en <b>ω<sub>c</sub> = 0,684 rad/s</b>; fase −90° − 34,4° − 6,5° = −130,9° → <b>MF = 49,1°</b>.</li>
<li>MG: el denominador en jω es −7ω² + j(6ω − ω³). La fase vale −180° cuando la parte imaginaria se anula: ω² = 6 → <b>ω<sub>180</sub> = 2,449 rad/s</b>.</li>
<li>Ahí |G| = 5/(7·6) = 0,119 → <b>MG = −20·log(0,119) = 18,5 dB</b>.</li></ol>`,chk:['5','s(s+1)(s+6)',1,1,1]},
{t:'Efecto de la ganancia en la estabilidad',src:'Complementario',tema:'T5',q:'<p>Para G(s)H(s) = K/(s(s + 1)(s + 5)), calcular el MF con K = 10 y con K = 100.</p>',
 s:`<ol><li>K = 10: ω<sub>c</sub> = 1,227 rad/s, fase −154,6° → <b>MF = 25,4°</b> (estable, MG = 9,5 dB).</li>
<li>K = 100: ω<sub>c</sub> = 3,907 rad/s, fase −203,6° → <b>MF = −23,6°</b>: inestable.</li>
<li>La ganancia crítica sale de ω<sub>180</sub> = √5: K<sub>cr</sub> = |jω(jω+1)(jω+5)| = 30. Entre 10 y 100 hemos cruzado ese límite.</li></ol>`,chk:['10','s(s+1)(s+5)',1,1,1]},
{t:'Senoide con cero y tres polos',src:'Complementario 20',tema:'T5',q:'<p>En G(s) = (s + 5)/(s(s + 1)(s + 3)) se introduce una senoide de frecuencia 10 rad/s. Calcular la relación de amplitudes y el desfase.</p>',
 s:`<ol><li>Denominador en j10: j10(j10 + 1)(j10 + 3) = −400 − 970j, de módulo 1049,2. Numerador: 5 + 10j, de módulo 11,18.</li><li>|G| = <b>0,01066</b>.</li><li>Fase: arctan 2 − [90° + arctan 10 + arctan(10/3)] = 63,4° − 247,6° = <b>−184,2°</b> (−3,214 rad).</li></ol><p class="res">y(t) = A·0,01066·sen(10t − 3,214)</p>`,chk:['s+5','s(s+1)(s+3)',1,10,1]},
{t:'Compensador más sencillo y adelanto',src:'Complementario 25',tema:'T6',q:'<p>Para G(s)H(s) = 5/(s(s + 1)):</p>',ap:['Calcular el compensador más sencillo posible para MF = 50°.','Diseñar un adelanto para K<sub>v</sub> = 10 y MF = 50°.'],
 s:`<ol><li><b>a)</b> Una ganancia K. Fase −130°: −90° − arctan ω = −130° → ω = tan 40° = 0,839 rad/s. Ahí 5K/(ω√(1 + ω²)) = 1 → <b>K = 0,219</b>.</li>
<li><b>b)</b> K<sub>v</sub> = 5K = 10 → K = 2, G₁ = 10/(s(s + 1)): ω<sub>c</sub> = 3,08 rad/s, MF = 18°.</li>
<li>φ<sub>m</sub> = 50° − 18° + 8° = 40° → α = 0,217. Nueva ω<sub>c</sub> donde |G₁| = −6,6 dB: <b>ω<sub>m</sub> = 4,58 rad/s</b>. T = 1/(ω<sub>m</sub>√α) = 0,469 s; αT = 0,102 s.</li>
<li>C(s) = 2·(0,469s + 1)/(0,102s + 1) → <b>MF = 52,4°</b>, MG = ∞.</li></ol>`,chk:['5','s(s+1)',2,1,1]},
{t:'Adelanto del Ogata 7-26 con colchón de 8°',src:'Complementario 19',tema:'T6',q:'<p>Para G(s) = 4/(s(s + 2)) con realimentación unitaria, diseñar un compensador para K<sub>v</sub> = 20 y MF = 50°.</p>',
 s:`<ol><li>K<sub>v</sub> = 2K = 20 → K = 10, G₁ = 40/(s(s + 2)): ω<sub>c</sub> = 6,17 rad/s, MF = 18°.</li>
<li>Con 8° de colchón: φ<sub>m</sub> = 40° → α = 0,217. |G₁| = −6,6 dB en <b>ω<sub>m</sub> = 9,16 rad/s</b>.</li>
<li>T = 0,234 s; αT = 0,0509 s → C(s) = 10·(0,234s + 1)/(0,0509s + 1).</li>
<li>Comprobación: K<sub>v</sub> = 20 y <b>MF = 52,4°</b>. Con 5° de colchón (Ogata) sale 50°; con 8°, algo más de margen.</li></ol>`,chk:['40(0.234s+1)','s(s+2)(0.0509s+1)',1,1,1]},
{t:'Sistema de tipo 0: error de posición y adelanto',src:'Complementario 21 y 28',tema:'T1 · T6',q:'<p>Para G(s) = 10/((s + 1)(s + 4)) con realimentación unitaria:</p>',ap:['Elegir K para un error de posición ≤ 0,1 y calcular el MF.','Diseñar un adelanto para MF = 65°.'],
 s:`<ol><li><b>a)</b> Tipo 0: K<sub>p</sub> = 10K/4. e = 1/(1 + K<sub>p</sub>) ≤ 0,1 → K<sub>p</sub> ≥ 9 → K ≥ 3,6. Se toma <b>K = 4</b>: KG = 40/((s+1)(s+4)).</li>
<li>|KG|² = 1600/((ω² + 1)(ω² + 16)) = 1 → ω⁴ + 17ω² − 1584 = 0 → <b>ω<sub>c</sub> = 5,67 rad/s</b>. Fase −80,0° − 54,8° = −134,8° → <b>MF = 45,2°</b>.</li>
<li><b>b)</b> φ<sub>m</sub> = 65° − 45,2° + 10° ≈ 30° → <b>α = 1/3</b>. Nueva ω<sub>c</sub> donde |KG| = −4,77 dB: (ω² + 1)(ω² + 16) = 4800 → <b>ω<sub>m</sub> = 7,82 rad/s</b>.</li>
<li>T = 1/(7,82·√(1/3)) = 0,221 s; αT = 0,0738 s → C(s) = 4·(0,221s + 1)/(0,0738s + 1) → <b>MF = 64,4°</b>, MG = ∞.</li></ol>`,chk:['40','(s+1)(s+4)',1,1,1]},
{t:'Diagramas polares básicos',src:'Complementario 26 y 27',tema:'T5',q:'<p>Dibujar el diagrama polar de G(jω) = 1/(1 + jωT) y de G(jω) = e<sup>−jωT</sup>.</p>',
 s:`<ol><li>1/(1 + jωT) = (1 − jωT)/(1 + ω²T²). Con ω = 0 vale 1; con ω = 1/T, 0,5 − 0,5j; con ω → ∞ tiende a 0 por −90°. Es una <b>semicircunferencia</b> de centro 0,5 y radio 0,5 en el semiplano inferior (la del simulador del T0).</li>
<li>e<sup>−jωT</sup> tiene módulo 1 siempre y fase −ωT: es la <b>circunferencia unidad</b> recorrida en sentido horario infinitas veces. Por eso un retardo no cambia la magnitud pero se come fase sin límite.</li></ol>`}
];
try{$('exList').innerHTML=EX.map(e=>exCard(e,'exa')).join('');
}catch(__e){if(window.__DBG)console.warn(__e)}
try{$('acList').innerHTML=AC.map(e=>exCard(e,'aca')).join('');
}catch(__e){if(window.__DBG)console.warn(__e)}
try{document.querySelectorAll('[data-chk]').forEach(b=>b.addEventListener('click',()=>load(...JSON.parse(b.getAttribute('data-chk')))));
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ================= Glosario ================= */
const G=[
['Actuador','T1','Elemento que convierte la señal de control en una acción física sobre el proceso: válvula, motor, resistencia.'],
['Adelanto de fase','T6','Compensador (Ts+1)/(αTs+1) con α < 1. Añade fase cerca del cruce: más margen y más velocidad.'],
['Ancho de banda','T5','Frecuencia a la que el lazo cerrado cae 3 dB. Indica lo rápido que responde el sistema.'],
['Antiwindup','T2','Mecanismo que impide que el integrador se cargue mientras el actuador está saturado: recálculo o integración condicional.'],
['Asignación de polos','T3','Sintonía analítica: se eligen Kp, Ti y Td para que los polos de lazo cerrado sean los deseados (ζ y ωn).'],
['Atraso de fase','T6','Compensador (Ts+1)/(βTs+1) con β > 1. Baja la ganancia en alta frecuencia para cruzar 0 dB donde hay fase.'],
['Cascada','T4','Dos lazos anidados: el primario fija la consigna del secundario, que es más rápido y absorbe sus perturbaciones.'],
['Consigna (setpoint)','T1','Valor deseado de la variable controlada, r o ysp.'],
['Constante de tiempo','T1','τ de un primer orden: el tiempo en que la respuesta al escalón alcanza el 63,2 % de su valor final.'],
['Control por ratio','T4','Mantiene constante la relación entre dos variables, normalmente dos caudales.'],
['Criterio de Nyquist','T5','Z = N + P: el lazo cerrado es estable si el diagrama de L(jω) rodea −1 tantas veces en sentido antihorario como polos inestables tiene L.'],
['Criterio de Routh','T1','Prueba algebraica de estabilidad: sin cambios de signo en la primera columna de la tabla, no hay polos en el semiplano derecho.'],
['Decibelio','T0','Medida logarítmica de una ganancia: 20·log10|G|. ×10 son 20 dB y 1/√2 son −3 dB.'],
['Dos grados de libertad','T2','PID con distinto tratamiento para la referencia y para la medida (pesos b y c). Ajusta por separado el seguimiento y el rechazo de perturbaciones.'],
['Error permanente','T1','Valor del error cuando t → ∞. Depende del tipo del sistema y de la constante de error.'],
['Estabilidad','T1','Un sistema es estable si ante una entrada acotada su salida no crece sin límite. En s: todos los polos con parte real negativa.'],
['Feedforward','T4','Acción anticipativa a partir de una perturbación medida, Gff = −Gd/Gp. Se combina siempre con realimentación.'],
['Filtro derivativo','T2','Td·s/(1 + Td·s/N): limita la ganancia de la acción D en alta frecuencia para no amplificar el ruido.'],
['Forma de velocidad','T2','PID discreto que calcula el incremento Δu en lugar de u. No sufre windup.'],
['Frecuencia de cruce de ganancia','T5','ωc, donde |L(jω)| = 1 (0 dB). En ella se mide el margen de fase.'],
['Función de transferencia','T0','Cociente salida/entrada en Laplace con condiciones iniciales nulas. Describe por completo un sistema lineal.'],
['Ganancia crítica','T3','Kcr, ganancia proporcional que deja el lazo en oscilación sostenida. Su periodo es Pcr.'],
['Lazo abierto','T0','Control sin medir la salida: la acción es fija y no corrige perturbaciones ni errores de modelo.'],
['Lazo cerrado','T0','Control con realimentación: se mide la salida, se compara con la consigna y se corrige el error.'],
['Margen de fase','T5','MF = 180° + ∠L(jωc). Ángulo que falta para llegar a la inestabilidad. Diseño típico: 40° a 60°.'],
['Margen de ganancia','T5','MG = −20·log|L(jω180)|. dB que se puede subir la ganancia antes de la inestabilidad. Diseño típico: más de 6 a 10 dB.'],
['Patada derivativa','T2','Impulso en la señal de control cuando la referencia da un escalón y la D actúa sobre el error. Se evita con el esquema PI-D.'],
['Perturbación','T1','Entrada no controlada que desvía la salida, d. Puede ser medible o no.'],
['PI-D e I-PD','T2','Variantes del Ogata: en PI-D la D actúa solo sobre la medida; en I-PD también la P. Evitan la patada en la consigna.'],
['Polo','T0','Raíz del denominador de G(s). Su posición en el plano s decide la rapidez, la oscilación y la estabilidad.'],
['Relé (sintonía)','T3','Ensayo de Åström–Hägglund: un relé en el lazo provoca un ciclo límite del que se obtienen Ku = 4d/(πa) y Pu.'],
['Respuesta en frecuencia','T5','Respuesta en régimen permanente a una senoide: misma frecuencia, amplitud por |G(jω)| y desfase ∠G(jω).'],
['Retardo de transporte','T2','Tiempo muerto L, e^(−Ls): no cambia la magnitud y resta ωL de fase. Empeora mucho la estabilidad.'],
['Sobrepico','T1','Máximo exceso de la salida sobre su valor final, en %. En segundo orden depende solo de ζ.'],
['Tiempo de establecimiento','T1','Tiempo para quedar dentro del 2 % (o 5 %) del valor final: ts ≈ 4/(ζωn).'],
['Tipo del sistema','T1','Número de integradores del lazo abierto. Decide qué entradas se siguen sin error.'],
['Variable manipulada','T1','La que el controlador mueve para corregir la salida, u (o m en los enunciados del feedforward).'],
['Windup','T2','Sobrepico y retraso causados por un integrador que sigue acumulando error mientras el actuador está saturado.'],
['Ziegler–Nichols','T3','Reglas empíricas de sintonía de PID a partir de la curva de reacción (K, L, T) o de la ganancia crítica (Kcr, Pcr).']
];
let dl;try{dl=$('glos');}catch(__e){if(window.__DBG)console.warn(__e)}
function drawG(q=''){const n=q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const rows=G.filter(g=>!n||(g[0]+' '+g[2]).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').includes(n));
  dl.innerHTML=rows.map(g=>`<div><dt>${g[0]}<small>${g[1]}</small></dt><dd>${g[2]}</dd></div>`).join('');$('gEmpty').hidden=rows.length>0}
try{$('gq').addEventListener('input',e=>drawG(e.target.value));
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawG();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   BLOQUE NUEVO: Bode por factores, Nyquist, márgenes, generador, etc.
   ==================================================================== */
let L10,DEG;try{L10=Math.log10;DEG=180/Math.PI;}catch(__e){if(window.__DBG)console.warn(__e)}
const mtypeset=el=>{try{if(window.MathJax&&MathJax.typesetPromise)MathJax.typesetPromise(el?[el]:undefined)}catch(e){}};
function fillSelect(id,list){$(id).innerHTML=list.map((x,i)=>`<option value="${i}">${x.n}</option>`).join('')}

/* ---------- raíces de polinomios (Durand–Kerner) ---------- */
function roots(p){p=p.slice();while(p.length>1&&Math.abs(p[0])<1e-14)p.shift();const n=p.length-1;if(n<1)return[];const a0=p[0];p=p.map(v=>v/a0);
  let z=[];for(let i=0;i<n;i++){const ang=2*Math.PI*i/n+0.4;z.push(C(Math.cos(ang)*0.9,Math.sin(ang)*0.9))}
  for(let it=0;it<500;it++){let mx=0;for(let i=0;i<n;i++){let num=pval(p,z[i]),den=C(1);for(let j=0;j<n;j++)if(j!==i)den=mul(den,C(z[i].re-z[j].re,z[i].im-z[j].im));const d=div(num,den);z[i]=C(z[i].re-d.re,z[i].im-d.im);mx=Math.max(mx,cabs(d))}if(mx<1e-12)break}
  return z}
const rhp=p=>roots(p).filter(r=>r.re>1e-7).length;

/* ====================================================================
   1. Constructor de Bode por factores
   ==================================================================== */
const BB=[
 {n:'Complementario: 2/(s(1+s)(1+3s))',f:[{k:2},{o:-1},{p:1/3},{p:1}]},
 {n:'Complementario: 2(s+3)/(s²(1+5s))',f:[{k:6},{o:-2},{p:0.2},{z:3}]},
 {n:'Ejemplo clásico: 20s(1+s)/((2+0,6s+0,5s²)(10+s))',f:[{k:1},{o:1},{z:1},{pp:[2,0.3]},{p:10}]},
 {n:'Práctica 7 ej. 3: 50/((s+0,1)(s+3)(s+5))',f:[{k:50/1.5},{p:0.1},{p:3},{p:5}]},
 {n:'Ogata 7-26: 40/(s(s+2))',f:[{k:20},{o:-1},{p:2}]},
 {n:'Ogata 7-27: 5/(s(s+1)(0,5s+1))',f:[{k:5},{o:-1},{p:1},{p:2}]},
 {n:'Sept 2015: 30/(s+1)²',f:[{k:30},{p:1},{p:1}]},
 {n:'Problema 6: 20/((s+40)(s²+2s+4))',f:[{k:0.125},{pp:[2,0.5]},{p:40}]},
 {n:'Práctica 7 ej. 1b: 1/(1+2s)',f:[{k:1},{p:0.5}]},
 {n:'Práctica 6: 2/(1+5s)',f:[{k:2},{p:0.2}]}
];
function fExact(f,w){if('k'in f)return C(f.k);if('o'in f){const m=Math.pow(w,f.o),a=90*f.o/DEG;return C(m*Math.cos(a),m*Math.sin(a))}
  if('p'in f)return div(C(1),C(1,w/f.p));if('z'in f)return C(1,w/f.z);const[wn,z]=f.pp;return div(C(1),C(1-(w/wn)**2,2*z*w/wn))}
function fAsy(f,w){if('k'in f)return[20*L10(Math.abs(f.k)),f.k<0?-180:0];if('o'in f)return[20*f.o*L10(w),90*f.o];
  const one=(c,s)=>[w<c?0:s*20*L10(w/c),w<c/10?0:w>10*c?s*90:s*45*(L10(w)-L10(c/10))];
  if('p'in f)return one(f.p,-1);if('z'in f)return one(f.z,1);const wn=f.pp[0];return[w<wn?0:-40*L10(w/wn),w<wn/10?0:w>10*wn?-180:-90*(L10(w)-L10(wn/10))]}
function fName(f){const r=v=>fmt(v,v<1?2:1);if('k'in f)return`ganancia K_B = ${r(f.k)} (${fmt(20*L10(Math.abs(f.k)),1)} dB)`;if('o'in f)return f.o<0?`${-f.o===1?'integrador':-f.o+' integradores'} 1/s${-f.o>1?'^'+(-f.o):''}`:`cero en el origen s${f.o>1?'^'+f.o:''}`;
  if('p'in f)return`polo en ω = ${r(f.p)}`;if('z'in f)return`cero en ω = ${r(f.z)}`;return`par complejo ωn = ${r(f.pp[0])}, ζ = ${fmt(f.pp[1],2)}`}
function drawBB(){const B=BB[+$('bbSel').value],F=B.f;const corners=F.filter(f=>!('k'in f)&&!('o'in f)).map(f=>'pp'in f?f.pp[0]:(f.p||f.z));
  const lo=corners.length?Math.pow(10,Math.floor(L10(Math.min(...corners)))-1):0.1,hi=corners.length?Math.pow(10,Math.ceil(L10(Math.max(...corners)))+1):10;
  const ws=logspace(L10(lo),L10(hi),500);
  const ex=ws.map(w=>{let g=C(1);F.forEach(f=>g=mul(g,fExact(f,w)));return g});
  let prev=null,off=0;const exPh=ex.map((g,i)=>{let p=Math.atan2(g.im,g.re)*DEG;if(prev===null){const a0=F.reduce((s,f)=>s+fAsy(f,ws[0])[1],0);while(p-a0>180)p-=360;while(p-a0<-180)p+=360}else{while(p+off-prev>180)off-=360;while(p+off-prev<-180)off+=360}p+=off;prev=p;return p});
  const exM=ex.map(g=>20*L10(cabs(g)));
  const fa=F.map(f=>ws.map(w=>fAsy(f,w)));const tot=ws.map((w,i)=>fa.reduce((s,a)=>[s[0]+a[i][0],s[1]+a[i][1]],[0,0]));
  const showF=$('bbF').checked,showA=$('bbA').checked,showR=$('bbR').checked;const cls=['s5','s6','s7','s8'];
  const ms=[],ps=[];if(showF)F.forEach((f,j)=>{ms.push({pts:ws.map((w,i)=>[w,fa[j][i][0]]),cls:cls[j%4]+' thin'});ps.push({pts:ws.map((w,i)=>[w,fa[j][i][1]]),cls:cls[j%4]+' thin'})});
  if(showA){ms.push({pts:ws.map((w,i)=>[w,tot[i][0]]),cls:'asy'});ps.push({pts:ws.map((w,i)=>[w,tot[i][1]]),cls:'asy'})}
  if(showR){ms.push({pts:ws.map((w,i)=>[w,exM[i]]),cls:'s1'});ps.push({pts:ws.map((w,i)=>[w,exPh[i]]),cls:'s1'})}
  const allM=exM.concat(tot.map(t=>t[0])),allP=exPh.concat(tot.map(t=>t[1]));
  const mLo=Math.max(-120,Math.floor(Math.min(...allM)/20)*20),mHi=Math.ceil(Math.max(...allM,0)/20)*20+ (Math.max(...allM)%20>14?20:0);
  const pLo=Math.floor(Math.min(...allP)/90)*90,pHi=Math.max(0,Math.ceil(Math.max(...allP)/90)*90);const pt=[];for(let v=pLo;v<=pHi;v+=pHi-pLo>270?90:45)pt.push(v);
  put('bbPlot',plot({id:'bbm',h:230,xlog:true,x:[lo,hi],y:[mLo,mHi],ylabel:'|G| (dB)',hl:[0],vl:corners,series:ms})+plot({id:'bbp',h:210,xlog:true,x:[lo,hi],y:[pLo,pHi],yticks:pt,ylabel:'fase (°)',xlabel:'ω (rad/s)',vl:corners,series:ps}));
  /* tabla y texto */
  const N=F.filter(f=>'o'in f).reduce((s,f)=>s+f.o,0),K=F.find(f=>'k'in f).k;let slope=20*N;
  const ev=[];F.forEach(f=>{if('p'in f)ev.push([f.p,-20,f]);else if('z'in f)ev.push([f.z,20,f]);else if('pp'in f)ev.push([f.pp[0],-40,f])});ev.sort((a,b)=>a[0]-b[0]);
  let rows=`<table><tr><th>Esquina ω</th><th>Factor</th><th>Cambio</th><th>Pendiente después</th><th>Fase asintótica en la esquina</th></tr>`;
  ev.forEach(e=>{slope+=e[1];const ph=F.reduce((s,f)=>s+fAsy(f,e[0])[1],0);rows+=`<tr><td class="num">${fmt(e[0],e[0]<1?2:1)}</td><td>${fName(e[2])}</td><td class="num">${e[1]>0?'+':''}${e[1]} dB/déc</td><td class="num">${slope} dB/déc</td><td class="num">${fmt(ph,0)}°</td></tr>`});
  $('bbTab').innerHTML=rows+'</table>';
  const nP=F.reduce((s,f)=>s+('p'in f?1:'pp'in f?2:0)+('o'in f&&f.o<0?-f.o:0),0),nZ=F.reduce((s,f)=>s+('z'in f?1:0)+('o'in f&&f.o>0?f.o:0),0);
  $('bbTxt').textContent=`Factores: ${F.map(fName).join(' · ')}\n`+
   `Recta de baja frecuencia: ${fmt(20*L10(Math.abs(K)),1)} dB ${N?`${N>0?'+':'−'} ${Math.abs(20*N)}·log ω  (pendiente ${20*N} dB/déc, vale ${fmt(20*L10(Math.abs(K)),1)} dB en ω = 1)`:'(horizontal)'}\n`+
   `Fase inicial: ${90*N}° · Final: pendiente ${-20*(nP-nZ)} dB/déc y fase ${-90*(nP-nZ)}° (n − m = ${nP-nZ})`}
try{fillSelect('bbSel',BB);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('bbSel').value=2;
}catch(__e){if(window.__DBG)console.warn(__e)}try{['bbSel','bbF','bbA','bbR'].forEach(id=>$(id).addEventListener('change',drawBB));
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawBB();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* resonancia */
function drawRz(){const z=+$('rzz').value;$('rzzV').textContent=z.toFixed(2);const ws=logspace(-1,1,400);
  const m=ws.map(w=>[w,-20*L10(Math.hypot(1-w*w,2*z*w))]),a=ws.map(w=>[w,w<1?0:-40*L10(w)]);
  const Mr=z<0.7071?1/(2*z*Math.sqrt(1-z*z)):1,wr=z<0.7071?Math.sqrt(1-2*z*z):0;const wb=Math.sqrt(1-2*z*z+Math.sqrt(4*z**4-4*z*z+2));
  put('rzPlot',plot({id:'rz',h:250,xlog:true,x:[0.1,10],y:[-40,25],ylabel:'|G| (dB)',xlabel:'ω/ωn',hl:[0,-3],vl:[1],series:[{pts:a,cls:'asy'},{pts:m,cls:'s1'}],dots:z<0.7071?[{x:wr,y:20*L10(Mr)}]:[]}));
  $('rzR').innerHTML=`<span class="chip">en ωn: ${fmt(-20*L10(2*z),1)} dB</span><span class="chip">${z<0.7071?`Mr = ${fmt(Mr,2)} (${fmt(20*L10(Mr),1)} dB) en ωr = ${fmt(wr,2)}`:'sin pico (ζ ≥ 0,707)'}</span><span class="chip">−3 dB en ω = ${fmt(wb,2)}·ωn</span>`}
try{$('rzz').addEventListener('input',drawRz);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawRz();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   2. Nyquist + Bode enlazados
   ==================================================================== */
const NX=[
 {n:'1/(1+2s)',num:[1],den:[2,1]},
 {n:'2/(1+5s) · Práctica 6',num:[2],den:[5,1]},
 {n:'5/(s(s+1)(0,5s+1)) · Ogata 7-27',num:[5],den:pm([1,0],[1,1],[0.5,1])},
 {n:'10/(s(s+1)(s+5))',num:[10],den:pm([1,0],[1,1],[1,5])},
 {n:'4/(s+1)³',num:[4],den:[1,3,3,1]},
 {n:'30/(s+1)² · sept 2015',num:[30],den:[1,2,1]},
 {n:'40/(s(s+2)) · Ogata 7-26',num:[40],den:[1,2,0]},
 {n:'(s+3)/(s(s+1)(s+5))',num:[1,3],den:pm([1,0],[1,1],[1,5])},
 {n:'20/((s+40)(s²+2s+4)) · problema 6',num:[20],den:pm([1,40],[1,2,4])},
 {n:'2/(s−1) · polo inestable, P = 1',num:[2],den:[1,-1]}
];
function typeOf(den){let n0=0;for(let k=den.length-1;k>=0&&Math.abs(den[k])<1e-14;k--)n0++;return n0}
function nyqInfo(num,den){const n0=typeOf(den),dr=den.slice(0,den.length-n0),kB=num[num.length-1]/dr[dr.length-1];
  const wl=logspace(-4,3,3000),fr=freq(num,den,wl);const re=[],im=[];
  for(let i=1;i<fr.length;i++){const a=fr[i-1],b=fr[i];if(Math.sign(a.g.im)!==Math.sign(b.g.im)&&Math.abs(a.g.im)>1e-12){const t=a.g.im/(a.g.im-b.g.im);re.push([a.w+t*(b.w-a.w),a.g.re+t*(b.g.re-a.g.re)])}
    if(Math.sign(a.g.re)!==Math.sign(b.g.re)&&Math.abs(a.g.re)>1e-12){const t=a.g.re/(a.g.re-b.g.re);im.push([a.w+t*(b.w-a.w),a.g.im+t*(b.g.im-a.g.im)])}}
  const nd=den.length-1-(den.findIndex(v=>Math.abs(v)>1e-14)),nn=num.length-1-(num.findIndex(v=>Math.abs(v)>1e-14));
  const P=rhp(den),Z=rhp(padd(den,num));
  return{n0,kB,re,im,P,Z,N:Z-P,rel:nd-nn,lowRe:fr[0].g.re,fr}}
function nyqPlot(id,num,den,{mark,mirror=true,h=320,extra=[],extraDots=[],win}={}){const fr=freq(num,den,logspace(-4,3,2500));
  const inf=nyqInfo(num,den);let R=Math.max(2,1.5*Math.max(0,...inf.re.map(r=>Math.abs(r[1]))),inf.n0===0?1.3*Math.abs(inf.kB):0,inf.n0===1?1.4*Math.abs(inf.lowRe):0);R=Math.min(R,60);
  const pts=fr.filter(p=>cabs(p.g)<=R*1.6).map(p=>[p.g.re,p.g.im]);
  let xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);if(mirror)ys=ys.concat(ys.map(v=>-v));
  let x0=Math.min(-1.3,...xs)*1.1,x1=Math.max(0.6,...xs)*1.1,y0=Math.min(-0.6,...ys)*1.1,y1=Math.max(0.6,...ys)*1.1;
  if(win){[x0,x1,y0,y1]=win}
  x0=Math.max(x0,-R*1.2);y0=Math.max(y0,-R*1.2);y1=Math.min(y1,R*1.2);
  const uc=[];for(let t=0;t<=2*Math.PI+0.01;t+=0.04)uc.push([Math.cos(t),Math.sin(t)]);
  const series=[{pts:uc,cls:'ref'}];if(mirror)series.push({pts:pts.map(p=>[p[0],-p[1]]),cls:'s1 dash thin'});series.push({pts,cls:'s1'});
  const dots=[{x:-1,y:0,r:5,cls:'dotb'}];if(mark){const g=div(pval(num,C(0,mark)),pval(den,C(0,mark)));dots.push({x:g.re,y:g.im,r:6,cls:'doto'})}
  if(inf.n0===1)series.push({pts:[[inf.lowRe,y0*3],[inf.lowRe,y1*3]],cls:'ref'});
  return plot({id,h,x:[x0,x1],y:[y0,y1],xlabel:'Re',ylabel:'Im',hl:[0],vl:[0],series:series.concat(extra),dots:dots.concat(extraDots),labels:[{x:-1,y:0,dx:-6,dy:-8,t:'−1',a:'end',cls:'l1'}]})}
function drawNX(){const P=NX[+$('nxSel').value],k=Math.pow(10,+$('nxK').value),w=Math.pow(10,+$('nxW').value);$('nxKV').textContent=k.toFixed(2);$('nxWV').textContent=w<10?w.toFixed(2):w.toFixed(1);
  const num=P.num.map(v=>v*k),den=P.den;const inf=nyqInfo(num,den);
  put('nxNyq',nyqPlot('nxn',num,den,{mark:w,mirror:$('nxM').checked}));
  const fr=freq(num,den,logspace(-3,3,700)),m=margins(fr);const gw=freq(num,den,logspace(-4,L10(w),600)).pop();
  const mags=fr.map(p=>p.mag),phs=fr.map(p=>p.ph);
  put('nxBode',bodePair('nxb',[{fr,cls:'s1',magDot:{x:w,y:gw.mag,cls:'doto',r:6},mfDot:{x:w,y:gw.ph,cls:'doto',r:6}}],{x:[0.001,1000],magR:[Math.max(-80,Math.floor(Math.min(...mags.filter((v,i)=>fr[i].w<300))/20)*20),Math.min(120,Math.max(20,Math.ceil(Math.max(...mags.filter((v,i)=>fr[i].w>0.003))/20)*20))],phR:[Math.min(-180,Math.floor(Math.min(...phs)/90)*90),Math.max(0,Math.ceil(Math.max(...phs)/90)*90)],w:420}));
  $('nxR').innerHTML=`<span class="chip">ω = ${fmt(w,2)}: |G| = ${fmt(cabs(gw.g),3)} (${fmt(gw.mag,1)} dB), ∠G = ${fmt(gw.ph,1)}°</span><span class="chip">P = ${inf.P}</span><span class="chip">N = ${inf.N}</span><span class="chip ${inf.Z===0?'ok':'bad'}">Z = N + P = ${inf.Z} → ${inf.Z===0?'estable':'inestable'}</span>`;
  const st=inf.n0===0?`ω → 0⁺: empieza en el eje real, en K_B = ${fmt(inf.kB,3)}`:inf.n0===1?`ω → 0⁺: viene del infinito con −90°, asíntota vertical en Re = ${fmt(inf.lowRe,3)}`:`ω → 0⁺: viene del infinito con ${-90*inf.n0}°`;
  const en=inf.rel>0?`ω → ∞: llega al origen con ${-90*inf.rel}°`:`ω → ∞: acaba en ${fmt(num[0]/den[0],3)}`;
  $('nxTxt').textContent=`${st}\n${en}\nCortes con el eje real: ${inf.re.length?inf.re.map(r=>`ω = ${fmt(r[0],3)} → Re = ${fmt(r[1],3)}`).join(' · '):'ninguno (aparte del inicio)'}\nCortes con el eje imaginario: ${inf.im.length?inf.im.map(r=>`ω = ${fmt(r[0],3)} → Im = ${fmt(r[1],3)}`).join(' · '):'ninguno'}\n`+
   `MF = ${m.mf!=null?fmt(m.mf,1)+'° (ωc = '+fmt(m.wc,3)+')':'no definido: |G| no cruza 0 dB'} · MG = ${fdb(m.mg)}${m.w180?' (ω180 = '+fmt(m.w180,3)+')':''}\n`+
   `Polos de G(s)H(s) en el semiplano derecho: P = ${inf.P} · Polos inestables de lazo cerrado: Z = ${inf.Z} · Vueltas horarias a −1: N = Z − P = ${inf.N}`}
try{fillSelect('nxSel',NX);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('nxSel').value=2;
}catch(__e){if(window.__DBG)console.warn(__e)}try{['nxSel'].forEach(id=>$(id).addEventListener('change',()=>{$('nxK').value=0;drawNX()}));
}catch(__e){if(window.__DBG)console.warn(__e)}try{['nxK','nxW'].forEach(id=>$(id).addEventListener('input',drawNX));
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('nxM').addEventListener('change',drawNX);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawNX();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   3. Márgenes en Bode y Nyquist a la vez
   ==================================================================== */
const MG=[
 {n:'K/(s(s+1)(s+5)), K = 10',num:[10],den:pm([1,0],[1,1],[1,5])},
 {n:'5/(s(s+1)(0,5s+1)) · Ogata 7-27',num:[5],den:pm([1,0],[1,1],[0.5,1])},
 {n:'12/(s(s+2)(s+4))',num:[12],den:pm([1,0],[1,2],[1,4])},
 {n:'50/((s+0,1)(s+3)(s+5)) · Práctica 7',num:[50],den:pm([1,0.1],[1,3],[1,5])},
 {n:'40/(s(s+2)) · Ogata 7-26',num:[40],den:[1,2,0]},
 {n:'4/(s+1)³',num:[4],den:[1,3,3,1]}
];
function drawMG(){const P=MG[+$('mgSel').value],k=Math.pow(10,+$('mgK').value);$('mgKV').textContent=k.toFixed(2);const num=P.num.map(v=>v*k),den=P.den;
  const ws2=logspace(-2,2,900),fr=freq(num,den,ws2),m=margins(fr);
  const ex=[],dots=[];
  const mags=fr.map(p=>p.mag);const mLo=Math.max(-80,Math.floor(Math.min(...mags)/20)*20),mHi=Math.min(100,Math.ceil(Math.max(...mags)/20)*20);
  const magS=[{pts:fr.map(p=>[p.w,p.mag]),cls:'s1'}],phS=[{pts:fr.map(p=>[p.w,p.ph]),cls:'s1'}];const lab1=[],lab2=[];
  if(m.wc){phS.push({pts:[[m.wc,-180],[m.wc,m.mf-180]],cls:'mk'});lab2.push({x:m.wc,y:(m.mf-180-180)/2,dx:6,t:`MF = ${fmt(m.mf,1)}°`,cls:'l3'})}
  if(m.w180&&isFinite(m.mg)){magS.push({pts:[[m.w180,0],[m.w180,-m.mg]],cls:'mkg'});lab1.push({x:m.w180,y:-m.mg/2,dx:6,t:`MG = ${fmt(m.mg,1)} dB`,cls:'l5'})}
  const phs=fr.map(p=>p.ph),pLo=Math.min(-180,Math.floor(Math.min(...phs)/45)*45)-0,pHi=Math.max(-90,Math.ceil(Math.max(...phs)/45)*45);const pt=[];for(let v=pLo;v<=pHi;v+=45)pt.push(v);
  put('mgBode',plot({id:'mgm',w:420,h:200,xlog:true,x:[0.01,100],y:[mLo,mHi],ylabel:'|L| (dB)',hl:[0],vl:[m.wc,m.w180].filter(Boolean),series:magS,labels:lab1})+
    plot({id:'mgp',w:420,h:200,xlog:true,x:[0.01,100],y:[pLo,pHi],yticks:pt,ylabel:'fase (°)',xlabel:'ω (rad/s)',hl:[-180],vl:[m.wc,m.w180].filter(Boolean),series:phS,labels:lab2}));
  if(m.wc){const g=div(pval(num,C(0,m.wc)),pval(den,C(0,m.wc)));const a1=Math.PI,a2=Math.atan2(g.im,g.re);const arc=[];const n=40;let b=a2;if(b>0)b-=2*Math.PI;for(let i=0;i<=n;i++){const t=-Math.PI+(b+Math.PI)*i/n;arc.push([0.45*Math.cos(t),0.45*Math.sin(t)])}
    ex.push({pts:[[0,0],[g.re,g.im]],cls:'mk'},{pts:arc,cls:'mk'});dots.push({x:g.re,y:g.im,r:5,cls:'dotg'})}
  if(m.w180&&isFinite(m.mg)){const x=-Math.pow(10,-m.mg/20);ex.push({pts:[[x,0],[-1,0]],cls:'mkg'});dots.push({x,y:0,r:5,cls:'doto'})}
  put('mgNyq',nyqPlot('mgn',num,den,{h:400,extra:ex,extraDots:dots,win:[-2.4,1.2,-2.4,1.2],mirror:false}));
  $('mgR').innerHTML=`<span class="chip">ωc = ${m.wc?fmt(m.wc,3):'—'}</span><span class="chip ${m.mf>0?'ok':'bad'}">MF = ${m.mf!=null?fmt(m.mf,1)+'°':'—'}</span><span class="chip">ω180 = ${m.w180?fmt(m.w180,3):'—'}</span><span class="chip ${m.mg>0?'ok':'bad'}">MG = ${fdb(m.mg)}${isFinite(m.mg)?' (×'+fmt(Math.pow(10,m.mg/20),2)+')':''}</span><span class="chip ${m.mf>0&&m.mg>0?'ok':'bad'}">${m.mf>0&&m.mg>0?'lazo cerrado estable':'lazo cerrado inestable'}</span>`}
try{fillSelect('mgSel',MG);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('mgSel').addEventListener('change',()=>{$('mgK').value=0;drawMG()});
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('mgK').addEventListener('input',drawMG);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawMG();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* retardo */
function drawDl(){const Ld=+$('dlL').value;$('dlLV').textContent=Ld.toFixed(2);const ws2=logspace(-2,1.3,600);const base=freq([2],[1,1,0],ws2);
  const fr=base.map(p=>({w:p.w,mag:p.mag,ph:p.ph-p.w*Ld*DEG,g:p.g}));const m0=margins(base),m=margins(fr);
  put('dlPlot',bodePair('dl',[{fr:base,cls:'sm dash'},{fr,cls:'s1',mfDot:m.wc?{x:m.wc,y:m.mf-180}:null}],{x:[0.01,20],magR:[-40,60],phR:[-360,-90],wc:m.wc}));
  $('dlR').innerHTML=`<span class="chip">ωc = ${fmt(m.wc,3)} (no cambia)</span><span class="chip">pérdida = ωc·L = ${fmt(m.wc*Ld*DEG,1)}°</span><span class="chip ${m.mf>0?'ok':'bad'}">MF = ${fmt(m0.mf,1)}° − ${fmt(m.wc*Ld*DEG,1)}° = ${fmt(m.mf,1)}°</span><span class="chip">MG = ${fdb(m.mg)}</span>`}
try{$('dlL').addEventListener('input',drawDl);
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawDl();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* tabla MF → ζ → Mp */
try{{const mfz=z=>Math.atan(2*z/Math.sqrt(Math.sqrt(1+4*z**4)-2*z*z))*DEG;const inv=mf=>{let a=0.001,b=1.5;for(let i=0;i<60;i++){const c=(a+b)/2;if(mfz(c)<mf)a=c;else b=c}return(a+b)/2};
 let t='<table><tr><th>MF</th><th>ζ</th><th>Regla ζ ≈ MF/100</th><th>Sobrepico Mp</th><th>Lectura</th></tr>';
 [[20,'muy oscilante'],[30,'oscilante'],[40,'aceptable'],[45,'típico de diseño'],[50,'típico de diseño'],[60,'bien amortiguado'],[70,'casi sin sobrepico']].forEach(([mf,txt])=>{const z=inv(mf),mp=z<1?Math.exp(-z*Math.PI/Math.sqrt(1-z*z))*100:0;t+=`<tr><td class="num">${mf}°</td><td class="num">${fmt(z,2)}</td><td class="num">${fmt(mf/100,2)}</td><td class="num">${fmt(mp,0)} %</td><td>${txt}</td></tr>`});
 $('mfTab').innerHTML=t+'</table>'}
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   4. Generador de ejercicios de márgenes
   ==================================================================== */
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));let GN=null;
function polyStr(p,v='ω'){const n=p.length-1;let s='';p.forEach((c,i)=>{if(Math.abs(c)<1e-12)return;const e=n-i;const a=Math.abs(c),sg=c<0?(s?' − ':'−'):(s?' + ':'');const cs=(a===1&&e>0)?'':fmt(a,a%1?3:0);s+=sg+cs+(e>0?v+(e>1?'^'+e:''):'')});return s||'0'}
function jwParts(den){/* den en s → real e imaginaria como polinomios en ω */const n=den.length-1,Dr=new Array(n+1).fill(0),Di=new Array(n+1).fill(0);
  den.forEach((c,i)=>{const k=n-i;const r=k%4;const idx=n-k;if(r===0)Dr[idx]+=c;else if(r===1)Di[idx]+=c;else if(r===2)Dr[idx]-=c;else Di[idx]-=c});return{Dr,Di}}
function genNew(){const t=$('gnT').value;let den,desc,parts;
  if(t==='a'){const a=ri(1,5);den=[1,a,0];desc=`s(s + ${a})`;parts=[['−90°'],[a]]}
  else if(t==='b'){let a=ri(1,4),b=ri(a+1,8);den=pm([1,0],[1,a],[1,b]);desc=`s(s + ${a})(s + ${b})`;parts=[['−90°'],[a,b]]}
  else if(t==='c'){const a=ri(1,3),b=ri(a+1,5),c=ri(b+1,8);den=pm([1,a],[1,b],[1,c]);desc=`(s + ${a})(s + ${b})(s + ${c})`;parts=[[],[a,b,c]]}
  else{const a=ri(1,4);den=pm([1,a],[1,a]);desc=`(s + ${a})²`;parts=[[],[a,a]]}
  const d0=den[den.length-1]||den[den.length-2];let K;
  for(let tries=0;tries<30;tries++){K=ri(2,60)*(t==='c'?Math.max(1,Math.round(d0/6)):t==='d'?Math.max(1,ri(1,4)*parts[1][0]**2/2):Math.max(1,Math.round(d0/4)));const m=margins(freq([K],den,logspace(-3,3,3000)));if(m.wc&&m.mf>-60&&m.mf<85)break}
  const fr=freq([K],den,logspace(-3,3,6000)),m=margins(fr);GN={K,den,desc,parts,m};
  $('gnQ').innerHTML=`G(s)H(s) = ${K} / (${desc})`;['gnWc','gnMF','gnW1','gnMG'].forEach(id=>$(id).value='');$('gnRes').innerHTML='';$('gnSol').hidden=true}
function genSol(){const{K,den,desc,parts,m}=GN;const{Dr,Di}=jwParts(den);const sq=padd(pmul(Dr,Dr),pmul(Di,Di));/* en ω, solo potencias pares */
  const tp=sq.filter((_,i)=>(sq.length-1-i)%2===0);const ang=(parts[0].length?'−90° ':'')+parts[1].map(a=>`− arctan(ωc/${a})`).join(' ');
  let s=`1) |G(jω)| = 1 ⇒ |D(jω)|² = K²\n   D(jω) = [${polyStr(Dr)}] + j[${polyStr(Di)}]\n   Con t = ω²: ${polyStr(tp,'t')} = ${K*K}\n   ⇒ ωc = ${m.wc?fmt(m.wc,3):'—'} rad/s\n`;
  s+=`2) ∠G(jωc) = ${ang} = ${m.wc?fmt(m.mf-180,1):'—'}°\n   MF = 180° + ∠G = ${m.mf!=null?fmt(m.mf,1):'—'}°\n`;
  s+=`3) Im D(jω) = 0 ⇒ ${polyStr(Di)} = 0 ⇒ ω180 = ${m.w180?fmt(m.w180,3):'no hay (la fase no llega a −180°)'}\n`;
  s+=`4) MG = −20·log|G(jω180)| = ${fdb(m.mg)}${isFinite(m.mg)?` (|G(jω180)| = ${fmt(Math.pow(10,-m.mg/20),4)})`:''}\n`;
  s+=`→ Lazo cerrado ${m.mf>0&&m.mg>0?'estable':'inestable'}.`;return s}
function genChk(){if(!GN)return;const{m}=GN;const num=v=>{v=String(v).trim().toLowerCase().replace(',','.');return v===''?NaN:(v.startsWith('inf')||v==='∞')?Infinity:+v};
  const ok=(u,t,rel,abs)=>{if(!isFinite(t))return!isFinite(u)&&u>0;if(!isFinite(u))return false;return Math.abs(u-t)<=Math.max(abs,rel*Math.abs(t))};
  const r=[['ωc',ok(num($('gnWc').value),m.wc||NaN,0.03,0.02)],['MF',ok(num($('gnMF').value),m.mf,0,1.5)],['ω180',ok(num($('gnW1').value),m.w180||Infinity,0.03,0.02)],['MG',ok(num($('gnMG').value),m.mg,0,0.5)]];
  $('gnRes').innerHTML=r.map(([n,o])=>`<span class="chip ${o?'ok':'bad'}">${n} ${o?'✓':'✗'}</span>`).join('');if(r.some(x=>!x[1])){$('gnSol').textContent=genSol();$('gnSol').hidden=false}}
try{$('gnNew').addEventListener('click',genNew);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('gnChk').addEventListener('click',genChk);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('gnShow').addEventListener('click',()=>{if(!GN)return;$('gnSol').textContent=genSol();$('gnSol').hidden=false});
}catch(__e){if(window.__DBG)console.warn(__e)}try{genNew();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   5. Laboratorio de identificación (Práctica 6)
   ==================================================================== */
let IDM=[];function idMeas(){const w=+$('idW').value;if(!IDM.some(p=>p.w===w))IDM.push({w,a:2/Math.sqrt(1+25*w*w),ph:-Math.atan(5*w)*DEG});IDM.sort((a,b)=>a.w-b.w);drawId(w)}
function drawId(w){w=w||+$('idW').value;const A=2/Math.sqrt(1+25*w*w),ph=-Math.atan(5*w);const Tp=2*Math.PI/w,xi=[],yo=[];for(let i=0;i<=300;i++){const t=2*Tp*i/300;xi.push([t,Math.sin(w*t)]);yo.push([t,A*Math.sin(w*t+ph)])}
  put('idSig',plot({id:'ids',w:420,h:230,x:[0,2*Tp],y:[-2.2,2.2],xlabel:'t (s)',ylabel:'x, y',hl:[0],series:[{pts:xi,cls:'sm'},{pts:yo,cls:'s1'}]}));
  const fr=freq([2],[5,1],logspace(-3,1,200));const showFit=IDM.length>=3;
  put('idBode',plot({id:'idm',w:420,h:170,xlog:true,x:[0.001,10],y:[-30,10],ylabel:'dB',hl:[0,6,3],series:showFit?[{pts:fr.map(p=>[p.w,p.mag]),cls:'s1 dash thin'}]:[],dots:IDM.map(p=>({x:p.w,y:20*L10(p.a),cls:'doto',r:5}))})+
    plot({id:'idp',w:420,h:160,xlog:true,x:[0.001,10],y:[-90,0],yticks:[-90,-45,0],ylabel:'°',xlabel:'ω (rad/s)',hl:[-45],series:showFit?[{pts:fr.map(p=>[p.w,p.ph]),cls:'s1 dash thin'}]:[],dots:IDM.map(p=>({x:p.w,y:p.ph,cls:'doto',r:5}))}));
  $('idTab').innerHTML=IDM.length?`<table><tr><th>ω (rad/s)</th><th>Y/X</th><th>dB</th><th>desfase</th></tr>${IDM.map(p=>`<tr><td class="num">${p.w}</td><td class="num">${fmt(p.a,3)}</td><td class="num">${fmt(20*L10(p.a),2)}</td><td class="num">${fmt(p.ph,1)}°</td></tr>`).join('')}</table>`:'<p class="note" style="margin:10px 14px">Aún no hay medidas. Elige una frecuencia y pulsa «Medir».</p>'}
try{$('idGo').addEventListener('click',idMeas);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('idClr').addEventListener('click',()=>{IDM=[];drawId()});
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('idW').addEventListener('change',()=>drawId());
}catch(__e){if(window.__DBG)console.warn(__e)}try{drawId();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   6. Problemas resueltos y ejercicios de prácticas
   ==================================================================== */
const PROF=[
{t:'P1 · G(s) = 30/(s²+2s+1): MF, ancho de banda, adelanto y atraso',src:'Problema clásico · = sept 2015',tema:'MF · BW · T6',
 q:'<p>Dada G(s) = 30/(s² + 2s + 1), con H = 1: a) margen de fase; b) ancho de banda; c) compensador para MF = 50° y su MG; d) compensador de atraso para MF = 50°.</p>',
 s:`<ol><li><b>a)</b> 30/√((1−ω²)² + (2ω)²) = 1 → <b>ω<sub>c</sub> = 5,39 rad/s</b>; ∠G = −159° → <b>MF = 21°</b>.</li>
<li><b>b)</b> Lazo cerrado 30/(s² + 2s + 31), ganancia 30/31 ≈ 1. El método habitual busca 20·log|T| = −3 dB y obtienen 8,36 rad/s. Bajando 3 dB desde 20·log(30/31) = −0,28 dB, como dice la definición, sale <b>8,45 rad/s</b>. Las dos lecturas valen en el examen si explicas cuál usas.</li>
<li><b>c) Adelanto</b> con 10° de colchón: φ<sub>max</sub> = 50 − 21 + 10 = 39° → α = 0,227. Se coloca donde |G| = −20·log(1/√α) = −6,43 dB → ω = 7,87 rad/s → T = 1/(7,87·√0,227) = 0,267.</li>
<li>G<sub>c</sub> = (1 + 0,267s)/(1 + 0,0606s). Comprobado: <b>MF = 53,5°</b>, <b>MG = ∞</b> (la fase no llega a −180°).</li>
<li><b>d) Atraso.</b> El método habitual busca la fase −130° sin colchón: −2·arctan ω = −130° → ω = 2,14 rad/s, donde |G| = 14,61 dB → β = 5,38; cero una década abajo: T = 10/2,14 = 4,67 → G<sub>c</sub> = (1 + 4,67s)/(1 + 25,1s). Comprobado: <b>MF = 45,3°</b>.</li></ol>
<p class="fix">sin colchón, el atraso de la solución clásica se queda en 45°: el propio compensador resta unos 5° en ω<sub>c</sub>. Con 5° de colchón (fase objetivo −125°) sale ω<sub>c</sub> = 1,92, β = 6,40 y MF = 50,1°, que es la solución de la sección de exámenes.</p>`,chk:['30','s^2+2s+1',1,5.39,1]},
{t:'P2 · G(s) = 4/(s(s+2)): Kv = 20 y MF = 50°',src:'= Ogata 7-26',tema:'T6',
 q:'<p>Realimentación unitaria con G(s) = 4/(s(s + 2)). Calcular un compensador para conseguir K<sub>v</sub> = 20 y MF = 50°.</p>',
 s:`<ol><li>K<sub>v</sub> = lím s·G = 2 → hace falta K<sub>c</sub> = 10. Se trabaja con G = 40/(s(s + 2)).</li>
<li>40/√(ω⁴ + 4ω²) = 1 → <b>ω<sub>c</sub> = 6,16 rad/s</b>; ∠G = −162° → <b>MF = 18°</b>.</li>
<li>φ<sub>max</sub> = 50 − 18 + 5 = 37° → α = 0,249 → 20·log(1/√α) = 6,045 dB.</li>
<li>Donde |G| = −6,045 dB: ω = 8,84 rad/s → T = 1/(8,84·√0,249) = 0,226.</li>
<li>G<sub>c</sub> = 10·(1 + 0,226s)/(1 + 0,0563s). Comprobado: <b>MF = 49,7°</b> (≈ 50°), MG = ∞.</li></ol>`,chk:['40(0.226s+1)','s(s+2)(0.0563s+1)',1,8.84,1]},
{t:'P3 · Lazo de segundo orden con ζ y ωn',src:'problemas de examen',tema:'MF · BW',
 q:'<p>G(s) = ω<sub>n</sub>²/(s(s + 2ζω<sub>n</sub>)), H = 1. a) MF actual; b) ancho de banda; c) para ζ = 0,1 y ω<sub>n</sub> = 1, el mínimo compensador para MF = 50° y su MG.</p>',
 s:`<ol><li><b>a)</b> Con t = ω²: t² + 4ζ²ω<sub>n</sub>²t − ω<sub>n</sub>⁴ = 0 → ω<sub>c</sub> = ω<sub>n</sub>√(√(4ζ⁴+1) − 2ζ²). MF = 180° + fase en ω<sub>c</sub> (expresión en función solo de ζ).</li>
<li><b>b)</b> Lazo cerrado de ganancia 1: |T| = 1/√2 da ω<sub>b</sub> = ω<sub>n</sub>√(1 − 2ζ² + √(4ζ⁴ − 4ζ² + 2)).</li>
<li><b>c)</b> Con ζ = 0,1: ω<sub>c</sub> = 0,99 rad/s y <b>MF = 11,42°</b>. La solución clásica pone un adelanto con 10° de colchón: φ<sub>max</sub> = 48,58° → α = 0,143 → se coloca en |G| = −8,45 dB → ω = 1,62 → T = 1,63.</li>
<li>G<sub>c</sub> = (1 + 1,63s)/(1 + 0,233s). Comprobado: <b>MF = 55,6°</b>, MG = ∞.</li></ol>
<p class="note">«Mínimo compensador» también admite la lectura de una simple ganancia: con K = 0,0438 el MF es exactamente 50° (lo tienes en Exámenes anteriores). El adelanto de la solución clásica es más rápido (ω<sub>c</sub> = 1,6 frente a 0,17 rad/s).</p>`,chk:['1.63s+1','s(s+0.2)(0.233s+1)',1,1.62,1]},
{t:'P4 · G(s) = 1/(s(s+1)(0,5s+1)): Kv = 5, MF = 40°, MG = 10 dB',src:'= Ogata 7-27',tema:'T6',
 q:'<p>Realimentación unitaria. Calcular un compensador para K<sub>v</sub> = 5, MF = 40° y MG = 10 dB.</p>',
 s:`<ol><li>K<sub>v</sub> = 1 → K<sub>c</sub> = 5. G = 5/(s(s + 1)(0,5s + 1)): ω<sub>c</sub> = 1,80 rad/s y fase −193°, así que <b>MF = −13°</b> (la solución clásica escribe 348,62° − 360° = −11,38°; es el mismo valor redondeado). <b>Inestable.</b></li>
<li>La solución clásica prueba primero un adelanto: φ<sub>max</sub> = 40 + 11,38 + 5 = 56,38° → α = 0,091 → ω = 2,96 → T = 1,12 → G<sub>c</sub> = (1 + 1,12s)/(1 + 0,102s).</li>
<li>Comprobación real de ese adelanto: <b>MF = 19,0°</b> y MG = 7,0 dB. No cumple.</li>
<li>La solución correcta es un <b>atraso</b> (Ogata): fase objetivo −128° en ω ≈ 0,46, β = 10, cero en 0,1 → G<sub>c</sub> = 5(10s + 1)/(100s + 1) → <b>MF = 41,6°</b>, <b>MG = 14,3 dB</b>.</li></ol>
<p class="fix">la solución clásica calcula para su adelanto un MF de 42,67° y siguen añadiendo un atraso encima. Al comprobarlo, ese adelanto solo da 19°: la fase de esta planta cae tan deprisa que el adelanto, al subir ω<sub>c</sub>, pierde más de lo que aporta. Basta con el atraso.</p>`,chk:['5','s(s+1)(0.5s+1)',1,1.8,1]},
{t:'P5 · K/(s(s+1)) con H = 100/(s+10): K para MF = 40°, atenuación y ancho de banda',src:'= sept 2017',tema:'MF · T6',
 q:'<p>Lazo cerrado con G(s) = K/(s(s + 1)) y H(s) = 100/(s + 10). a) K para MF = 40°. b) Compensador para MF = 40° y atenuación menor que 0,00001 (−100 dB) para ω ≥ 100 rad/s. c) Plantear el ancho de banda del sistema compensado.</p>',
 s:`<ol><li><b>a)</b> Fase −140°: −90° − arctan ω − arctan(ω/10) = −140° → <b>ω = 0,979 rad/s</b>. Módulo 1 ahí: 100K/(ω√(ω²+1)√(ω²+100)) = 1 → <b>K = 0,138</b>. (MG = 18,0 dB.)</li>
<li><b>b)</b> Con K = 0,138, en ω = 100 el lazo ya atenúa −97,3 dB: faltan unos 2,7 dB. Hace falta un atraso que baje la alta frecuencia sin estropear el MF.</li>
<li>Fase objetivo −135° (40° + 5°): ω = 0,844 rad/s. Cero una década abajo: T = 10/0,844 = 11,8 s. Se elige β ≥ 10<sup>2,74/20</sup> ≈ 1,37; con <b>β = 1,4</b>: G<sub>c</sub> = (1 + 11,8s)/(1 + 16,6s).</li>
<li>Comprobado: <b>MF = 45,9°</b>, MG = 20,7 dB y <b>−100,2 dB en ω = 100</b>. Cumple.</li>
<li><b>c)</b> Lazo cerrado y/r = G<sub>c</sub>G/(1 + G<sub>c</sub>GH). Su ganancia a baja frecuencia es 1/H(0) = 0,1 (−20 dB); el ancho de banda está donde cae a −23 dB: <b>ω<sub>b</sub> ≈ 1,31 rad/s</b>.</li></ol>
<p class="fix">la solución clásica toma T = 0,1 (pensando en el cero una década por debajo de ω = 100) y β = 1,24. Con esos valores el compensador apenas actúa y no se alcanzan los −100 dB. El cero del atraso va una década por debajo del cruce ω<sub>c</sub>, no de la frecuencia del ruido.</p>`,chk:['13.8','s(s+1)(s+10)',1,0.979,1]},
{t:'P6 · G(s) = 20/((s+40)(s²+2s+4)): cuatro especificaciones',src:'Práctica 7 ej. 4',tema:'MF · T6',
 q:'<p>H = 1. Diseñar un compensador para: a) MF ≥ 45° (compensador mínimo); b) MF ≥ 45° y e<sub>p</sub> ≤ 7,5 %; c) MF ≥ 45° y ω<sub>c</sub> = 5 rad/s; d) MF ≥ 45°, e<sub>p</sub> &lt; 7,5 % y ω<sub>c</sub> = 5 rad/s.</p>',
 s:`<ol><li><b>a)</b> La ganancia en continua es 20/(40·4) = 0,125 y el máximo de |G|, cerca de la resonancia, es 0,144. <b>|G| nunca llega a 1: no hay ω<sub>c</sub> y el MF no está definido.</b> El lazo es estable con mucho margen (MG = 44,5 dB en ω = 9,16). Compensador mínimo: ninguno.</li>
<li><b>b)</b> e<sub>p</sub> = 1/(1 + 20K<sub>c</sub>/160) = 0,075 → <b>K<sub>c</sub> = 98,67</b>. Ahora ω<sub>c</sub> = 7,10 y <b>MF = 6,9°</b> (MG = 4,6 dB).</li>
<li>Un adelanto con 5° de colchón (α = 0,19) solo llega a 39°: la fase cae rápido por el par complejo. Con 15° de colchón: φ<sub>max</sub> = 53° → <b>α = 0,112</b>, ω<sub>m</sub> = 11,98 → T = 0,250 → G<sub>c</sub> = 98,67·(1 + 0,250s)/(1 + 0,0279s) → <b>MF = 46,1°</b>, MG = 14,8 dB.</li>
<li><b>c)</b> En ω = 5 la fase es −161,66°: faltan 45 − 18,34 = 26,7°. α = (1 − sen 26,7°)/(1 + sen 26,7°) = 0,381 y T = 1/(5√α) = 0,324. Además hay que <b>elegir K</b> para que el módulo valga 1 en ω = 5: K = 28,9. Resultado: G<sub>c</sub> = 28,9·(1 + 0,324s)/(1 + 0,123s) → ω<sub>c</sub> = 5, <b>MF = 45,0°</b>, MG = 18,6 dB.</li>
<li><b>d)</b> Con K<sub>c</sub> = 98,67, en ω = 5 el módulo ya es +6,46 dB y el adelanto lo subiría más. Hay que bajar la ganancia en ω = 5 sin tocar la de continua: un <b>adelanto-atraso</b>. Con el adelanto de c) y un atraso de β = 3,41 (cero en 0,1 rad/s) queda ω<sub>c</sub> = 5 y MF = 44,2°; dos grados más de colchón en el adelanto dan los 45°.</li></ol>
<p class="fix">la solución clásica calcula en a) un ω<sub>c</sub> = 2,75 y un MF de 53°, pero |G| no llega a 1 en ninguna frecuencia. En c) y d) sitúan ω<sub>m</sub> en 5 rad/s pero no ajustan la ganancia, así que el cruce real no queda en 5.</p>`,chk:['1973.3','(s+40)(s^2+2s+4)',1,5,1]},
{t:'P7 · G(s) = 1/(s(s+1)(s+2)): Kv = 10, MF = 50°, MG = 10 dB',src:'Problema clásico',tema:'T6',
 q:'<p>Conseguir K<sub>v</sub> = 10, MF = 50° y MG = 10 dB.</p>',
 s:`<ol><li>K<sub>v</sub> = 1/2 → K<sub>c</sub> = 20. G = 20/(s(s + 1)(s + 2)): ω<sub>c</sub> = 2,43 rad/s, fase −208° → <b>MF = −28°</b>; ω<sub>180</sub> = √2, MG = −10,5 dB. Inestable.</li>
<li>Faltan 78° más colchón: un solo adelanto necesitaría φ<sub>max</sub> = 83°, es decir, α = 0,0037. <b>No es realizable</b> (en la práctica α ≥ 0,05, φ ≤ 65°).</li>
<li><b>Atraso:</b> fase objetivo −180 + 50 + 6 = −124° → ω<sub>c</sub> = 0,412 rad/s; ahí |G| = 26,8 dB → <b>β = 22,0</b>. Cero una década abajo: T = 24,3 s → G<sub>c</sub> = 20·(1 + 24,3s)/(1 + 535s).</li>
<li>Comprobado: <b>MF = 50,4°</b>, <b>MG = 15,9 dB</b>, K<sub>v</sub> = 10. Cumple todo.</li></ol>
<p class="fix">la solución clásica sigue con el adelanto de α = 0,0037 (un polo 270 veces más rápido que el cero). Cuando falta tanta fase, la herramienta es el atraso o el adelanto-atraso.</p>`,chk:['20','s(s+1)(s+2)',1,2.43,1]},
{t:'P8 · G(s) = 10/((s+1)(s+4)): MF, ancho de banda y adelanto',src:'Problema clásico',tema:'MF · BW · T6',
 q:'<p>H = 1. a) Margen de fase; b) ancho de banda; c) compensador más sencillo para e<sub>p</sub> = 10 % y MF ≥ 65°; d) MG del sistema compensado.</p>',
 s:`<ol><li><b>a)</b> (ω² + 1)(ω² + 16) = 100 → con t = ω²: t² + 17t − 84 = 0 → t = 4 → <b>ω<sub>c</sub> = 2 rad/s</b>. Fase −arctan 2 − arctan 0,5 = −90° → <b>MF = 90°</b>.</li>
<li><b>b)</b> Lazo cerrado 10/(s² + 5s + 14), ganancia 10/14 (−2,92 dB). Se busca −5,92 dB: <b>ω<sub>b</sub> = 3,95 rad/s</b>.</li>
<li><b>c)</b> e<sub>p</sub> = 0,1 → K<sub>c</sub> = 3,6 → G = 36/((s+1)(s+4)): ω<sub>c</sub> = 5,32 rad/s y <b>MF = 47,6°</b>.</li>
<li>Adelanto con 12° de colchón: φ<sub>max</sub> = 29,4° → α = 0,342; |G| = −4,66 dB en ω<sub>m</sub> = 7,32 → T = 0,234 → G<sub>c</sub> = 3,6·(1 + 0,234s)/(1 + 0,080s) → <b>MF = 65,8°</b>.</li>
<li><b>d)</b> Orden 2 más un adelanto: la fase nunca llega a −180° → <b>MG = ∞</b>.</li></ol>
<p class="fix">la solución clásica saca ω<sub>c</sub> = 9,58 y MF = 28,63° en a), y ω<sub>c</sub> = 5,79 con MF = 44,58° en c): en la raíz escriben ω² + 4 donde va ω² + 16. Con 5° de colchón el adelanto se queda en 61°; hacen falta unos 12°.</p>`,chk:['36','(s+1)(s+4)',1,2,1]}
];
const PRAC=[
{t:'Ej. 1a · Integrador K/(jω) con K = 1 y K = 10',src:'Práctica 7',tema:'Bode · Nyquist',q:'<p>Obtener el Bode y el diagrama polar. Pendiente del módulo, fase, e influencia de K. Comprobar que en ω = 1 el módulo vale 20·log K.</p>',
 s:`<ol><li>Módulo: 20·log K − 20·log ω → recta de <b>−20 dB/déc</b>. En ω = 1 vale 20·log K: 0 dB con K = 1 y 20 dB con K = 10. K solo desplaza la recta hacia arriba.</li><li>Fase constante <b>−90°</b>, sea cual sea K.</li><li>Polar: todo el semieje imaginario negativo, de −j∞ (ω → 0) al origen (ω → ∞).</li></ol>`,chk:['1','s',1,1,1]},
{t:'Ej. 1b · Primer orden 1/(1 + jωT) con T = 2',src:'Práctica 7',tema:'Bode',q:'<p>Determinar la frecuencia de corte, el módulo y la fase en ella, y los valores a baja y alta frecuencia.</p>',
 s:`<ol><li>Esquina (frecuencia de corte): <b>ω = 1/T = 0,5 rad/s</b>. Allí el módulo vale −3 dB (|G| = 0,707) y la fase <b>−45°</b>.</li><li>Baja frecuencia: 0 dB (|G| → 1) y 0°. Alta frecuencia: −20 dB/déc hacia −∞ y fase −90°.</li><li>|G| ≤ 1 siempre y la fase no pasa de −90°: MG = ∞ y no hay cruce de 0 dB salvo en ω = 0.</li></ol>`,chk:['1','2s+1',1,0.5,1]},
{t:'Ej. 2 · Márgenes y resonancia según ζ',src:'Práctica 7',tema:'MF · resonancia',q:'<p>Para un lazo de segundo orden con ω<sub>n</sub> = 1, obtener MF, frecuencia de resonancia y ancho de banda para ζ = 0,1, 0,3, 0,5, 0,7 y 1.</p><p class="note">El PDF no muestra la función; se toma el lazo abierto G = 1/(s(s + 2ζ)), que da en lazo cerrado el segundo orden con ω<sub>n</sub> = 1.</p>',
 s:`<div class="tw"><table><tr><th>ζ</th><th>ω<sub>c</sub></th><th>MF</th><th>M<sub>r</sub></th><th>ω<sub>r</sub></th><th>ω<sub>b</sub></th></tr>
<tr><td>0,1</td><td class="num">0,990</td><td class="num">11,4°</td><td class="num">5,03</td><td class="num">0,990</td><td class="num">1,54</td></tr>
<tr><td>0,3</td><td class="num">0,914</td><td class="num">33,3°</td><td class="num">1,75</td><td class="num">0,906</td><td class="num">1,45</td></tr>
<tr><td>0,5</td><td class="num">0,786</td><td class="num">51,8°</td><td class="num">1,15</td><td class="num">0,707</td><td class="num">1,27</td></tr>
<tr><td>0,7</td><td class="num">0,648</td><td class="num">65,2°</td><td class="num">1,00</td><td class="num">0,141</td><td class="num">1,01</td></tr>
<tr><td>1</td><td class="num">0,486</td><td class="num">76,3°</td><td class="num">—</td><td class="num">—</td><td class="num">0,64</td></tr></table></div>
<p>Lo que hay que ver: el MF crece con ζ (aproximadamente MF ≈ 100ζ hasta ζ = 0,7), el pico de resonancia desaparece con ζ ≥ 0,707, y el ancho de banda baja al aumentar ζ: más amortiguado es más lento. MG = ∞ en todos (orden 2).</p>`,chk:['1','s(s+0.6)',1,1,1]},
{t:'Ej. 3 · 50/((s+0,1)(s+3)) con H = 1/(s+5)',src:'Práctica 7',tema:'Bode · MF · MG',q:'<p>Obtener el Bode y los márgenes de fase y de ganancia (D(s) = 1).</p>',
 s:`<ol><li>La ecuación característica es 1 + D·G·H, así que se dibuja el lazo abierto L = 50/((s + 0,1)(s + 3)(s + 5)) = 33,3/((1 + 10s)(1 + s/3)(1 + s/5)).</li>
<li>Bode: 30,5 dB hasta ω = 0,1; −20 dB/déc hasta 3; −40 hasta 5; −60 después. Fase de 0° a −270°.</li>
<li>ω<sub>c</sub>: |L| = 1 → <b>ω<sub>c</sub> = 2,36 rad/s</b>; fase −151,1° → <b>MF = 28,9°</b>.</li>
<li>ω<sub>180</sub>: parte imaginaria de (jω + 0,1)(jω + 3)(jω + 5) nula → <b>ω<sub>180</sub> = 3,97 rad/s</b>; |L| = 0,395 → <b>MG = 8,1 dB</b>.</li></ol>`,chk:['50','(s+0.1)(s+3)(s+5)',1,2.36,1]}
];
try{$('profList').innerHTML=PROF.map(e=>exCard(e,'prof')).join('');
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('pracList').innerHTML=PRAC.map(e=>exCard(e,'aca')).join('');
}catch(__e){if(window.__DBG)console.warn(__e)}
try{document.querySelectorAll('#profList [data-chk],#pracList [data-chk]').forEach(b=>b.addEventListener('click',()=>load(...JSON.parse(b.getAttribute('data-chk')))));
}catch(__e){if(window.__DBG)console.warn(__e)}

/* Nyquist en la calculadora */
function nyqInto(id,num,den){try{put(id,nyqPlot('cnq',num,den,{h:300}))}catch(e){}}

/* ====================================================================
   7. Test, fichas, progreso, búsqueda, índice
   ==================================================================== */
const QZ={
'Bode':[
 ['Un polo simple en ω = 10 hace que la asíntota del módulo…',['suba 20 dB/déc desde ω = 10','baje 20 dB/déc desde ω = 10','baje 40 dB/déc desde ω = 1','no cambie'],1,'Cada polo resta 20 dB/déc a partir de su esquina.'],
 ['¿Cuánto vale la curva real de 1/(1+jωT) en su esquina?',['0 dB','−3 dB','−6 dB','−20 dB'],1,'|1/(1+j)| = 1/√2 → −3 dB, y la fase vale −45°.'],
 ['La recta de baja frecuencia de 20/(s(1+s/2)) vale en ω = 1…',['0 dB','20 dB','26 dB','6 dB'],2,'Pasa por 20·log K_B = 20·log 20 = 26 dB en ω = 1.'],
 ['Un par complejo con ζ = 0,1 en ω_n = 2 produce…',['un pico de unos 14 dB cerca de ω = 2','una caída de 3 dB en ω = 2','una pendiente de +40 dB/déc','nada especial'],0,'En ω_n la curva vale −20·log(2ζ) = +14 dB.'],
 ['A alta frecuencia, una G(s) con 3 polos y 1 cero tiene fase…',['−90°','−180°','−270°','0°'],1,'−90·(n − m) = −90·2 = −180°.']],
'Nyquist':[
 ['Un sistema de tipo 1 empieza su Nyquist…',['en el origen','en el eje real positivo','en el infinito, con −90°','en −1'],2,'El integrador hace |G| → ∞ y aporta −90° cuando ω → 0.'],
 ['Con P = 0, el lazo cerrado es estable si la curva…',['pasa por el origen','no rodea el −1','rodea el −1 una vez','corta el eje imaginario'],1,'Z = N + P = N; estable si N = 0.'],
 ['El corte con el eje real negativo se obtiene haciendo…',['Re G(jω) = 0','|G(jω)| = 1','Im G(jω) = 0','ω = 0'],2,'Ahí la fase vale −180°: es ω_180.'],
 ['Si el corte con el eje real está en −0,5, el MG es…',['0,5','2 (6 dB)','−6 dB','−0,5'],1,'MG = 1/0,5 = 2, es decir, 20·log 2 = 6 dB.'],
 ['El diagrama polar de un retardo e^{−jωL} es…',['una recta','la circunferencia unidad','un semicírculo','un punto'],1,'Módulo 1 y fase −ωL: recorre la circunferencia unidad sin parar.']],
'MF y MG':[
 ['El MF se mide en la frecuencia donde…',['la fase es −180°','|GH| = 1','|GH| = 0,707','la fase es −90°'],1,'Es la frecuencia de cruce de ganancia ω_c.'],
 ['Si en ω_c la fase vale −200°, el MF es…',['200°','20°','−20°','160°'],2,'MF = 180° + (−200°) = −20°: inestable.'],
 ['G = 30/(s+1)² tiene MG…',['0 dB','infinito','6 dB','negativo'],1,'Con dos polos la fase nunca llega a −180°.'],
 ['Un retardo e^{−Ls} en el lazo…',['cambia ω_c','resta ω_c·L al MF','sube el MG','no afecta a los márgenes'],1,'No cambia el módulo, así que ω_c es la misma, pero resta fase.'],
 ['El ancho de banda se calcula con…',['el lazo abierto','el lazo cerrado','la planta sin controlador','el compensador'],1,'Frecuencia donde |T(jω)| cae 3 dB respecto a |T(0)|.']],
'Compensadores':[
 ['El compensador de adelanto (Ts+1)/(αTs+1) tiene…',['α > 1','0 < α < 1','α < 0','α = 1'],1,'El cero (1/T) está antes que el polo (1/(αT)).'],
 ['La fase máxima del adelanto cumple…',['sen φ = (1−α)/(1+α)','tan φ = α','φ = 90α','cos φ = α'],0,'Ecuación (7-25) del Ogata.'],
 ['El adelanto se coloca donde |G₁| vale…',['0 dB','−20·log(1/√α)','+10·log α','−3 dB'],1,'Así, sumando la ganancia del compensador en ω_m, queda 0 dB.'],
 ['En el atraso, el cero se coloca…',['en ω_c','una década por debajo de ω_c','una década por encima','en el origen'],1,'Para que su retraso de fase no estropee el MF.'],
 ['Si falta más de 60° de fase…',['un adelanto basta','hace falta atraso o adelanto-atraso','se sube K','no hay solución'],1,'Un solo adelanto no pasa de unos 65° (α ≥ 0,05).']],
'PID':[
 ['¿Qué acción elimina el error permanente al escalón?',['P','I','D','ninguna'],1,'La integral acumula el error hasta anularlo.'],
 ['El windup aparece cuando…',['el sensor tiene ruido','el actuador se satura y hay integral','Td es grande','Kp es pequeño'],1,'La integral sigue acumulando mientras u está saturada.'],
 ['La patada derivativa se evita…',['quitando la integral','con la D sobre la medida (PI-D)','subiendo Kp','con un relé'],1,'Así un escalón de r no se deriva.'],
 ['El filtro de la derivada Td·s/(1+Td·s/N) sirve para…',['eliminar el windup','limitar la ganancia en alta frecuencia','anular el error','discretizar'],1,'La ganancia derivativa queda limitada a Kp·N.'],
 ['La forma de velocidad del PID discreto…',['no sufre windup','tiene más ruido','no tiene integral','es continua'],0,'Calcula Δu, sin sumatorio acumulado.']],
'Estructuras':[
 ['El feedforward ideal es…',['G_ff = G_d/G_p','G_ff = −G_d/G_p','G_ff = −G_p/G_d','G_ff = 1'],1,'Impone G_p·G_ff + G_d = 0.'],
 ['En cascada, el lazo interno debe ser…',['más lento','3 a 5 veces más rápido','igual de rápido','sin controlador'],1,'Corrige las perturbaciones antes de que lleguen al externo.'],
 ['El controlador secundario de una cascada suele ser…',['un PID completo','un P','un relé','un integrador puro'],1,'Su error lo corrige el primario.'],
 ['Ziegler–Nichols por ganancia crítica usa…',['K, L y T','Kcr y Pcr','ζ y ωn','MF y MG'],1,'Tabla 8-2 del Ogata.'],
 ['El método del relé estima Ku con…',['4d/(πa)','d/a','πa/(4d)','2d/a'],0,'d amplitud del relé, a amplitud de la oscilación.']]
};
let qT,qI,qScore;try{qT=Object.keys(QZ)[0];qI=0;qScore={};}catch(__e){if(window.__DBG)console.warn(__e)}const QKEY='ic-quiz';let qBest={};try{try{qBest=JSON.parse(localStorage.getItem(QKEY)||'{}')}catch(e){}
}catch(__e){if(window.__DBG)console.warn(__e)}
function qRender(){const Q=QZ[qT][qI];$('qTabs').innerHTML=Object.keys(QZ).map(k=>`<button type="button" class="qt" aria-pressed="${k===qT}" data-k="${k}">${k}${qBest[k]!=null?' · '+qBest[k]+'/5':''}</button>`).join('');
  $('quiz').innerHTML=`<p class="qp">${Q[0]}</p><div class="qops">${Q[1].map((o,i)=>`<button type="button" class="qo" data-i="${i}">${o}</button>`).join('')}</div><p class="qex" hidden>${Q[3]}</p><div class="qnav"><span class="muted">Pregunta ${qI+1} de ${QZ[qT].length}</span><button type="button" class="btn" id="qPrev" ${qI?'':'disabled'}>Anterior</button><button type="button" class="btn pri" id="qNext" ${qI<QZ[qT].length-1?'':'disabled'}>Siguiente</button></div><p class="qscore" id="qSc"></p>`;
  document.querySelectorAll('#qTabs .qt').forEach(b=>b.addEventListener('click',()=>{qT=b.dataset.k;qI=0;qScore={};qRender()}));
  document.querySelectorAll('#quiz .qo').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.i;document.querySelectorAll('#quiz .qo').forEach(x=>{x.disabled=true;if(+x.dataset.i===Q[2])x.classList.add('ok')});if(i!==Q[2])b.classList.add('ko');document.querySelector('#quiz .qex').hidden=false;
    qScore[qI]=i===Q[2];const n=Object.keys(qScore).length,s=Object.values(qScore).filter(Boolean).length;$('qSc').textContent=`Llevas ${s} de ${n}`;if(n===QZ[qT].length){if(qBest[qT]==null||s>qBest[qT]){qBest[qT]=s;try{localStorage.setItem(QKEY,JSON.stringify(qBest))}catch(e){}}$('qSc').textContent=`Resultado: ${s} de ${n}`}}));
  $('qPrev').addEventListener('click',()=>{qI--;qRender()});$('qNext').addEventListener('click',()=>{qI++;qRender()});mtypeset($('quiz'))}
try{qRender();
}catch(__e){if(window.__DBG)console.warn(__e)}

const CARDS=[['Margen de fase','MF = 180° + ∠GH(jωc), con |GH(jωc)| = 1'],['Margen de ganancia','MG = −20·log|GH(jω180)|, con ∠GH = −180°'],['Cómo hallar ω180','Separar el denominador en real e imaginaria y hacer Im = 0'],['Cómo hallar ωc','|G| = 1, elevar al cuadrado y cambio t = ω²'],['Pendiente de un polo','−20 dB/déc desde su esquina; fase −45° en la esquina'],['Par complejo en ωn','−40 dB/déc después; vale −20·log(2ζ) en ωn; fase −90°'],['Fase final del Bode','−90·(n − m)°'],['Recta de un integrador','−20 dB/déc, pasa por 20·log K_B en ω = 1'],['Criterio de Nyquist','Z = N + P; estable si Z = 0'],['Inicio del Nyquist de tipo 1','Infinito con −90°; asíntota Re = lím Re G(jω)'],['Ancho de banda','|T(jω_b)| = |T(0)|/√2 en lazo cerrado'],['MF y amortiguamiento','MF ≈ 100·ζ (ζ < 0,7)'],['Pico de resonancia','Mr = 1/(2ζ√(1−ζ²)) en ωr = ωn√(1−2ζ²)'],['Adelanto: α','α = (1 − sen φm)/(1 + sen φm)'],['Adelanto: dónde va','ωm donde |G₁| = −20·log(1/√α); T = 1/(ωm√α)'],['Atraso: β','β = 10^(|G₁(jωc)|dB/20); cero en ωc/10'],['Retardo en el MF','Resta ωc·L·180/π grados'],['Salida ante senoide','y = A|G(jω)|·sen(ωt + ∠G(jω))'],['Error rampa tipo 1','e = 1/Kv, Kv = lím s·G'],['Windup: solución','Recálculo con 1/Tt o integración condicional'],['Feedforward','Gff = −Gd/Gp'],['ZN ganancia crítica (PID)','Kp = 0,6Kcr · Ti = 0,5Pcr · Td = 0,125Pcr']];
function cardsRender(list){$('cards').innerHTML=list.map(c=>`<button type="button" class="card" aria-label="Ficha: pulsa para ver la respuesta"><span class="cf">${c[0]}</span><span class="cb" hidden>${c[1]}</span></button>`).join('');
  document.querySelectorAll('#cards .card').forEach(b=>b.addEventListener('click',()=>{const f=b.querySelector('.cf'),k=b.querySelector('.cb');const fl=!b.classList.contains('flip');b.classList.toggle('flip',fl);f.hidden=fl;k.hidden=!fl}))}
try{cardsRender(CARDS);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('cardsSh').addEventListener('click',()=>{const l=CARDS.slice();for(let i=l.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[l[i],l[j]]=[l[j],l[i]]}cardsRender(l)});
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('cardsHide').addEventListener('click',()=>cardsRender(CARDS));
}catch(__e){if(window.__DBG)console.warn(__e)}

/* progreso */
try{{const ids=[...Array(10)].map((_,i)=>'pg'+(i+1)),KEY='ic-progreso';let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
 const up=()=>{const n=ids.filter(id=>$(id).checked).length;$('barfill').style.width=(n/ids.length*100)+'%';$('bartxt').textContent=`${n} de ${ids.length}`};
 ids.forEach(id=>{const el=$(id);el.checked=!!saved[id];el.addEventListener('change',()=>{saved[id]=el.checked;try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){}up()})});up()}
}catch(__e){if(window.__DBG)console.warn(__e)}

/* búsqueda en toda la guía (multipágina) */
try{window.load=load;
}catch(__e){if(window.__DBG)console.warn(__e)}
try{{const S=(window.GUIA&&GUIA.search)||[];const P=(window.GUIA&&GUIA.pages)||{};
 const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
 const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const N=S.map(x=>norm(x.t+' '+x.sec));
 const inp=document.getElementById('srch'),out=document.getElementById('srch-out');
 if(inp&&out)inp.addEventListener('input',e=>{const q=norm(e.target.value.trim());if(q.length<2){out.hidden=true;out.innerHTML='';return}
  const words=q.split(/\s+/);const r=[];for(let i=0;i<S.length&&r.length<20;i++)if(words.every(w=>N[i].includes(w)))r.push(S[i]);
  out.hidden=false;
  out.innerHTML=r.length?r.map(x=>`<a class="sres" href="${x.p}.html#${x.a}" style="--tc:${x.tc}"><span class="sres-t">${esc((P[x.p]||{}).title||'')} · ${esc(x.sec)}</span>${esc(x.t.slice(0,120))}</a>`).join(''):'<p class="muted" style="margin:0">Sin resultados.</p>'})}
}catch(__e){if(window.__DBG)console.warn(__e)}
/* abrir la calculadora con una función enviada desde otra página */
try{if(location.hash.startsWith('#calc=')&&document.getElementById('cNum')){try{const a=JSON.parse(decodeURIComponent(location.hash.slice(6)));setTimeout(()=>load(...a),50)}catch(e){}}
}catch(__e){if(window.__DBG)console.warn(__e)}

/* índice activo y volver arriba */
try{{const links=[...document.querySelectorAll('.toc a')];const map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
 if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.remove('on'));const a=map.get(e.target.id);if(a){a.classList.add('on');if(matchMedia('(max-width:860px)').matches)a.scrollIntoView({block:'nearest',inline:'center'})}}})},{rootMargin:'-20% 0px -70% 0px'});
  map.forEach((a,id)=>{const el=$(id);if(el)io.observe(el)})}
 window.addEventListener('scroll',()=>$('totop').classList.toggle('show',scrollY>900),{passive:true})}
}catch(__e){if(window.__DBG)console.warn(__e)}


/* ====================================================================
   Diagramas de las preguntas de teoría
   ==================================================================== */
/* 1 · feedforward puro */
try{put('dq1',bd(640,200,[
 {l:[22,44],t:'d',c:'bt'},{w:[[34,40],[118,40]],end:false},{d:[120,40]},
 {w:[[120,40],[300,40]]},{b:[300,20,90,40],t:'Gd(s)'},{w:[[390,40],[520,40],[520,129]]},
 {w:[[120,40],[120,140],[150,140]],c:'wire2'},{b:[150,120,100,40],t:'−Gd/Gp',c:'blk2',sub:'feedforward'},
 {w:[[250,140],[330,140]],c:'wire2'},{l:[290,132],t:'m'},{b:[330,120,90,40],t:'Gp(s)',sub:'proceso'},
 {w:[[420,140],[509,140]]},{s:[520,140],signs:[['+',-16,-10],['+',12,-14]]},{w:[[531,140],[610,140]]},{l:[622,144],t:'y',c:'bt'},
 {l:[440,100],t:'Gd·d  +  Gp·m  =  0',c:'st'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 2 · cadena digital y aproximaciones */
try{put('dq2',bd(700,110,[
 {l:[24,54],t:'e(t)',c:'bt'},{w:[[50,50],[100,50]]},{b:[100,30,80,40],t:'T',sub:'muestreo'},{w:[[180,50],[240,50]]},{l:[210,42],t:'e_k'},
 {b:[240,30,130,40],t:'PID digital',c:'blk2',sub:'ordenador'},{w:[[370,50],[430,50]]},{l:[400,42],t:'u_k'},
 {b:[430,30,80,40],t:'ZOH',sub:'retenedor'},{w:[[510,50],[570,50]]},{l:[540,42],t:'u(t)'},{b:[570,30,100,40],t:'planta'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
try{{const ef=t=>0.25+0.75*Math.exp(-t/2.6)+0.12*Math.sin(1.4*t);const cur=[];for(let t=0;t<=8;t+=0.05)cur.push([t,ef(t)]);
 const ser=[];for(let k=0;k<8;k++){ser.push({pts:[[k,0],[k,ef(k)],[k+1,ef(k+1)],[k+1,0]],cls:'areao'})}
 const k0=5,sl=ef(k0)-ef(k0-1);ser.push({pts:[[k0-1.6,ef(k0-1)-0.6*sl],[k0+0.6,ef(k0)+0.6*sl]],cls:'s1'});ser.push({pts:cur,cls:'sm'});
 const dots=[];for(let k=0;k<=8;k++)dots.push({x:k,y:ef(k),cls:'dotb',r:4});
 put('pq2',plot({id:'q2',h:230,x:[0,8],y:[0,1.15],xticks:[0,1,2,3,4,5,6,7,8],xlabel:'tiempo (en periodos de muestreo T)',ylabel:'e(t)',series:ser,dots,
  labels:[{x:1.5,y:0.12,t:'área = T·(e_k + e_k−1)/2',cls:'l2'},{x:5.3,y:ef(5)+0.12,t:'pendiente = (e_k − e_k−1)/T',cls:'l1'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 3 · windup con áreas */
try{{const r=simPID({Kp:3.6,Ti:3.02,umax:1.2,T:30});const Y=r.Y,U=r.U;
 const sat=U.filter(p=>Math.abs(p[1])>=1.199).map(p=>p[0]);const s0=Math.min(...sat),s1=Math.max(...sat.filter(t=>t<15));
 const pos=[],neg=[];Y.forEach(p=>{if(p[1]<=1)pos.push(p);else neg.push(p)});
 const poly=(arr)=>{const segs=[];let cur=[];for(let i=0;i<arr.length;i++){if(cur.length&&arr[i][0]-cur[cur.length-1][0]>0.2){segs.push(cur);cur=[]}cur.push(arr[i])}if(cur.length)segs.push(cur);return segs.map(s=>s.concat(s.slice().reverse().map(p=>[p[0],1])))};
 const ser=[{pts:[[s0,-1],[s0,3],[s1,3],[s1,-1]],cls:'areak'}].concat(poly(pos).map(p=>({pts:p,cls:'area'})),poly(neg).map(p=>({pts:p,cls:'arean'})),[{pts:Y,cls:'s1'}]);
 put('pq3',plot({id:'q3',h:230,x:[0,30],y:[0,1.4],ylabel:'y(t)',hl:[1],series:ser,labels:[{x:s0+0.3,y:1.3,t:'actuador saturado',cls:'lab'},{x:2.2,y:0.55,t:'área +',cls:'l3'},{x:9,y:1.12,t:'área − = sobrepico',cls:'l4'}]})+
   plot({id:'q3u',h:160,x:[0,30],y:[-0.5,2],ylabel:'u(t)',xlabel:'t (s)',hl:[1.2],series:[{pts:[[s0,-1],[s0,3],[s1,3],[s1,-1]],cls:'areak'},{pts:U,cls:'s2'}],labels:[{x:16,y:1.45,t:'límite del actuador = 1,2'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}
try{$('dq3').innerHTML=window.__dAW||$('dAW').innerHTML;
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 4 · senoide */
try{{const A=0.0135*2,ph=-202.6/DEG,xi=[],yo=[];for(let i=0;i<=500;i++){const t=1.3*i/500;xi.push([t,2*Math.sin(10*t)]);yo.push([t,40*A*Math.sin(10*t+ph)])}
 put('pq4',plot({id:'q4',h:240,x:[0,1.3],y:[-2.4,2.4],xlabel:'t (s)',ylabel:'x(t), 40·y(t)',hl:[0],series:[{pts:xi,cls:'sm'},{pts:yo,cls:'s1'}],
  labels:[{x:0.16,y:2.15,t:'entrada: amplitud 2',cls:'lab'},{x:0.5,y:-1.6,t:'salida ×40: amplitud 0,027 · 40 = 1,08',cls:'l1'},{x:0.16,y:-2.2,t:'periodo 2π/10 = 0,63 s en las dos',cls:'lab'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 5 · feedforward + feedback con sensores */
try{put('dq5',bd(740,260,[
 {l:[16,184],t:'ysp',c:'bt'},{w:[[36,180],[60,180]]},{b:[60,162,50,36],t:'Gsp'},{w:[[110,180],[148,180]]},{s:[160,180],signs:[['+',-16,-10],['−',10,26]]},
 {w:[[171,180],[200,180]]},{b:[200,162,60,36],t:'Gc1',sub:'feedback'},{w:[[260,180],[318,180]]},{s:[330,180],signs:[['+',-16,-10],['+',12,-14]]},
 {w:[[341,180],[370,180]]},{b:[370,162,50,36],t:'Gf',sub:'actuador'},{w:[[420,180],[480,180]]},{l:[450,172],t:'m'},{b:[480,162,60,36],t:'Gp'},
 {w:[[540,180],[598,180]]},{s:[610,180],signs:[['+',-16,-10],['+',12,-14]]},{w:[[621,180],[720,180]]},{l:[730,184],t:'y',c:'bt',a:'end'},
 {l:[200,24],t:'d (perturbación)',c:'bt'},{w:[[250,28],[300,28]],end:false},{d:[300,28]},
 {w:[[300,28],[300,50]],c:'wire2'},{b:[270,50,60,30],t:'Gm2',c:'blk2'},{w:[[300,80],[300,98]],c:'wire2'},{b:[270,98,60,30],t:'Gc2',c:'blk2'},{w:[[300,128],[330,128],[330,169]],c:'wire2'},
 {l:[350,118],t:'feedforward',c:'st',a:'start'},
 {w:[[300,28],[610,28],[610,60]]},{b:[580,60,60,32],t:'Gd'},{w:[[610,92],[610,169]]},
 {d:[680,180]},{w:[[680,180],[680,240],[400,240]]},{b:[340,226,60,28],t:'Gm1'},{w:[[340,240],[160,240],[160,191]]},{l:[250,234],t:'medida de y',c:'st'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 6 · P, PD, PID */
try{{const plant=[[1],[2,3,1]];const a=simPID({Kp:2,plant,T:20}),b=simPID({Kp:8,Td:0.4,plant,T:20}),c=simPID({Kp:8,Ti:2,Td:0.4,plant,T:20});
 put('pq6',plot({id:'q6',h:250,x:[0,20],y:[0,1.4],xlabel:'t (s)',ylabel:'y(t)',hl:[1],series:[{pts:a.Y,cls:'sm'},{pts:b.Y,cls:'s1'},{pts:c.Y,cls:'s2'}],
  labels:[{x:14,y:0.6,t:'P: lento, error 0,33',cls:'lab'},{x:14,y:0.84,t:'PD: rápido, error 0,11',cls:'l1'},{x:14,y:1.07,t:'PID: rápido, error 0',cls:'l2'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 7 · PID completo */
try{put('dq7',bd(760,300,[
 {l:[18,64],t:'r',c:'bt'},{w:[[30,60],[60,60]],end:false},{d:[60,60]},{w:[[60,60],[90,60]]},{b:[90,42,40,36],t:'b'},{w:[[130,60],[171,60]]},
 {s:[182,60],signs:[['+',-16,-10],['−',10,26]]},{w:[[182,104],[182,71]]},{l:[182,118],t:'y'},
 {w:[[193,60],[240,60]]},{b:[240,42,60,36],t:'Kp'},{w:[[300,60],[560,60],[560,139]]},{l:[420,52],t:'acción proporcional · b·r − y'},
 {w:[[60,60],[60,150],[171,150]]},{s:[182,150],signs:[['+',-16,-10],['−',10,26]]},{w:[[182,186],[182,161]]},{l:[188,198],t:'y',a:'start'},
 {w:[[193,150],[240,150]]},{b:[240,132,60,36],t:'Kp/Ti'},{w:[[300,150],[341,150]]},{s:[352,150],signs:[['+',-16,-10],['+',12,26]]},
 {w:[[363,150],[390,150]]},{b:[390,132,50,36],t:'1/s'},{w:[[440,150],[549,150]]},{l:[480,142],t:'integral'},
 {s:[560,150],signs:[['+',-14,-12],['+',-16,8],['+',12,26]]},{w:[[571,150],[600,150]]},{d:[588,150]},{l:[588,142],t:'v'},
 {sat:[600,130,50,40]},{w:[[650,150],[680,150]]},{d:[668,150]},{l:[668,142],t:'u'},{b:[680,132,56,36],t:'G(s)'},{w:[[736,150],[756,150]]},
 {w:[[668,150],[668,198],[601,198]],c:'wire2'},{w:[[588,150],[588,187]],c:'wire2'},{s:[590,198],signs:[['+',20,-6],['−',-12,-14]]},
 {w:[[579,198],[500,198]],c:'wire2'},{b:[440,183,60,30],t:'1/Tt',c:'blk2'},{w:[[440,198],[352,198],[352,161]],c:'wire2'},{l:[470,226],t:'antiwindup: u − v',c:'st'},
 {l:[24,264],t:'−y',c:'bt'},{w:[[40,260],[200,260]]},{b:[200,242,190,36],t:'Kp·Td s/(1+Td s/N)'},{w:[[390,260],[560,260],[560,161]]},{l:[480,252],t:'derivada filtrada, solo sobre y'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 8 · cascada con ejemplo */
try{put('dq8',bd(720,240,[
 {l:[16,98],t:'r₁',c:'bt'},{w:[[30,94],[72,94]]},{s:[84,94],signs:[['+',-16,-10],['−',10,26]]},{w:[[95,94],[126,94]]},
 {b:[126,72,76,44],t:'C₁(s)',sub:'maestro: temperatura'},{w:[[202,94],[246,94]]},{l:[224,86],t:'r₂'},
 {s:[258,94],signs:[['+',-16,-10],['−',10,26]]},{w:[[269,94],[300,94]]},{b:[300,72,72,44],t:'C₂(s)',sub:'esclavo: caudal'},
 {w:[[372,94],[400,94]]},{s:[412,94],signs:[['+',-16,-10],['+',12,-14]]},{w:[[423,94],[450,94]]},
 {b:[450,72,72,44],t:'G₂(s)',sub:'válvula (rápido)'},{w:[[522,94],[572,94]]},{l:[548,86],t:'y₂'},{b:[572,72,72,44],t:'G₁(s)',sub:'horno (lento)'},
 {w:[[644,94],[706,94]]},{l:[706,84],t:'y₁',c:'bt',a:'end'},{l:[412,22],t:'d₂ (presión)',c:'bt'},{w:[[412,30],[412,82]]},
 {d:[548,94]},{w:[[548,94],[548,168],[258,168],[258,106]]},{l:[400,162],t:'lazo secundario (rápido)'},
 {d:[680,94]},{w:[[680,94],[680,222],[84,222],[84,106]]},{l:[400,216],t:'lazo primario (lento)'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 9 · tanques */
try{put('dq9',bd(700,170,[
 {l:[40,58],t:'C_A0',c:'bt'},{w:[[70,54],[150,54]]},{l:[110,44],t:'0,1·sen(0,2t)'},
 {b:[150,40,130,90],t:'tanque 1 · V₁',c:'blk2',sub:'τ = 8,25 min'},{w:[[280,110],[370,110]]},{l:[325,100],t:'C_A1'},
 {b:[370,40,130,90],t:'tanque 2 · V₂',c:'blk2',sub:'τ = 8,25 min'},{w:[[500,110],[600,110]]},{l:[640,114],t:'C_A2',c:'bt'},
 {l:[550,96],t:'atenuada'}]));
}catch(__e){if(window.__DBG)console.warn(__e)}
try{{const xi=[],yo=[];for(let t=0;t<=100;t+=0.5){xi.push([t,0.1*Math.sin(0.2*t)]);yo.push([t,0.012*Math.sin(0.2*t-117.6/DEG)])}
 put('pq9',plot({id:'q9',h:220,x:[0,100],y:[-0.12,0.12],xlabel:'t (min)',ylabel:'mol/m³',hl:[0,0.05,-0.05],series:[{pts:xi,cls:'sm'},{pts:yo,cls:'s1'}],
  labels:[{x:3,y:0.108,t:'entrada: ±0,1',cls:'lab'},{x:52,y:0.062,t:'límite ±0,05',cls:'l4'},{x:52,y:-0.032,t:'salida: ±0,012',cls:'l1'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 10 · relé */
try{put('dq10',bd(620,150,[
 {l:[20,64],t:'r = 0',c:'bt'},{w:[[56,60],[118,60]]},{s:[130,60],signs:[['+',-16,-10],['−',10,26]]},{w:[[141,60],[200,60]]},
 {b:[200,36,90,48],t:'',c:'blk2',sub:'relé ±d'},{w:[[290,60],[360,60]]},{l:[325,52],t:'u = ±d'},{b:[360,40,90,40],t:'G(s)',sub:'planta'},
 {w:[[450,60],[580,60]]},{l:[596,64],t:'y',c:'bt'},{d:[530,60]},{w:[[530,60],[530,130],[130,130],[130,71]]}])
 .replace('</svg>','<polyline class="wire" points="215,72 245,72 245,48 275,48"/></svg>'));
}catch(__e){if(window.__DBG)console.warn(__e)}
try{{const S=sys([1],[1,3,3,1]);const Y=[],U=[];const dt=0.005;for(let k=0;k*dt<=25;k++){const t=k*dt,y=yout(S),u=-y>=0?1:-1;adv(S,u,dt);if(k%10===0){Y.push([t,y*4]);U.push([t,u])}}
 put('pq10',plot({id:'q10',h:220,x:[0,25],y:[-1.6,1.6],xlabel:'t (s)',ylabel:'u, 4·y',hl:[0],series:[{pts:U,cls:'s2'},{pts:Y,cls:'s1'}],
  labels:[{x:13,y:1.35,t:'u: relé ±d (d = 1)',cls:'l2'},{x:9,y:-1.4,t:'y ×4: amplitud a ≈ 0,16 → Ku ≈ 4d/(πa) ≈ 7,8',cls:'l1'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 11 · patada */
try{{const e=simPID({Kp:4.8,Ti:1.814,Td:0.4535,dOnE:true,T:12,dt:0.002}),m=simPID({Kp:4.8,Ti:1.814,Td:0.4535,b:0.5,T:12,dt:0.002});
 put('pq11',plot({id:'q11',h:240,x:[0,12],y:[-3,12],xlabel:'t (s)',ylabel:'u(t)',hl:[0],series:[{pts:e.U,cls:'s4'},{pts:m.U,cls:'s1'}],
  labels:[{x:0.35,y:11,t:'patada derivativa (el pico real es mucho mayor)',cls:'l4'},{x:3,y:4.5,t:'D sobre y, b = 0,5: arranque suave',cls:'l1'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}
/* 12 · región del plano s */
try{{const th=Math.acos(0.69),L=0.7,tx=L*Math.cos(th),ty=L*Math.sin(th);const yc=0.2*Math.tan(th);
 put('pq12',plot({id:'q12',h:300,x:[-0.7,0.15],y:[-0.6,0.6],xticks:[-0.6,-0.4,-0.2,0],yticks:[-0.4,-0.2,0,0.2,0.4],xlabel:'Re(s)',ylabel:'Im(s)',hl:[0],vl:[0],
  series:[{pts:[[-0.2,yc],[-tx*1.2,ty*1.2],[-0.7,ty*1.2],[-0.7,-ty*1.2],[-tx*1.2,-ty*1.2],[-0.2,-yc]],cls:'area'},{pts:[[0,0],[-tx*1.3,ty*1.3]],cls:'sm'},{pts:[[0,0],[-tx*1.3,-ty*1.3]],cls:'sm'},{pts:[[-0.2,-1],[-0.2,1]],cls:'s2'}],
  dots:[{x:-0.21,y:0.214,r:6,cls:'dotb'},{x:-0.21,y:-0.214,r:6,cls:'dotb'}],
  labels:[{x:-0.19,y:0.5,t:'ζω_n = 0,2 (ts = 20 s)',cls:'l2',a:'start'},{x:-0.52,y:0.52,t:'ζ = 0,69 (Mp = 5 %)',cls:'lab'},{x:-0.6,y:0.08,t:'zona válida',cls:'l3'},{x:-0.2,y:0.214,dx:-10,dy:-8,t:'polos elegidos',cls:'l1',a:'end'}]}))}
}catch(__e){if(window.__DBG)console.warn(__e)}


/* ====================================================================
   Simulacro: temporizador
   ==================================================================== */
try{{let left=7200,tid=null;const show=()=>{const h=Math.floor(left/3600),m=Math.floor(left%3600/60),s=left%60;$('tmO').textContent=`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;$('tmO').style.color=left<600?'var(--warn)':''};
 $('tmGo').addEventListener('click',()=>{if(tid)return;tid=setInterval(()=>{if(left>0){left--;show()}else{clearInterval(tid);tid=null;$('tmO').textContent='¡Tiempo!'}},1000)});
 $('tmPause').addEventListener('click',()=>{clearInterval(tid);tid=null});$('tmReset').addEventListener('click',()=>{clearInterval(tid);tid=null;left=7200;show()});show();
 $('simulacro').closest('section').querySelectorAll('[data-chk]').forEach(b=>b.addEventListener('click',()=>load(...JSON.parse(b.getAttribute('data-chk')))))}
}catch(__e){if(window.__DBG)console.warn(__e)}

/* utilidades comunes de los entrenadores */
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const nfix=v=>{const r=Math.abs(v)>=100?Math.round(v):Math.abs(v)>=10?Math.round(v*10)/10:Math.round(v*1000)/1000;return String(r).replace('.',',')};
const parseN=v=>{v=String(v).trim().toLowerCase().replace(',','.');return v===''?NaN:(v.startsWith('inf')||v==='∞')?Infinity:+v};
function tfStr(K,zs,N,ps){/* K·Π(s+z)/(s^N·Π(s+p)) */const f=r=>`(s + ${nfix(r)})`;const num=(zs.length?nfix(K)+zs.map(f).join(''):nfix(K));const den=(N?'s'+(N>1?'²':''):'')+ps.map(f).join('');return `${num} / ${den||'1'}`}

/* ====================================================================
   Entrenador 1 · Bode asintótico dibujado por ti
   ==================================================================== */
let BD=null;
function bdNew(){const pool=[0.1,0.2,0.5,1,2,5,10,20,50];const n=ri(2,3);const cs=shuffle(pool).slice(0,n).sort((a,b)=>a-b);
  const fs=cs.map(c=>({w:c,z:Math.random()<0.25}));if(fs.every(f=>f.z))fs[fs.length-1].z=false;const N=pick([0,1,1]);const KB=pick([1,2,5,10,20,50,100]);
  const K=KB*fs.filter(f=>!f.z).reduce((s,f)=>s*f.w,1)/fs.filter(f=>f.z).reduce((s,f)=>s*f.w,1);
  BD={fs,N,KB,K};$('bdQ').innerHTML='G(s) = '+tfStr(K,fs.filter(f=>f.z).map(f=>f.w),N,fs.filter(f=>!f.z).map(f=>f.w));
  const opts=[-80,-60,-40,-20,0,20,40].map(v=>`<option>${v}</option>`).join('');
  $('bdRows').innerHTML=fs.map((_,i)=>`<div class="ctrl"><span class="mono" style="min-width:5.5em">esquina ${i+1}</span><label for="bdW${i}">ω = <input type="number" id="bdW${i}" step="any"></label><label for="bdP${i}">pendiente después <select id="bdP${i}">${opts}</select> dB/déc</label></div>`).join('');
  $('bdS0').value='-20';$('bdV1').value='';$('bdRes').innerHTML='';put('bdPlot','')}
function bdTrue(){const{fs,N,KB}=BD;let s=-20*N;const rows=fs.map(f=>{s+=f.z?20:-20;return{w:f.w,s}});return{s0:-20*N,v1:20*L10(KB),rows}}
function asyLine(s0,v1,rows,lo,hi){/* polilínea en log ω */const pts=[];let w=lo,v=v1+s0*L10(lo),s=s0;pts.push([w,v]);rows.slice().sort((a,b)=>a.w-b.w).forEach(r=>{if(!(r.w>lo&&r.w<hi))return;v+=s*(L10(r.w)-L10(w));w=r.w;pts.push([w,v]);s=r.s});v+=s*(L10(hi)-L10(w));pts.push([hi,v]);return pts}
function bdDraw(user){const T=bdTrue(),lo=Math.min(...BD.fs.map(f=>f.w))/10,hi=Math.max(...BD.fs.map(f=>f.w))*10;const tp=asyLine(T.s0,T.v1,T.rows,lo,hi);
  const series=[{pts:tp,cls:'asy'}];if(user)series.push({pts:asyLine(user.s0,user.v1,user.rows,lo,hi),cls:'s2'});
  const exact=logspace(L10(lo),L10(hi),300).map(w=>{let g=C(BD.K);BD.fs.forEach(f=>{g=f.z?mul(g,C(f.w,w)):div(g,C(f.w,w))});for(let i=0;i<BD.N;i++)g=div(g,C(0,w));return[w,20*L10(cabs(g))]});series.unshift({pts:exact,cls:'s1 thin'});
  const all=tp.map(p=>p[1]).concat(exact.map(p=>p[1]));put('bdPlot',plot({id:'bdt',h:260,xlog:true,x:[lo,hi],y:[Math.floor(Math.min(...all)/20)*20,Math.ceil(Math.max(...all,0)/20)*20],ylabel:'|G| (dB)',xlabel:'ω (rad/s)',hl:[0],vl:BD.fs.map(f=>f.w),series,
   labels:[{x:lo,y:Math.ceil(Math.max(...all,0)/20)*20,dx:6,dy:14,t:'negro discontinuo: asíntota correcta · naranja: la tuya · azul: curva real',cls:'lab'}]}))}
function bdChk(){if(!BD)return;const T=bdTrue();const user={s0:+$('bdS0').value,v1:parseN($('bdV1').value),rows:BD.fs.map((_,i)=>({w:parseN($('bdW'+i).value),s:+$('bdP'+i).value}))};
  const ok=[['pendiente inicial',user.s0===T.s0],['valor en ω = 1',Math.abs(user.v1-T.v1)<=1]];const us=user.rows.slice().sort((a,b)=>a.w-b.w);
  T.rows.forEach((r,i)=>{const u=us[i];ok.push([`esquina ${i+1}`,u&&isFinite(u.w)&&Math.abs(u.w-r.w)<=0.05*r.w&&u.s===r.s])});
  $('bdRes').innerHTML=ok.map(([n,o])=>`<span class="chip ${o?'ok':'bad'}">${n} ${o?'✓':'✗'}</span>`).join('');if(!isFinite(user.v1))user.v1=T.v1;bdDraw(user)}
function bdSol(){if(!BD)return;const T=bdTrue();$('bdS0').value=String(T.s0);$('bdV1').value=fmt(T.v1,1).replace(',','.');T.rows.forEach((r,i)=>{$('bdW'+i).value=r.w;$('bdP'+i).value=String(r.s)});bdChk()}
try{$('bdNew').addEventListener('click',bdNew);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('bdChk').addEventListener('click',bdChk);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('bdSol').addEventListener('click',bdSol);
}catch(__e){if(window.__DBG)console.warn(__e)}try{bdNew();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   Entrenador 2 · Reconoce el Nyquist
   ==================================================================== */
const NQF=[
 ()=>{const a=pick([1,2,5]),K=pick([2,5,10]);return{t:`${K}/(s + ${a})`,num:[K],den:[1,a],d:'tipo 0, un polo: semicircunferencia de K/a a 0, llega con −90°'}},
 ()=>{const a=pick([1,2]),b=pick([3,5]),K=pick([10,20]);return{t:`${K}/((s + ${a})(s + ${b}))`,num:[K],den:pm([1,a],[1,b]),d:'tipo 0, dos polos: empieza en el eje real positivo y llega con −180° sin cortar el eje real negativo'}},
 ()=>{const K=pick([4,6,10]);return{t:`${K}/(s + 1)³`,num:[K],den:[1,3,3,1],d:'tipo 0, tres polos: llega con −270°, así que corta el eje real negativo (en −K/8)'}},
 ()=>{const a=pick([1,2,4]),K=pick([2,5,10]);return{t:`${K}/(s(s + ${a}))`,num:[K],den:[1,a,0],d:'tipo 1, dos polos: viene de −j∞ (asíntota vertical) y llega con −180° sin cortar el eje real'}},
 ()=>{const K=pick([2,4]);return{t:`${K}/(s(s + 1)(s + 2))`,num:[K],den:pm([1,0],[1,1],[1,2]),d:'tipo 1, tres polos: viene de −j∞ y llega con −270°; corta el eje real en −K/6, a la derecha de −1'}},
 ()=>{const K=pick([10,15]);return{t:`${K}/(s(s + 1)(s + 2))`,num:[K],den:pm([1,0],[1,1],[1,2]),d:'tipo 1, tres polos: corta el eje real en −K/6, a la izquierda de −1, así que rodea el −1'}},
 ()=>{const K=pick([1,2]);return{t:`${K}(s + 1)/(s²(s + 5))`,num:[K,K],den:[1,5,0,0],d:'tipo 2: viene del infinito con −180° (desde la izquierda)'}},
 ()=>{const K=pick([2,5]);return{t:`${K}(s + 2)/((s + 1)(s + 5))`,num:[K,2*K],den:pm([1,1],[1,5]),d:'tipo 0 con un cero: n − m = 1, llega al origen con −90°'}}];
let NQ=null;
function nqNew(){const idx=shuffle([...NQF.keys()]);let fam=idx.slice(0,4);/* evitar dos versiones de la misma familia 4/5 */if(fam.includes(4)&&fam.includes(5))fam=fam.filter(i=>i!==5).concat(idx.slice(4).filter(i=>i!==4&&i!==5)[0]);
  const items=fam.map(i=>NQF[i]());const ans=Math.floor(Math.random()*4);NQ={items,ans};$('nqQ').textContent='G(s) = '+items[ans].t;$('nqRes').innerHTML='';$('nqEx').hidden=true;
  $('nqOpts').innerHTML=items.map((it,i)=>`<button type="button" class="qo" data-i="${i}" style="padding:8px"><b>${'ABCD'[i]}</b><div class="plot" id="nqo${i}"></div></button>`).join('');
  items.forEach((it,i)=>put('nqo'+i,nyqPlot('nqp'+i,it.num,it.den,{mirror:false,h:230})));
  document.querySelectorAll('#nqOpts .qo').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.i;document.querySelectorAll('#nqOpts .qo').forEach(x=>{x.disabled=true;if(+x.dataset.i===ans)x.classList.add('ok')});if(i!==ans)b.classList.add('ko');
    const inf=nyqInfo(items[ans].num,items[ans].den);$('nqRes').innerHTML=`<span class="chip ${i===ans?'ok':'bad'}">${i===ans?'correcto':'era la '+'ABCD'[ans]}</span><span class="chip ${inf.Z===0?'ok':'bad'}">lazo cerrado ${inf.Z===0?'estable':'inestable'} (Z = ${inf.Z})</span>`;
    $('nqEx').textContent='Por qué: '+items[ans].d+'.';$('nqEx').hidden=false}))}
try{$('nqNew').addEventListener('click',nqNew);
}catch(__e){if(window.__DBG)console.warn(__e)}try{nqNew();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   Entrenador 3 · Leer márgenes en una gráfica
   ==================================================================== */
let RD=null;
function rdGen(){for(let k=0;k<40;k++){const t=pick(['a','b','b','c']);let den,txt;
   if(t==='a'){const a=pick([1,2,4]);den=[1,a,0];txt=`s(s + ${a})`}else if(t==='b'){const a=pick([1,2]),b=pick([4,5,10]);den=pm([1,0],[1,a],[1,b]);txt=`s(s + ${a})(s + ${b})`}else{den=pm([1,1],[1,2],[1,5]);txt='(s + 1)(s + 2)(s + 5)'}
   const K=Math.round(Math.pow(10,L10(den[den.length-1]||den[den.length-2])+Math.random()*1.4-0.2));const fr=freq([K],den,logspace(-2,2,900)),m=margins(fr);if(m.wc&&m.mf>8&&m.mf<70)return{K,den,txt,fr,m}}
  return rdGen()}
function rdDraw(show){const{fr,m}=RD;const mags=fr.map(p=>p.mag);put('rdPlot',bodePair('rdp',[{fr,cls:'s1',mfDot:show&&m.wc?{x:m.wc,y:m.mf-180}:null,magDot:show&&m.w180?{x:m.w180,y:-m.mg,cls:'doto'}:null}],{x:[0.01,100],magR:[Math.max(-80,Math.floor(Math.min(...mags)/20)*20),Math.ceil(Math.max(...mags)/20)*20],phR:[-270,-90],wc:show?m.wc:null}))}
function rdNew(){RD=rdGen();['rdWc','rdMF','rdW1','rdMG'].forEach(id=>$(id).value='');$('rdRes').innerHTML='';rdDraw(false)}
function rdChk(){if(!RD)return;const{m}=RD;const ok=(u,t,rel,abs)=>{if(!isFinite(t))return!isFinite(u)&&u>0;if(!isFinite(u))return false;return Math.abs(u-t)<=Math.max(abs,rel*Math.abs(t))};
  const r=[['ωc',ok(parseN($('rdWc').value),m.wc,0.1,0)],['MF',ok(parseN($('rdMF').value),m.mf,0,4)],['ω180',ok(parseN($('rdW1').value),m.w180||Infinity,0.1,0)],['MG',ok(parseN($('rdMG').value),m.mg,0,2)]];
  $('rdRes').innerHTML=r.map(([n,o])=>`<span class="chip ${o?'ok':'bad'}">${n} ${o?'✓':'✗'}</span>`).join('')}
try{$('rdNew').addEventListener('click',rdNew);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('rdChk').addEventListener('click',rdChk);
}catch(__e){if(window.__DBG)console.warn(__e)}
try{$('rdShow').addEventListener('click',()=>{if(!RD)return;const{m}=RD;rdDraw(true);$('rdRes').innerHTML=`<span class="chip">ωc = ${fmt(m.wc,2)}</span><span class="chip">MF = ${fmt(m.mf,1)}°</span><span class="chip">ω180 = ${m.w180?fmt(m.w180,2):'—'}</span><span class="chip">MG = ${fdb(m.mg)}</span><span class="chip">G = ${RD.K}/(${RD.txt})</span>`});
}catch(__e){if(window.__DBG)console.warn(__e)}try{rdNew();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   Entrenador 4 · Diseña el compensador
   ==================================================================== */
let CP=null;
function magAt(num,den,w){return 20*L10(cabs(div(pval(num,C(0,w)),pval(den,C(0,w)))))}
function findW(f,lo,hi){/* raíz por bisección en log ω de f decreciente */let a=L10(lo),b=L10(hi);for(let i=0;i<80;i++){const c=(a+b)/2;if(f(Math.pow(10,c))>0)a=c;else b=c}return Math.pow(10,(a+b)/2)}
function phAt(num,den,w){return freq(num,den,logspace(-4,L10(w),500)).pop().ph}
function cpNew(){for(let k=0;k<50;k++){const lead=Math.random()<0.5;let den,txt,kvDen,Kv,MFd,needMG=false;
   if(lead){const a=pick([1,2,4,5]);den=[1,a,0];txt=`s(s + ${a})`;kvDen=a;Kv=pick([10,20]);MFd=pick([45,50])}
   else{const[a,b]=pick([[1,2],[1,4],[2,4],[1,5]]);den=pm([1,0],[1,a],[1,b]);txt=`s(s + ${a})(s + ${b})`;kvDen=a*b;Kv=pick([2,4,5]);MFd=pick([40,45]);needMG=true}
   const K=Kv*kvDen;const m=margins(freq([K],den,logspace(-3,3,2000)));if(m.mf!=null&&m.mf<MFd-5){CP={lead,den,txt,kvDen,Kv,MFd,needMG,K,m0:m};break}}
  $('cpQ').innerHTML=`Planta G(s) = 1/(${CP.txt}), realimentación unitaria. Consigue K<sub>v</sub> = ${CP.Kv} s⁻¹ y MF ≥ ${CP.MFd}°${CP.needMG?' con MG ≥ 10 dB':''}.`;
  ['cpK','cpA','cpTT'].forEach(id=>$(id).value='');$('cpRes').innerHTML='';$('cpSol').hidden=true;put('cpPlot','')}
function cpRef(){const{den,K,MFd,lead}=CP;const G1=[[K],den];const m0=margins(freq(...G1,logspace(-3,3,2000)));let s=`1) K para el error: Kv = K/${CP.kvDen} = ${CP.Kv} ⇒ K = ${K}. G₁ = ${K}/(${CP.txt}).\n2) G₁: ωc = ${fmt(m0.wc,3)}, MF = ${fmt(m0.mf,1)}°${isFinite(m0.mg)?`, MG = ${fmt(m0.mg,1)} dB`:''}.\n`;
  if(lead){for(let eps=5;eps<=20;eps+=1){const phi=(MFd-m0.mf+eps)/DEG;const a=(1-Math.sin(phi))/(1+Math.sin(phi));if(a<0.05)break;const wm=findW(w=>magAt(...G1,w)+10*L10(1/a),1e-3,1e3);const T=1/(wm*Math.sqrt(a));
      const m=margins(freq(pm([K],[T,1]),pm(den,[a*T,1]),logspace(-3,3,2000)));if(m.mf>=MFd-0.3){s+=`3) Adelanto: φm = ${MFd} − ${fmt(m0.mf,1)} + ${eps} = ${fmt(phi*DEG,1)}° ⇒ α = ${fmt(a,3)}.\n4) |G₁| = −${fmt(10*L10(1/a),2)} dB en ωm = ${fmt(wm,3)} ⇒ T = 1/(ωm√α) = ${fmt(T,3)}.\n5) C(s) = ${K}·(${fmt(T,3)}s + 1)/(${fmt(a*T,4)}s + 1) ⇒ MF = ${fmt(m.mf,1)}°.`;return{s,a,T,K}}}
    s+='3) Un adelanto no llega: hace falta un atraso.\n'}
  for(let eps=5;eps<=15;eps++){const wc=findW(w=>phAt(...G1,w)+180-MFd-eps,1e-3,m0.wc||100);const b=Math.pow(10,magAt(...G1,wc)/20);const T=10/wc;const m=margins(freq(pm([K],[T,1]),pm(den,[b*T,1]),logspace(-4,3,2500)));
    if(m.mf>=MFd&&(!CP.needMG||m.mg>=10)){s+=`3) Atraso: fase objetivo −180 + ${MFd} + ${eps} = ${-180+MFd+eps}° en ωc = ${fmt(wc,3)}.\n4) |G₁(jωc)| = ${fmt(20*L10(b),2)} dB ⇒ β = ${fmt(b,2)}; cero en ωc/10 ⇒ T = ${fmt(T,2)}.\n5) C(s) = ${K}·(${fmt(T,2)}s + 1)/(${fmt(b*T,1)}s + 1) ⇒ MF = ${fmt(m.mf,1)}°, MG = ${fdb(m.mg)}.`;return{s,a:b,T,K,lag:true}}}
  return{s:s+'(sin solución sencilla)'}}
function cpChk(){if(!CP)return;const K=parseN($('cpK').value),a=parseN($('cpA').value),T=parseN($('cpTT').value),lag=$('cpT').value==='lag';
  if(![K,a,T].every(isFinite)){$('cpRes').innerHTML='<span class="chip bad">Rellena K, α o β y T con números</span>';return}
  const num=pm([K],[T,1]),den=pm(CP.den,[a*T,1]);const m=margins(freq(num,den,logspace(-4,3,2500)));const kv=K/CP.kvDen;
  const r=[[`Kv = ${fmt(kv,2)}`,Math.abs(kv-CP.Kv)<=0.03*CP.Kv],[`${lag?'β':'α'} ${lag?(a>1?'> 1':'≤ 1'):(a<1&&a>=0.05?'válido':'fuera de [0,05 ; 1)')}`,lag?a>1:(a<1&&a>=0.05)],[`MF = ${m.mf!=null?fmt(m.mf,1)+'°':'—'}`,m.mf!=null&&m.mf>=CP.MFd-1]];
  if(CP.needMG)r.push([`MG = ${fdb(m.mg)}`,m.mg>=10]);
  $('cpRes').innerHTML=r.map(([n,o])=>`<span class="chip ${o?'ok':'bad'}">${n} ${o?'✓':'✗'}</span>`).join('');
  const g0=freq([CP.K],CP.den,logspace(-4,3,700)),g1=freq(num,den,logspace(-4,3,700));put('cpPlot',bodePair('cpb',[{fr:g0,cls:'s4 dash'},{fr:g1,cls:'s1',mfDot:m.wc?{x:m.wc,y:m.mf-180}:null}],{x:[0.0001,1000],magR:[-80,120],phR:[-270,-90],wc:m.wc,tgt:-180+CP.MFd}));
  if(r.some(x=>!x[1])){$('cpSol').textContent=cpRef().s;$('cpSol').hidden=false}}
try{$('cpNew').addEventListener('click',cpNew);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('cpChk').addEventListener('click',cpChk);
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('cpShow').addEventListener('click',()=>{if(!CP)return;const R=cpRef();$('cpSol').textContent=R.s;$('cpSol').hidden=false;if(R.T){$('cpT').value=R.lag?'lag':'lead';$('cpK').value=R.K;$('cpA').value=+R.a.toFixed(4);$('cpTT').value=+R.T.toFixed(4)}});
}catch(__e){if(window.__DBG)console.warn(__e)}try{cpNew();
}catch(__e){if(window.__DBG)console.warn(__e)}

/* ====================================================================
   Maqueta de tanques
   ==================================================================== */
let tkMode='tkA';
function tkSim(){const Kp=+$('tkKp').value,Ki=+$('tkKi').value,aw=$('tkAW').checked;$('tkKpV').textContent=Kp;$('tkKiV').textContent=Ki.toFixed(1);
  const A=50,c=5,kb=0.6,Ts=0.3,dt=0.05;let h1=0,h2=0,S=0,So=0;const H1=[],H2=[],R=[],U=[];let sat=0,n=0;
  const ref=t=>t<150?7:t<240?10:12;
  for(let k=0;k*Ts<=600;k++){const t=k*Ts,r=ref(t);let u,c0;
    if(tkMode==='tkE'){u=t<150?126:t<240?134:140}
    else if(tkMode==='tkD'){const e2=r-h2;const r1=Math.max(0,Math.min(30,r+1.0*e2+0.1*Ki*So));const e1=r1-h1;c0=Kp*e1;u=140+c0;So+=e2*Ts}
    else{const e=(tkMode==='tkC'?r-h2:r-h1);c0=Kp*e+(tkMode==='tkA'?0:Ki*S);u=140+c0;const us=Math.max(0,Math.min(250,u));if(!(aw&&us!==u&&Math.sign(e)===Math.sign(u-us)))S+=e*Ts}
    const us=Math.max(0,Math.min(250,u));if(us!==u)sat++;n++;
    for(let j=0;j<Ts/dt;j++){const q=kb*Math.max(0,us-100),o1=c*Math.sqrt(Math.max(h1,0)),o2=c*Math.sqrt(Math.max(h2,0));h1=Math.min(40,Math.max(0,h1+dt*(q-o1)/A));h2=Math.min(40,Math.max(0,h2+dt*(o1-o2)/A))}
    if(k%3===0){H1.push([t,h1]);H2.push([t,h2]);R.push([t,r]);U.push([t,us])}}
  put('tkPlot',plot({id:'tkh',h:250,x:[0,600],y:[0,16],ylabel:'altura (cm)',series:[{pts:R,cls:'sm dash'},{pts:H1,cls:'s1'},{pts:H2,cls:'s2'}],labels:[{x:5,y:15,t:'azul: h₁ · naranja: h₂ · gris: referencia',cls:'lab'}]})+
    plot({id:'tku',h:160,x:[0,600],y:[0,260],yticks:[0,100,140,250],ylabel:'u (PWM)',xlabel:'t (s)',hl:[250,100],series:[{pts:U,cls:'s3'}]}));
  const last=H1[H1.length-1][1],last2=H2[H2.length-1][1];const ctl=tkMode==='tkC'||tkMode==='tkD'?'h₂':'h₁';
  const lin=h=>({K:2*kb*Math.sqrt(h)/c,tau:2*A*Math.sqrt(h)/c});const L10m=lin(10);
  $('tkR').innerHTML=tkMode==='tkE'?`<span class="chip">u = 126 → 134 → 140</span><span class="chip">modelo lineal en 10 cm: K = ${fmt(L10m.K,2)} cm/PWM, τ = ${fmt(L10m.tau,0)} s</span><span class="chip">h₁ final = ${fmt(last,2)} cm</span>`:
   `<span class="chip">controla ${ctl}</span><span class="chip ${Math.abs(12-(ctl==='h₁'?last:last2))<0.1?'ok':'bad'}">error final = ${fmt(12-(ctl==='h₁'?last:last2),2)} cm</span><span class="chip ${sat/n>0.3?'bad':''}">bomba saturada el ${fmt(100*sat/n,0)} % del tiempo</span>${tkMode==='tkD'?'<span class="chip">externo: PI con Kp = 1 y Ki = Ki/10</span>':''}`;
  $('tkKi').disabled=tkMode==='tkA'||tkMode==='tkE';$('tkKp').disabled=tkMode==='tkE'}
try{seg(['tkA','tkB','tkC','tkD','tkE'],id=>{tkMode=id;if(id==='tkB'){$('tkKp').value=20;$('tkKi').value=0.3}if(id==='tkC'){$('tkKp').value=10;$('tkKi').value=0.1}if(id==='tkD'){$('tkKp').value=60;$('tkKi').value=1}if(id==='tkA'){$('tkKp').value=200;$('tkKi').value=0}tkSim()});
}catch(__e){if(window.__DBG)console.warn(__e)}
try{['tkKp','tkKi'].forEach(id=>$(id).addEventListener('input',tkSim));
}catch(__e){if(window.__DBG)console.warn(__e)}try{$('tkAW').addEventListener('change',tkSim);
}catch(__e){if(window.__DBG)console.warn(__e)}try{tkSim();
}catch(__e){if(window.__DBG)console.warn(__e)}

})();

;

/* ====================================================================
   Simulacro aleatorio: genera un examen nuevo con solución y baremo
   ==================================================================== */
(function(){
const $=id=>document.getElementById(id);
try{if(!$('smEnun'))return;
}catch(__e){if(window.__DBG)console.warn(__e)}
/* RNG con semilla para poder repetir un examen por su número */
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R;try{R=Math.random;}catch(__e){if(window.__DBG)console.warn(__e)}const pk=a=>a[Math.floor(R()*a.length)];
let D;try{D=180/Math.PI;}catch(__e){if(window.__DBG)console.warn(__e)}
const fx=(v,d=2)=>{if(!isFinite(v))return '∞';let s=(Math.round(v*10**d)/10**d).toFixed(d);if(d>0)s=s.replace(/\.?0+$/,'');if(s==='-0')s='0';return s.replace('.',',').replace(/^-/,'−')};
const fg=v=>{const a=Math.abs(v);return fx(v,a>=100?0:a>=10?1:a>=1?2:3)};
/* planta K / (s^N · Π(s+p)) con compensador (1+T1 s)/(1+T2 s) opcional */
const mk=(K,N,ps,c)=>({K,N,ps,c});
function mag(G,w){let m=G.K/Math.pow(w,G.N);for(const p of G.ps)m/=Math.hypot(w,p);if(G.c)m*=Math.hypot(1,w*G.c[0])/Math.hypot(1,w*G.c[1]);return m}
function ph(G,w){let f=-90*G.N;for(const p of G.ps)f-=Math.atan(w/p)*D;if(G.c)f+=(Math.atan(w*G.c[0])-Math.atan(w*G.c[1]))*D;return f}
const LW=[];try{for(let i=0;i<=1600;i++)LW.push(10**(-3+i*6/1600));
}catch(__e){if(window.__DBG)console.warn(__e)}
function bis(f,a,b){let fa=f(a);for(let i=0;i<80;i++){const m=Math.sqrt(a*b),fm=f(m);if((fm>0)===(fa>0)){a=m;fa=fm}else b=m}return Math.sqrt(a*b)}
function wc(G){let k=-1;for(let i=0;i<LW.length;i++)if(mag(G,LW[i])>=1)k=i;if(k<0||k===LW.length-1)return NaN;return bis(w=>mag(G,w)-1,LW[k],LW[k+1])}
function w180(G){for(let i=1;i<LW.length;i++){if(ph(G,LW[i])<=-180&&ph(G,LW[i-1])>-180)return bis(w=>ph(G,w)+180,LW[i-1],LW[i])}return Infinity}
function marg(G){const c=wc(G),p=w180(G);return{wc:c,MF:180+ph(G,c),w180:p,MG:isFinite(p)?-20*Math.log10(mag(G,p)):Infinity}}
/* ancho de banda en lazo cerrado (realimentación unitaria) */
function Lc(G,w){/* complejo L(jw) */const m=mag(G,w),f=ph(G,w)/D;return[m*Math.cos(f),m*Math.sin(f)]}
function bw(G){const T0=G.N>0?1:(()=>{const k=mag(G,1e-6);return k/(1+k)})();const tg=T0/Math.SQRT2;const T=w=>{const[x,y]=Lc(G,w);return Math.hypot(x,y)/Math.hypot(1+x,y)};let k=-1;for(let i=0;i<LW.length;i++)if(T(LW[i])>=tg)k=i;return k<0||k===LW.length-1?NaN:bis(w=>T(w)-tg,LW[k],LW[k+1])}
const dB=v=>20*Math.log10(v);
const pstr=(N,ps)=>(N?'s':'')+ps.map(p=>`(s+${fx(p)})`).join('');
const pTex=(N,ps)=>(N?'s':'')+ps.map(p=>`(s+${fx(p)})`).join('');
const tag=t=>`<span class="tag">${t}</span>`;
/* ---- baremo autoevaluable ---- */
let RB=[];
function rb(pts,txt){const i=RB.length;RB.push(pts);return `<label class="rbk"><input type="checkbox" data-rb="${i}"> <span>${txt}</span> <b>${fx(pts,2)} p</b></label>`}

/* ================= PROBLEMA DE FRECUENCIA ================= */
function genProblem(){
  for(let tries=0;tries<400;tries++){
    const fam=pk(['t1p3','t1p3','t0p3','t1p2']);
    const obj=pk([40,45,50]);
    let N,ps,K,spec,specTxt,aSol;
    if(fam==='t1p3'){N=1;ps=pk([[1,2],[1,4],[1,5],[2,4],[2,5],[2,8],[1,10],[4,8],[5,10],[2,10]]);const e=pk([0.05,0.1,0.2,0.25,0.5]);const Kv=1/e;K=Kv*ps[0]*ps[1];
      specTxt=`el error en régimen permanente ante una rampa unitaria sea ${fx(e)}`;
      aSol=`Tipo 1: \\(K_v=\\lim_{s\\to0}sG(s)=\\frac{K}{${fx(ps[0]*ps[1])}}\\). \\(e_v=\\frac1{K_v}=${fx(e)}\\Rightarrow K_v=${fx(Kv)}\\Rightarrow\\) <b>K = ${fg(K)}</b>.`}
    else if(fam==='t1p2'){N=1;ps=[pk([1,2,4,5,10])];const e=pk([0.02,0.05,0.1,0.2]);const Kv=1/e;K=Kv*ps[0];
      specTxt=`el error en régimen permanente ante una rampa unitaria sea ${fx(e)}`;
      aSol=`Tipo 1: \\(K_v=\\lim_{s\\to0}sG(s)=\\frac{K}{${fx(ps[0])}}\\). \\(e_v=\\frac1{K_v}=${fx(e)}\\Rightarrow K_v=${fx(Kv)}\\Rightarrow\\) <b>K = ${fg(K)}</b>.`}
    else{N=0;ps=pk([[1,2,3],[1,2,4],[1,2,5],[1,3,5],[2,3,4],[1,1,2],[1,2,2],[2,4,5],[1,4,5]]);const e=pk([0.05,0.1,0.2]);const Kp=1/e-1;const P=ps.reduce((a,b)=>a*b,1);K=Kp*P;
      specTxt=`el error en régimen permanente ante un escalón unitario sea ${fx(e)}`;
      aSol=`Tipo 0: \\(K_p=\\lim_{s\\to0}G(s)=\\frac{K}{${fx(P)}}\\). \\(e_p=\\frac1{1+K_p}=${fx(e)}\\Rightarrow K_p=${fx(Kp)}\\Rightarrow\\) <b>K = ${fg(K)}</b>.`}
    ps=ps.slice().sort((a,b)=>a-b);
    const G=mk(K,N,ps);const m=marg(G);
    if(!(m.MF>3&&m.MF<obj-8))continue;           // tiene que hacer falta compensar
    if(isFinite(m.MG)&&m.MG<1)continue;           // lazo cerrado estable sin compensar
    const d=design(G,m,obj);if(!d)continue;
    return {fam,obj,N,ps,K,G,m,d,specTxt,aSol};
  }
  return null}
function design(G,m,obj){
  /* adelanto (Ogata 7-...) */
  let lead=null;
  for(let eps=5;eps<=15;eps+=1){const phm=obj-m.MF+eps;if(phm>62)break;const s=Math.sin(phm/D),a=(1-s)/(1+s);
    let k=-1;for(let i=0;i<LW.length;i++)if(mag(G,LW[i])>=Math.sqrt(a))k=i;if(k<0)break;const wm=bis(w=>mag(G,w)-Math.sqrt(a),LW[k],LW[k+1]);
    const T=1/(Math.sqrt(a)*wm);const Gc={...G,c:[T,a*T]};const mm=marg(Gc);
    if(mm.MF>=obj-0.5){lead={type:'lead',eps,phm,a,wm,T,G:Gc,m:mm,bw:bw(Gc)};break}}
  /* atraso */
  let lag=null;
  for(let eps=5;eps<=15;eps+=1){const tgt=-180+obj+eps;let w=NaN;for(let i=1;i<LW.length;i++){if(ph(G,LW[i])<=tgt&&ph(G,LW[i-1])>tgt){w=bis(x=>ph(G,x)-tgt,LW[i-1],LW[i]);break}}
    if(!isFinite(w))break;const b=mag(G,w);if(b<=1)break;const T=10/w;const Gc={...G,c:[T,b*T]};const mm=marg(Gc);
    if(mm.MF>=obj-0.5){lag={type:'lag',eps,tgt,wn:w,b,T,G:Gc,m:mm,bw:bw(Gc)};break}}
  if(!lead&&!lag)return null;
  return {best:lead&&lead.phm<=55?lead:(lag||lead),lead,lag,bw0:bw(G)}}

function problemHTML(P){
  const {N,ps,K,G,m,d,obj}=P;const KB=K/ps.reduce((a,b)=>a*b,1);
  const Gtex=`G(s)=\\dfrac{K}{${pTex(N,ps)}}`;
  const enun=`<h4>Problema (4 puntos)</h4>
  <p>Un sistema con realimentación unitaria tiene la función de transferencia en lazo abierto \\(${Gtex}\\).</p>
  <ol class="ap" style="list-style:lower-alpha;padding-left:1.4em">
  <li>(0,5 p) Calcula K para que ${P.specTxt}.</li>
  <li>(1 p) Con ese K, dibuja el diagrama de Bode asintótico de módulo y fase.</li>
  <li>(1 p) Calcula el margen de fase y el margen de ganancia. Dibuja el Nyquist aproximado${isFinite(m.w180)?' indicando dónde corta al eje real':''}. ¿Es estable el lazo cerrado?</li>
  <li>(1,5 p) Diseña el compensador más adecuado para conseguir MF ≥ ${obj}° sin cambiar el error del apartado a). ¿Qué MG tiene el sistema compensado? ¿Qué ocurre con la velocidad de respuesta?</li></ol>`;
  /* b) Bode */
  const bform=`G(s)=\\dfrac{${fg(KB)}}{${N?'s':''}${ps.map(p=>`\\left(1+\\frac{s}{${fx(p)}}\\right)`).join('')}}`;
  let slope=-20*N,bt;
  if(N){bt=`Recta inicial de pendiente −20 dB/déc que en ω = 1 vale 20·log ${fg(KB)} = <b>${fx(dB(KB),1)} dB</b> (prolongada).`}
  else{bt=`A baja frecuencia, recta horizontal a 20·log ${fg(KB)} = <b>${fx(dB(KB),1)} dB</b>.`}
  // valores en esquinas siguiendo la asíntota
  const uniq=[...new Set(ps)];let asym=w=>{let v=dB(KB)-20*N*Math.log10(w);for(const p of ps)if(w>p)v-=20*Math.log10(w/p);return v};
  const corners=uniq.map(p=>{const mult=ps.filter(x=>x===p).length;slope-=20*mult;return `en ω = ${fx(p)} la asíntota vale ${fx(asym(p),1)} dB y la pendiente pasa a ${fx(slope,0)} dB/déc${mult>1?' (polo doble)':''}`});
  const phEnd=-90*(N+ps.length);
  const bSol=`Forma de Bode: \\(${bform}\\), K<sub>B</sub> = ${fg(KB)}. ${bt} Esquinas: ${corners.join('; ')}. Fase: empieza en ${fx(-90*N,0)}° y tiende a ${fx(phEnd,0)}°; cada polo resta 45° en su esquina (ω = ${uniq.map(p=>fx(p)).join(', ')})${isFinite(m.w180)?`; cruza −180° en ω ≈ ${fx(m.w180,2)} rad/s`:'; no llega a −180° (solo dos polos)'}.`;
  /* c) márgenes */
  const magEq=`\\frac{${fg(K)}}{${N?'\\omega':''}${ps.map(p=>`\\sqrt{\\omega^2+${fx(p*p)}}`).join('')}}=1`;
  const phTerms=(N?['90°']:[]).concat(ps.map(p=>`${fx(Math.atan(m.wc/p)*D,1)}°`)).map(t=>'−'+t).join(' ');
  let cSol=`\\(${magEq}\\Rightarrow\\) <b>ω<sub>c</sub> = ${fx(m.wc,2)} rad/s</b>; fase ${phTerms} = ${fx(ph(G,m.wc),1)}° → <b>MF = ${fx(m.MF,1)}°</b>. `;
  let nyq;
  if(isFinite(m.w180)){
    let imTxt;
    if(N===1){imTxt=`la parte imaginaria de \\(j\\omega(j\\omega+${fx(ps[0])})(j\\omega+${fx(ps[1])})\\) se anula en \\(\\omega^2=${fx(ps[0]*ps[1])}\\)`}
    else{const s2=ps[0]*ps[1]+ps[0]*ps[2]+ps[1]*ps[2];imTxt=`la parte imaginaria de \\((j\\omega+${fx(ps[0])})(j\\omega+${fx(ps[1])})(j\\omega+${fx(ps[2])})\\) se anula en \\(\\omega^2=${fx(s2)}\\)`}
    const cr=mag(G,m.w180);
    cSol+=`Fase −180°: ${imTxt} → <b>ω<sub>180</sub> = ${fx(m.w180,2)} rad/s</b>; |G| = ${fx(cr,3)} → <b>MG = ${fx(m.MG,2)} dB</b>. `;
    nyq=N?`Nyquist: viene de −j∞ (tipo 1) con asíntota vertical en Re = ${fx(-K*(ps[0]+ps[1])/(ps[0]*ps[1])**2,3)}, corta el eje real en <b>−${fx(cr,3)}</b> y llega al origen con ${fx(phEnd,0)}°.`
      :`Nyquist: empieza en el eje real en ${fg(KB)} (tipo 0), cruza el eje imaginario negativo, corta el eje real negativo en <b>−${fx(cr,3)}</b> y llega al origen con ${fx(phEnd,0)}°.`;
    nyq+=` El corte queda a la derecha de −1 y no hay polos inestables en lazo abierto: N = 0, P = 0 → Z = 0. <b>Estable</b>${m.MF<15?', pero muy cerca del límite':''}.`;
  }else{
    cSol+=`La fase solo tiende a −180° cuando ω → ∞: <b>MG = ∞</b>. `;
    nyq=`Nyquist: viene de −j∞ con asíntota vertical en Re = ${fx(-K/(ps[0]*ps[0]),3)} y llega al origen tangente al eje real negativo (−180°) sin cortarlo. No rodea al −1: <b>estable</b> para cualquier K, pero con MF = ${fx(m.MF,1)}° muy oscilante.`}
  cSol+=nyq;
  /* d) diseño */
  const b=d.best;let dSol,why;
  const leadPhm=d.lead?d.lead.phm:obj-m.MF+5;
  if(b.type==='lead'){
    why=`Faltan ${fx(obj-m.MF,1)}° y la fase cae despacio cerca de ω<sub>c</sub>: un <b>adelanto</b> basta (φ<sub>m</sub> ≤ 55°) y además hace el sistema más rápido.`;
    dSol=`φ<sub>m</sub> = ${obj} − ${fx(m.MF,1)} + ${b.eps} (margen ε) = <b>${fx(b.phm,1)}°</b> → \\(\\alpha=\\frac{1-\\sin\\varphi_m}{1+\\sin\\varphi_m}=${fx(b.a,4)}\\). El adelanto sube ${fx(-10*Math.log10(b.a),2)} dB en ω<sub>m</sub>, así que se coloca donde |G| = −${fx(-10*Math.log10(b.a),2)} dB: <b>ω<sub>m</sub> = ${fx(b.wm,3)} rad/s</b> (nueva ω<sub>c</sub>). \\(T=\\frac1{\\sqrt\\alpha\\,\\omega_m}=${fx(b.T,4)}\\) s. \\(G_c(s)=\\dfrac{1+${fx(b.T,4)}s}{1+${fx(b.a*b.T,4)}s}\\) (ganancia 1 en continua: el error no cambia).`;
  }else{
    why=d.lead?`El adelanto necesitaría φ<sub>m</sub> = ${fx(leadPhm,1)}°, demasiado (más de 55°): se elige <b>atraso</b>.`:`Un adelanto no sirve: faltan ${fx(obj-m.MF,1)}° y la fase cae muy deprisa (la ω<sub>c</sub> se desplaza y se pierde lo ganado). Se elige <b>atraso</b>.`;
    dSol=`Fase objetivo −180° + ${obj}° + ${b.eps}° (margen ε) = ${fx(b.tgt,0)}° → <b>ω'<sub>c</sub> = ${fx(b.wn,3)} rad/s</b>. Allí |G| = ${fx(dB(b.b),2)} dB → <b>β = ${fx(b.b,3)}</b>. Cero una década por debajo: T = 10/ω'<sub>c</sub> = ${fx(b.T,3)} s → \\(G_c(s)=\\dfrac{1+${fx(b.T,3)}s}{1+${fx(b.b*b.T,2)}s}\\) (ganancia 1 en continua: el error no cambia).`}
  const spd=b.bw>d.bw0?'aumenta: <b>la respuesta es más rápida</b> y menos oscilante':'baja: <b>la respuesta es más lenta</b>, pero mucho menos oscilante';
  const chkC=`<b>Comprobación</b>: MF = <b>${fx(b.m.MF,1)}°</b>, MG = <b>${isFinite(b.m.MG)?fx(b.m.MG,2)+' dB':'∞'}</b>. El ancho de banda en lazo cerrado pasa de ${fx(d.bw0,2)} a ${fx(b.bw,2)} rad/s: ${spd}.`;
  RB=[];
  const sol=`<details open><summary>Problema · solución completa <span class="src">4 puntos</span></summary><div class="inner"><ol class="steps">
  <li><b>a)</b> ${P.aSol}<div class="rbg">${rb(0.25,'K<sub>v</sub>/K<sub>p</sub> bien planteada')}${rb(0.25,'valor de K')}</div></li>
  <li><b>b)</b> ${bSol}<div class="rbg">${rb(0.5,'módulo')}${rb(0.5,'fase')}</div></li>
  <li><b>c)</b> ${cSol}<div class="rbg">${rb(0.3,'MF')}${rb(0.3,'MG')}${rb(0.4,'Nyquist y estabilidad')}</div></li>
  <li><b>d)</b> ${why} ${dSol}<div class="rbg">${rb(0.3,'elección justificada')}${rb(0.6,'cálculo del compensador')}${rb(0.3,'G<sub>c</sub>(s) final')}</div></li>
  <li>${chkC}<div class="rbg">${rb(0.3,'comprobación y comentario')}</div></li></ol>
  <p><button type="button" class="btn" data-smchk='${JSON.stringify([fg(K).replace(',','.'),pstr(N,ps),1])}'>Comprobar en la calculadora</button></p></div></details>`;
  return {enun,sol}}

/* ================= CUESTIONES ================= */
const TEO=[
 {q:'Explica qué son el margen de fase y el margen de ganancia y cómo se leen en un diagrama de Nyquist. Haz un dibujo.',a:'<b>MF:</b> en ω<sub>c</sub> (donde |GH| = 1), lo que le falta a la fase para llegar a −180°; en el Nyquist, el ángulo entre el corte con la circunferencia unidad y el semieje real negativo. <b>MG:</b> en ω<sub>180</sub>, si la curva corta el eje real en −a, MG = 1/a (−20·log a dB): cuánto puede crecer la ganancia antes de llegar a −1. Dibujo con circunferencia unidad, −1, la curva, el ángulo y el segmento entre −a y −1.',l:'#margenes',r:[[0.4,'definiciones'],[0.4,'dibujo'],[0.2,'relación con la estabilidad']]},
 {q:'Enuncia el criterio de estabilidad de Nyquist y explica qué significan N, P y Z.',a:'Z = N + P. <b>P</b>: polos de GH en el semiplano derecho (lazo abierto). <b>N</b>: vueltas de la curva de Nyquist alrededor de −1 en sentido horario. <b>Z</b>: polos del lazo cerrado en el semiplano derecho; estable si Z = 0. Si GH es estable (P = 0), el lazo cerrado es estable si la curva no rodea a −1. Los polos en el eje imaginario se rodean con un semicírculo infinitesimal.',l:'#nyquist',r:[[0.4,'enunciado Z = N + P'],[0.4,'significado de N, P, Z'],[0.2,'caso P = 0 y polos en el eje']]},
 {q:'Saturación de la señal de control con un controlador con parte integral: ¿qué problema aparece y cómo se soluciona?',a:'<b>Windup</b>: el actuador satura, el error no baja y la integral sigue creciendo; cuando el error cambia de signo, la integral tarda en «descargarse» y aparece un sobrepico grande y lento. Solución (<b>antiwindup</b>): realimentar (u<sub>sat</sub> − u)/T<sub>t</sub> al integrador (back-calculation) o congelar la integral mientras haya saturación (integración condicional).',l:'#q3',r:[[0.5,'explicación del windup'],[0.5,'antiwindup con esquema']]},
 {q:'Explica un método de discretización de un PID.',a:'Con periodo T: la integral por suma de rectángulos (o trapecios, Tustin) y la derivada por diferencia hacia atrás: \\(u(k)=K_p\\big[e(k)+\\frac{T}{T_i}\\sum e(j)+\\frac{T_d}{T}(e(k)-e(k-1))\\big]\\). La forma incremental \\(\\Delta u(k)=u(k)-u(k-1)\\) evita el windup y el salto al cambiar de manual a automático. T debe ser pequeño frente a la dinámica del sistema.',l:'#q2',r:[[0.5,'aproximación de I y D'],[0.3,'ecuación en diferencias'],[0.2,'elección de T o forma incremental']]},
 {q:'¿Qué problemas presenta un PID cuando la consigna cambia en escalón y cómo se resuelven?',a:'La derivada de un escalón es un impulso: <b>patada derivativa</b> (pico en u). El término P también da un salto. Solución: derivar solo la salida (c = 0) y ponderar la referencia en la P (b < 1): \\(u=K_p\\big[(br-y)+\\frac1{T_i}\\int e+T_d\\frac{d(cr-y)}{dt}\\big]\\). El rechazo de perturbaciones no cambia. También se puede filtrar la consigna con una rampa.',l:'#q11',r:[[0.5,'patada derivativa'],[0.5,'ponderación b, c']]},
 {q:'Feedforward y feedback juntos: dibuja el esquema y explica cuándo conviene.',a:'Si la perturbación d es <b>medible</b>, se añade G<sub>ff</sub> = −G<sub>d</sub>/G<sub>p</sub> que actúa antes de que d afecte a la salida. El feedback sigue corrigiendo errores de modelo y perturbaciones no medidas. G<sub>ff</sub> tiene que ser realizable (sin adelantos puros); si no, se usa su parte estática.',l:'#q5',r:[[0.4,'esquema'],[0.4,'G<sub>ff</sub> = −G<sub>d</sub>/G<sub>p</sub>'],[0.2,'por qué hace falta también el feedback']]},
 {q:'Control en cascada: esquema, para qué sirve y cómo se sintoniza.',a:'Dos lazos: el <b>interno</b> (rápido) controla una variable secundaria y rechaza las perturbaciones que entran en ella antes de que lleguen a la salida; el <b>externo</b> da la consigna al interno. Requisito: el lazo interno bastante más rápido (3–5 veces). Se sintoniza primero el interno y luego el externo con el interno cerrado.',l:'#q8',r:[[0.4,'esquema'],[0.3,'ventaja'],[0.3,'orden de sintonía']]},
 {q:'Explica el método de sintonía por relé.',a:'Se sustituye el controlador por un relé de amplitud d: el lazo entra en un ciclo límite de amplitud a y periodo P<sub>u</sub>. Por la función descriptiva, \\(K_u\\approx\\frac{4d}{\\pi a}\\). Con K<sub>u</sub> y P<sub>u</sub> se aplican las tablas de Ziegler–Nichols en lazo cerrado. Ventajas: automático, la oscilación es controlada y no se lleva al sistema al límite de la estabilidad.',l:'#q10',r:[[0.4,'experimento'],[0.4,'K<sub>u</sub> = 4d/(πa)'],[0.2,'uso de las tablas']]},
 {q:'Dibuja el esquema de un PID con todas las mejoras que conozcas.',a:'Ponderación de la referencia (b en P, c = 0 en D), filtro derivativo \\(\\frac{T_ds}{1+T_ds/N}\\) con N ≈ 8–20, antiwindup por back-calculation con T<sub>t</sub>, saturación del actuador y, si la perturbación es medible, feedforward.',l:'#q7',r:[[0.25,'ponderación'],[0.25,'filtro D'],[0.25,'antiwindup'],[0.25,'esquema coherente']]},
 {q:'¿Qué efecto tienen las acciones P, I y D sobre la respuesta del lazo cerrado?',a:'<b>P</b>: más rápido y menos error, pero más sobrepico; no anula el error en tipo 0. <b>I</b>: anula el error ante escalón (sube el tipo), pero añade fase negativa: más oscilación. <b>D</b>: anticipa, amortigua y mejora el MF, pero amplifica el ruido (por eso se filtra).',l:'#t2',r:[[0.35,'P'],[0.35,'I'],[0.3,'D']]}];

function genSeno(){
  const v=pk(['p1','p2','pp']);const A=pk([1,2,3,5]);const w=pk([0.5,1,2,3,4,5]);let k,ps,Gt;
  if(v==='p1'){const p=pk([1,2,4,5]);k=pk([2,5,10]);ps=[p];Gt=`\\dfrac{${k}}{s+${p}}`}
  else if(v==='p2'){const p=pk([1,2,3]);k=pk([4,5,10]);ps=[p,p];Gt=`\\dfrac{${k}}{(s+${p})^2}`}
  else{const a=pk([1,2]),b=pk([3,4,5]);k=pk([6,10,20]);ps=[a,b];Gt=`\\dfrac{${k}}{(s+${a})(s+${b})}`}
  const G=mk(k,0,ps);const M=mag(G,w),F=ph(G,w);
  const q=`Al sistema \\(G(s)=${Gt}\\) se le aplica la entrada \\(x(t)=${A}\\,\\sin(${fx(w)}t)\\). Calcula la salida en régimen permanente.`;
  const a=`Misma frecuencia, ω = ${fx(w)} rad/s. \\(|G(j${fx(w)})|=\\frac{${k}}{${ps.map(p=>`\\sqrt{${fx(w*w)}+${fx(p*p)}}`).join('\\,')}}=${fx(M,4)}\\), amplitud ${A}·${fx(M,4)} = <b>${fx(A*M,3)}</b>. Fase: ${ps.map(p=>`−arctan(${fx(w)}/${fx(p)})`).join(' ')} = <b>${fx(F,1)}°</b>. <b>y(t) = ${fx(A*M,3)}·sen(${fx(w)}t ${F<0?'−':'+'} ${fx(Math.abs(F),1)}°)</b>.`;
  return{q,a,l:'#q4',r:[[0.2,'misma ω'],[0.4,'módulo'],[0.4,'fase']]}}
function genSegundo(){
  for(let t=0;t<100;t++){const a=pk([1,2,3,4,5,6,8]);const K=pk([1,2,4,5,8,10,16,20,25]);const wn=Math.sqrt(K),z=a/(2*wn);if(z<0.15||z>0.85)continue;
    const Mp=Math.exp(-z*Math.PI/Math.sqrt(1-z*z)),wd=wn*Math.sqrt(1-z*z),tp=Math.PI/wd,ts=4/(z*wn);
    const q=`El sistema \\(G(s)=\\dfrac{${K}}{s(s+${a})}\\) se realimenta con H(s) = 1. Calcula ζ, ω<sub>n</sub>, la sobreoscilación, el tiempo de pico, el tiempo de establecimiento (2 %) y el error ante una rampa unitaria.`;
    const ans=`Lazo cerrado \\(\\frac{${K}}{s^2+${a}s+${K}}\\): ω<sub>n</sub> = √${K} = <b>${fx(wn,3)} rad/s</b>, 2ζω<sub>n</sub> = ${a} → <b>ζ = ${fx(z,3)}</b>. \\(M_p=e^{-\\zeta\\pi/\\sqrt{1-\\zeta^2}}\\) = <b>${fx(Mp*100,1)} %</b>. ω<sub>d</sub> = ${fx(wd,3)}, t<sub>p</sub> = π/ω<sub>d</sub> = <b>${fx(tp,3)} s</b>, t<sub>s</sub> ≈ 4/(ζω<sub>n</sub>) = <b>${fx(ts,2)} s</b>. Tipo 1: K<sub>v</sub> = ${K}/${a} → <b>e<sub>v</sub> = ${fx(a/K,3)}</b>; ante escalón el error es 0.`;
    return{q,a:ans,l:'#t1',r:[[0.3,'ζ y ω<sub>n</sub>'],[0.4,'M<sub>p</sub>, t<sub>p</sub>, t<sub>s</sub>'],[0.3,'error ante rampa']]}}}
const ZNA={P:[1,Infinity,0],PI:[0.9,1/0.3,0],PID:[1.2,2,0.5]};
const ZNC={P:[0.5,Infinity,0],PI:[0.45,1/1.2,0],PID:[0.6,0.5,0.125]};
function znRow(type,Kp,Ti,Td){return `<b>K<sub>p</sub> = ${fx(Kp,3)}</b>${isFinite(Ti)?`, <b>T<sub>i</sub> = ${fx(Ti,3)} s</b>`:''}${Td?`, <b>T<sub>d</sub> = ${fx(Td,3)} s</b>`:''}`}
function genZN(){
  const v=pk(['abierto','cerrado','rele']);const type=pk(['P','PI','PID']);
  if(v==='abierto'){const K=pk([1,2,4,0.5]),L=pk([0.5,1,2]),T=pk([3,4,5,8,10]);const c=ZNA[type];const Kp=c[0]*T/(K*L),Ti=c[1]*L,Td=c[2]*L;
    return{q:`Explica el método de Ziegler–Nichols basado en la respuesta a escalón y aplícalo a una planta cuya curva de reacción da K = ${fx(K)}, L = ${fx(L)} s y T = ${fx(T)} s (controlador ${type}).`,
     a:`Escalón a la planta en lazo abierto; tangente en el punto de inflexión de la curva en S: corta el eje de tiempos en L y el valor final en L + T. Tabla 8-1 (${type}): ${type==='P'?'K<sub>p</sub> = T/(KL)':type==='PI'?'K<sub>p</sub> = 0,9·T/(KL), T<sub>i</sub> = L/0,3':'K<sub>p</sub> = 1,2·T/(KL), T<sub>i</sub> = 2L, T<sub>d</sub> = 0,5L'} → ${znRow(type,Kp,Ti,Td)}. Busca un sobrepico del 25 %; es un punto de partida.`,l:'#t3',r:[[0.4,'explicación con dibujo'],[0.6,'cálculo']]}}
  if(v==='cerrado'){const ps=pk([[1,2,3],[1,1,1],[1,2,4],[2,3,4],[1,3,5],[1,2,5]]);const s1=ps[0]+ps[1]+ps[2],s2=ps[0]*ps[1]+ps[0]*ps[2]+ps[1]*ps[2],s3=ps[0]*ps[1]*ps[2];const Kcr=s1*s2-s3,wcr=Math.sqrt(s2),Pcr=2*Math.PI/wcr;const c=ZNC[type];const Kp=c[0]*Kcr,Ti=c[1]*Pcr,Td=c[2]*Pcr;
    return{q:`Explica el método de Ziegler–Nichols de la ganancia crítica y calcula un controlador ${type} para la planta \\(G(s)=\\dfrac{1}{${pTex(0,ps)}}\\).`,
     a:`Solo acción P, se sube K<sub>p</sub> hasta oscilación mantenida: K<sub>cr</sub> y P<sub>cr</sub>. Ecuación característica \\(s^3+${s1}s^2+${s2}s+${s3}+K=0\\). Routh: fila de s¹ nula si ${s1}·${s2} = ${s3} + K → <b>K<sub>cr</sub> = ${fx(Kcr)}</b>; auxiliar ${s1}s² + ${fx(s3+Kcr)} = 0 → ω<sub>cr</sub> = √${s2} = ${fx(wcr,3)} rad/s → <b>P<sub>cr</sub> = ${fx(Pcr,3)} s</b>. Tabla 8-2 (${type}): ${znRow(type,Kp,Ti,Td)}.`,l:'#t3',r:[[0.3,'explicación'],[0.4,'K<sub>cr</sub> y P<sub>cr</sub> por Routh'],[0.3,'parámetros']]}}
  const d=pk([1,2,5,10]),a=pk([0.2,0.5,1,2]),Pu=pk([2,4,6,10]);const Ku=4*d/(Math.PI*a);const c=ZNC[type];const Kp=c[0]*Ku,Ti=c[1]*Pu,Td=c[2]*Pu;
  return{q:`En un ensayo con un relé de amplitud d = ${d} se mide un ciclo límite de amplitud a = ${fx(a)} y periodo ${Pu} s. Calcula un controlador ${type} y explica el método.`,
   a:`Relé en lugar del controlador → ciclo límite. Función descriptiva: \\(K_u\\approx\\frac{4d}{\\pi a}=\\frac{4\\cdot${d}}{\\pi\\cdot${fx(a)}}\\) = <b>${fx(Ku,3)}</b>, P<sub>u</sub> = ${Pu} s. Tabla de ZN en lazo cerrado (${type}): ${znRow(type,Kp,Ti,Td)}.`,l:'#q10',r:[[0.3,'explicación'],[0.3,'K<sub>u</sub>'],[0.4,'parámetros']]}}

/* ================= MONTAJE ================= */
function render(seed){
  R=rng(seed);let P=null;for(let k=0;k<20&&!P;k++)P=genProblem();
  const PH=problemHTML(P);
  const C=[pk(TEO),R()<0.5?genSeno():genSegundo(),genZN()];
  const order=[0,1,2];
  let enun=PH.enun+order.map((i,j)=>`<h4>Cuestión ${j+1} (1 punto)</h4><p>${C[i].q}</p>`).join('');
  let sol=PH.sol+order.map((i,j)=>`<details><summary>Cuestión ${j+1} <span class="src">1 punto</span></summary><div class="inner"><p>${C[i].a} <a href="${C[i].l}">Repasar el tema</a>.</p><div class="rbg">${C[i].r.map(([p,t])=>rb(p,t)).join('')}</div></div></details>`).join('');
  const tx=h=>h.replace(/\\\((.*?)\\\)/gs,(m0,b)=>'\\('+b.replace(/(\d),(\d)/g,'$1{,}$2')+'\\)');
  $('smEnun').innerHTML=tx(enun);$('smSol').innerHTML=tx(sol);$('smNum').textContent='Simulacro n.º '+seed;
  $('smSol').querySelectorAll('[data-smchk]').forEach(b=>b.addEventListener('click',()=>{if(typeof load==='function')load(...JSON.parse(b.getAttribute('data-smchk')))}));
  $('smSol').querySelectorAll('input[data-rb]').forEach(c=>c.addEventListener('change',score));score();
  try{localStorage.setItem('ic-sim-seed',String(seed))}catch(_){}
  if(window.MathJax&&MathJax.typesetPromise)MathJax.typesetPromise([$('smEnun'),$('smSol')]).catch(()=>{});
  return P}
function score(){let s=0;$('smSol').querySelectorAll('input[data-rb]:checked').forEach(c=>s+=RB[+c.dataset.rb]);$('smScore').innerHTML=`Tu nota: <b>${fx(s,2)} / 7</b> · sobre 10: <b>${fx(s/7*10,1)}</b>`}
const newSeed=()=>1+Math.floor(Math.random()*99999);
try{$('smNew').addEventListener('click',()=>{render(newSeed());$('smSolWrap').hidden=true;$('smReveal').textContent='Ver solución y baremo';const r=$('tmReset');if(r)r.click();$('smEnun').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})});
}catch(__e){if(window.__DBG)console.warn(__e)}
try{$('smReveal').addEventListener('click',()=>{const w=$('smSolWrap');w.hidden=!w.hidden;$('smReveal').textContent=w.hidden?'Ver solución y baremo':'Ocultar la solución'});
}catch(__e){if(window.__DBG)console.warn(__e)}
try{$('smGo').addEventListener('click',()=>{const v=parseInt($('smSeed').value,10);if(v>0)render(v)});
}catch(__e){if(window.__DBG)console.warn(__e)}
let s0=0;try{try{s0=parseInt(localStorage.getItem('ic-sim-seed')||'0',10)}catch(_){}
}catch(__e){if(window.__DBG)console.warn(__e)}
try{render(s0>0?s0:newSeed());
}catch(__e){if(window.__DBG)console.warn(__e)}
try{window.__simgen={render,marg,mk,mag,ph,design,bw};
}catch(__e){if(window.__DBG)console.warn(__e)}
})();


;
/* ===== navegación multipágina ===== */
(function(){
const g=id=>document.getElementById(id);
const SEL='h2,h3,summary,.ex-top h4,dl.glos dt,.fcard h3,table td:first-child';
try{document.querySelectorAll('main section.sec').forEach(sec=>{const h2=sec.querySelector('h2');if(!h2)return;let k=0;sec.querySelectorAll(SEL).forEach(el=>{if(!el.id)el.id='sx-'+h2.id+'-'+k;k++})});
}catch(__e){if(window.__DBG)console.warn(__e)}
let rm;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(__e){if(window.__DBG)console.warn(__e)}
function go(h,smooth){if(!h||h.length<2)return;let id;try{id=decodeURIComponent(h.slice(1))}catch(e){return}if(id.startsWith('calc='))return;const t=g(id);if(!t)return;
  let d=t.tagName==='SUMMARY'?t.parentElement:t.closest('details');while(d){if(d.tagName==='DETAILS')d.open=true;d=d.parentElement&&d.parentElement.closest('details')}
  const sc=b=>t.scrollIntoView({block:t.tagName==='H2'?'start':'center',behavior:b&&!rm?'smooth':'auto'});sc(smooth);setTimeout(()=>sc(false),700);
  t.classList.remove('flash');void t.offsetWidth;t.classList.add('flash')}
try{window.addEventListener('hashchange',()=>go(location.hash,true));
}catch(__e){if(window.__DBG)console.warn(__e)}
try{if(location.hash)setTimeout(()=>go(location.hash,false),80);
}catch(__e){if(window.__DBG)console.warn(__e)}
/* enlaces internos a secciones que están en otra página */
try{document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);if(!id||id==='top'||g(id))return;
  const p=window.GUIA&&GUIA.idmap[id];if(p){e.preventDefault();location.href=p+'.html#'+id}});
}catch(__e){if(window.__DBG)console.warn(__e)}
/* menú y buscador de la barra superior */
const tog=(btn,panel,other,otherBtn)=>{const b=g(btn),p=g(panel);if(!b||!p)return;b.addEventListener('click',()=>{const open=p.hidden;p.hidden=!open;b.setAttribute('aria-expanded',String(open));
  if(open&&g(other)){g(other).hidden=true;g(otherBtn).setAttribute('aria-expanded','false')}if(open&&panel==='srchPanel')setTimeout(()=>g('srch').focus(),30)})};
try{tog('menuBtn','siteNav','srchPanel','srchBtn');
}catch(__e){if(window.__DBG)console.warn(__e)}try{tog('srchBtn','srchPanel','siteNav','menuBtn');
}catch(__e){if(window.__DBG)console.warn(__e)}
try{document.addEventListener('keydown',e=>{if(e.key==='Escape'){['siteNav','srchPanel'].forEach(x=>{if(g(x))g(x).hidden=true});['menuBtn','srchBtn'].forEach(x=>{if(g(x))g(x).setAttribute('aria-expanded','false')})}
  if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&g('srchBtn')){e.preventDefault();if(g('srchPanel').hidden)g('srchBtn').click();else g('srch').focus()}});
}catch(__e){if(window.__DBG)console.warn(__e)}
/* volver arriba también en la portada */
let tt;try{tt=g('totop');}catch(__e){if(window.__DBG)console.warn(__e)}try{if(tt)window.addEventListener('scroll',()=>tt.classList.toggle('show',scrollY>900),{passive:true});
}catch(__e){if(window.__DBG)console.warn(__e)}
})();
