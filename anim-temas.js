/* Ingeniería de Control: una animación por página de tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
var LG=function(x){return Math.log(x)/Math.LN10;};

/* senoide de entrada y de salida a través de G(s) = 1/(s+1) */
M.reg('ic-frec',M.base({title:'Respuesta en frecuencia: la senoide que sale',H:560,dur:18,caps:[[6,'Si a un sistema lineal estable le entra una senoide, en régimen permanente sale otra senoide de la <b>misma frecuencia</b>.'],[12,'Solo cambian dos cosas: la amplitud se multiplica por <i>|G(jω)|</i> y la onda se retrasa un ángulo <i>φ = arg G(jω)</i>.'],[99,'Para G(s) = 1/(s+1): a baja frecuencia pasa casi igual; a ω = 1 sale a 0,707 y retrasada 45°; a alta frecuencia se atenúa y se retrasa casi 90°.']]},
 function(D,t){var lw=lerp(-1.3,1.3,U.pp(t,18)),w=Math.pow(10,lw),mg=1/Math.sqrt(1+w*w),ph=-Math.atan(w),A=U.axes(D,{xr:[0,4*Math.PI],yr:[-1.3,1.3],xt:[],yt:[-1,1],yd:0,xl:'ωt',yl:''},{x:80,y:96,w:480,h:300,grid:true}),sh=(t*2)%(2*Math.PI);
  U.plotf(D,A,function(x){return Math.sin(x-sh);},C.f,2.4);U.plotf(D,A,function(x){return mg*Math.sin(x-sh+ph);},C.m,3);
  D.text('entrada',A.X(0.2),A.Y(1.2),{s:15,c:C.f});D.text('salida',A.X(3),A.Y(1.2),{s:15,c:C.m});
  U.readout(D,['ω = '+nf(w,2)+' rad/s','|G(jω)| = '+nf(mg,3)+' ('+nf(20*LG(mg),1)+' dB)    φ = '+nf(ph*180/Math.PI,1)+'°'],468);}));

/* Bode asintótico: G(s) = 100/(s(s+10)) */
M.reg('ic-bode',M.base({title:'Bode a mano: sumar las asíntotas',H:560,dur:20,caps:[[5,'Se escribe G(s) = 100/(s(s+10)) en forma de Bode: <i>10 · (1/s) · 1/(1 + s/10)</i>. Cada factor se dibuja por separado.'],[10,'Ganancia 10 → recta a +20 dB. Integrador → recta de −20 dB/déc que pasa por 0 dB en ω = 1. Polo en 10 → 0 dB hasta 10 y luego −20 dB/déc.'],[15,'En escala logarítmica los dB se suman: la asíntota total cambia de pendiente en cada esquina (−20 → −40 dB/déc en ω = 10).'],[99,'La curva real se separa de la asíntota como mucho 3 dB en la esquina del polo simple.']]},
 function(D,t){var A=U.axes(D,{xr:[-1,3],yr:[-60,50],xt:[-1,0,1,2,3],yt:[-40,-20,20,40],xf:function(v){return ['0,1','1','10','100','1000'][v+1];},yd:0,xl:'ω',yl:'dB'},{x:80,y:96,w:480,h:300,grid:true});
  var k=function(x){return 20;},ig=function(x){return -20*x;},po=function(x){return x<1?0:-20*(x-1);},a1=ease(seg(t,1,4)),a2=ease(seg(t,4,7)),a3=ease(seg(t,7,10)),a4=ease(seg(t,11,14)),a5=ease(seg(t,15,18));
  function part(f,c,a,w){if(a<=0)return;var p=[];for(var i=0;i<=200*a;i++){var x=-1+4*i/200;p.push([A.X(x),A.Y(f(x))]);}U.clipA(D,A,function(){D.path(p,c,w||2,null,a<1?1:0.75);});}
  part(k,C.f,a1);part(ig,C.g,a2);part(po,C.hl,a3);part(function(x){return k(x)+ig(x)+po(x);},C.m,a4,3.2);
  part(function(x){var w=Math.pow(10,x);return 20*LG(100/(w*Math.sqrt(w*w+100)));},C.y,a5,1.8);
  if(a1>=1)D.text('20 dB',A.X(2.9),A.Y(20)-8,{s:14,c:C.f,a:'right'});if(a2>=1)D.text('1/s',A.X(-0.8),A.Y(16)+0,{s:15,c:C.g});if(a3>=1)D.text('polo en 10',A.X(1.4),A.Y(-14),{s:14,c:C.hl});
  U.readout(D,[a4>0?'suma: |G| = 0 dB en ω ≈ 7,9 (cruce de ganancia)':'factores por separado'],468);}));

/* márgenes de G = K/(s(s+1)(s+2)) */
function mg3(w){return 1/(w*Math.sqrt(w*w+1)*Math.sqrt(w*w+4));}function ph3(w){return -90-(Math.atan(w)+Math.atan(w/2))*180/Math.PI;}
M.reg('ic-marg',M.base({title:'Margen de ganancia y margen de fase',H:600,dur:18,caps:[[6,'El margen de fase se lee en el cruce de ganancia (|G| = 0 dB): lo que le falta a la fase para llegar a −180°.'],[12,'El margen de ganancia se lee en el cruce de fase (−180°): los dB que se podría subir la ganancia antes de inestabilizar.'],[99,'Para K/(s(s+1)(s+2)) el cruce de fase está en ω = √2 y |G| vale K/6 allí: con K = 6 los dos márgenes se anulan.']]},
 function(D,t){var K=lerp(1,8,U.pp(t,18)),A=U.axes(D,{xr:[-1.3,1],yr:[-40,30],xt:[-1,0,1],yt:[-20,20],xf:function(v){return ['0,1','1','10'][v+1];},yd:0,xl:'ω',yl:'dB'},{x:80,y:110,w:480,h:150,grid:true}),B=U.axes(D,{xr:[-1.3,1],yr:[-270,-90],xt:[],yt:[-270,-180,-90],yd:0,xl:'',yl:'φ (°)'},{x:80,y:310,w:480,h:160,grid:true});
  U.plotf(D,A,function(x){return 20*LG(K*mg3(Math.pow(10,x)));},C.f,2.6);U.plotf(D,B,function(x){return ph3(Math.pow(10,x));},C.hl,2.6);D.line(B.X(-1.3),B.Y(-180),B.X(1),B.Y(-180),C.bad,1.4,[5,4]);
  var lo=0.01,hi=10;for(var i=0;i<50;i++){var m=Math.sqrt(lo*hi);if(K*mg3(m)>1)lo=m;else hi=m;}var wc=lo,pm=180+ph3(wc),wp=Math.SQRT2,gm=-20*LG(K*mg3(wp));
  D.line(A.X(LG(wc)),A.Y(0),B.X(LG(wc)),B.Y(ph3(wc)),C.m,1.2,[3,3]);D.arrow(B.X(LG(wc)),B.Y(-180),B.X(LG(wc)),B.Y(ph3(wc)),pm>0?C.ok:C.bad,2.4);
  D.line(A.X(LG(wp)),A.Y(20*LG(K*mg3(wp))),B.X(LG(wp)),B.Y(-180),C.g,1.2,[3,3]);D.arrow(A.X(LG(wp)),A.Y(20*LG(K*mg3(wp))),A.X(LG(wp)),A.Y(0),gm>0?C.ok:C.bad,2.4);
  U.readout(D,['K = '+nf(K,2)+'    MF = '+nf(pm,1)+'°    MG = '+nf(gm,1)+' dB',pm>0.5?'lazo cerrado estable':(pm<-0.5?'inestable':'límite')],515);}));

/* Nyquist de 4/(s+1)³ */
function nyq(w,K){var r=K/Math.pow(1+w*w,1.5),a=-3*Math.atan(w);return [r*Math.cos(a),r*Math.sin(a)];}
M.reg('ic-nyq',M.tray({title:'Diagrama de Nyquist: rodear o no el −1',H:580,dur:16,s:[-2,2],ax:{xr:[-1.6,4.4],yr:[-3.1,3.1],xt:[-1,1,2,3,4],yt:[-2,-1,1],xd:0,yd:0,xl:'Re',yl:'Im'},h:340,path:function(s){return nyq(Math.pow(10,s),4);},
 extra:function(D,A){var p=[];for(var i=0;i<=300;i++){var q=nyq(Math.pow(10,-2+4*i/300),4);p.push([A.X(q[0]),A.Y(-q[1])]);}D.path(p,C.mut,1.2,null,0.5);D.cross(A.X(-1),A.Y(0),7,C.bad);D.text('−1',A.X(-1)-4,A.Y(0)+22,{s:15,c:C.bad,a:'center'});D.dot(A.X(-0.5),A.Y(0),5,C.hl);D.text('−0,5',A.X(-0.5)+4,A.Y(0)-10,{s:14,c:C.hl});},
 read:function(s){var w=Math.pow(10,s),q=nyq(w,4);return ['ω = '+nf(w,2)+'    G(jω) = '+nf(q[0],2)+(q[1]<0?' − j':' + j')+nf(Math.abs(q[1]),2),'corta el eje real en −0,5 (ω = √3): no rodea al −1 → MG = 2 (6 dB)'];},
 caps:[[5,'El diagrama de Nyquist dibuja G(jω) en el plano complejo al recorrer ω de 0 a ∞ (la rama simétrica, en gris, es ω < 0).'],[10,'Para G(s) = 4/(s+1)³ la curva sale de 4 sobre el eje real, gira en sentido horario y se va al origen con fase −270°.'],[99,'Como G no tiene polos inestables, el lazo cerrado es estable si la curva no rodea al −1. Cruza en −0,5: la ganancia podría duplicarse.']]}));

/* diseño: adelanto que cancela el polo lento */
function y2o(t,z,wn){var wd=wn*Math.sqrt(1-z*z),ph=Math.acos(z);return 1-Math.exp(-z*wn*t)/Math.sqrt(1-z*z)*Math.sin(wd*t+ph);}
M.reg('ic-dis',M.base({title:'Diseño de un compensador de adelanto',H:560,dur:18,caps:[[6,'Sin compensar, G(s) = 4/(s(s+1)) en lazo cerrado da ζ = 0,25: una sobreoscilación del 44 % y mucha oscilación.'],[12,'El compensador C(s) = 4(s+1)/(s+4) cancela el polo lento en −1 y lo sustituye por uno en −4.'],[99,'El lazo queda 16/(s(s+4)): ζ = 0,5 y ω<sub>n</sub> = 4. La sobreoscilación baja al 16 % y el sistema se asienta cuatro veces antes.']]},
 function(D,t){var A=U.axes(D,{xr:[0,12],yr:[0,1.6],xt:[2,4,6,8,10,12],yt:[0.5,1,1.5],xd:0,yd:1,xl:'t (s)',yl:'y(t)'},{x:80,y:96,w:480,h:300,grid:true}),x1=seg(t,0.5,8)*12,x2=seg(t,8,14)*12;
  D.line(A.X(0),A.Y(1),A.X(12),A.Y(1),C.mut,1,[4,4]);
  var p=[],q=[];for(var i=0;i<=300;i++){var x=12*i/300;if(x<=x1)p.push([A.X(x),A.Y(y2o(x,0.25,2))]);if(x<=x2)q.push([A.X(x),A.Y(y2o(x,0.5,4))]);}
  D.path(p,C.g,2.4);D.path(q,C.m,3);D.text('sin compensar',A.X(4.3),A.Y(1.42),{s:15,c:C.g});if(x2>0)D.text('con adelanto',A.X(1.2),A.Y(0.62),{s:15,c:C.m});
  U.readout(D,['sin compensar: M_{p} = 44 %, t_{s} ≈ 8 s','con adelanto: M_{p} = 16 %, t_{s} ≈ 2 s'],468);}));

/* P, PI y PID sobre 1/(s+1)³ */
function simPID(Kp,Ki,Kd){var x=[0,0,0],I=0,ep=1,dt=0.01,out=[],df=0;for(var i=0;i<=2000;i++){var y=x[2],e=1-y;I+=e*dt;var de=(e-ep)/dt;df+= (de-df)*dt/0.05;ep=e;var u=Kp*e+Ki*I+Kd*(i?df:0);x[0]+=dt*(-x[0]+u);x[1]+=dt*(-x[1]+x[0]);x[2]+=dt*(-x[2]+x[1]);out.push(y);}return out;}
var PIDS=[['P (K_{p} = 2)',simPID(2,0,0)],['PI (K_{p} = 2, K_{i} = 0,6)',simPID(2,0.6,0)],['PID (K_{p} = 3, K_{i} = 1, K_{d} = 2)',simPID(3,1,2)]];
M.reg('ic-pid',M.base({title:'Regulador PID: qué aporta cada acción',H:560,dur:21,caps:[[7,'Con solo acción proporcional la salida se queda por debajo de la referencia: con planta de tipo 0 siempre hay error permanente.'],[14,'La acción integral acumula el error y lo elimina, pero hace la respuesta más oscilante.'],[99,'La acción derivativa anticipa la tendencia del error, amortigua la oscilación y permite subir las ganancias. Planta: 1/(s+1)³.']]},
 function(D,t){var k=Math.min(2,Math.floor(t/7)),u=seg(t-7*k,0.3,6),A=U.axes(D,{xr:[0,20],yr:[0,1.5],xt:[5,10,15,20],yt:[0.5,1],xd:0,yd:1,xl:'t (s)',yl:'y(t)'},{x:80,y:96,w:480,h:300,grid:true}),cols=[C.g,C.hl,C.m];
  D.line(A.X(0),A.Y(1),A.X(20),A.Y(1),C.mut,1,[4,4]);
  for(var j=0;j<=k;j++){var o=PIDS[j][1],n=j<k?2000:Math.floor(u*2000),p=[];for(var i=0;i<=n;i+=5)p.push([A.X(i*0.01),A.Y(o[i])]);D.path(p,cols[j],j===k?3:1.6,null,j===k?1:0.5);}
  var o2=PIDS[k][1],yf=o2[2000],mx=Math.max.apply(null,o2);U.readout(D,[PIDS[k][0],'valor final = '+nf(yf,2)+'    máximo = '+nf(mx,2)],468);}));

/* maqueta de dos tanques en cascada */
var T2=(function(){var h1=0,h2=0,dt=0.05,o=[];for(var i=0;i<=600;i++){var t=i*dt,q=t<15?1:0.6,q1=0.5*Math.sqrt(Math.max(h1,0)),q2=0.5*Math.sqrt(Math.max(h2,0));h1+=dt*(q-q1)/2;h2+=dt*(q1-q2)/2;o.push([h1,h2,q]);}return o;})();
M.reg('ic-tanq',M.base({title:'Maqueta de tanques: dos depósitos en cascada',H:560,dur:30,caps:[[8,'Una bomba llena el tanque superior; este desagua por un orificio en el inferior, que a su vez desagua al exterior. Caudal de salida <i>q = k·√h</i>.'],[15,'El nivel de abajo reacciona con retraso: dos depósitos en serie se comportan como un sistema de 2.º orden (sin sobreoscilación).'],[99,'En t = 15 s se reduce el caudal de la bomba: los niveles bajan hasta un nuevo equilibrio, donde entra lo mismo que sale: <i>h = (q/k)²</i>.']]},
 function(D,t){var i=Math.min(600,Math.floor(t/30*600)),s=T2[i],h1=s[0],h2=s[1];
  function tank(x,y,h,lab){D.rect(x,y,110,120,C.ax,null,2);var hh=Math.min(h/4,1)*120;D.rect(x+2,y+120-hh,106,hh,null,RG(C.f,.45));D.text(lab+' = '+nf(h,2)+' m',x+55,y+142,{s:15,a:'center',c:C.f});}
  tank(40,90,h1,'h_{1}');tank(130,260,h2,'h_{2}');D.line(150,210,150,260,C.f,3);D.line(240,380,240,420,C.f,3);D.line(20,70,95,70,C.hl,s[2]*4+1);D.text('q = '+nf(s[2],1),20,62,{s:14,c:C.hl});
  var A=U.axes(D,{xr:[0,30],yr:[0,4.5],xt:[10,20,30],yt:[1,2,3,4],xd:0,yd:0,xl:'t (s)',yl:'h (m)'},{x:320,y:110,w:280,h:260,grid:true}),p1=[],p2=[];for(var j=0;j<=i;j+=4){p1.push([A.X(j*0.05),A.Y(T2[j][0])]);p2.push([A.X(j*0.05),A.Y(T2[j][1])]);}
  D.path(p1,C.g,2.4);D.path(p2,C.m,2.8);D.text('h_{1}',A.X(28),A.Y(T2[560][0])-8,{s:15,c:C.g});D.text('h_{2}',A.X(28),A.Y(T2[560][1])+18,{s:15,c:C.m});
  U.readout(D,['equilibrio al que tienden: h = (q/k)² = '+nf(Math.pow(s[2]/0.5,2),2)+' m'],480);}));
})();
