/* Explicaciones sencillas de los problemas. Se muestran antes de la solución de cada uno. */
(function(){
var css='details.facil{margin:10px 0 4px;border:1px solid var(--line,#dfe5ec);border-left:4px solid var(--c8,#7a4fd1);border-radius:10px;background:var(--surface,#fff)}'+
'details.facil>summary{cursor:pointer;padding:10px 14px;font-weight:700;color:var(--fg,#1d2530)}'+
'details.facil .fbody{padding:4px 16px 14px;line-height:1.7}'+
'details.facil .fbody p{margin:.5em 0}'+
'details.facil .fbody ol{padding-left:1.3em}'+
'details.facil .fbody li{margin:.45em 0}'+
'details.facil .fbody .fidea{background:var(--bg,#f6f8fb);border-radius:8px;padding:8px 12px}';
css+='.vgal{margin:8px 0 6px}.vgal figure{margin:14px 0}.vgal img{width:100%;height:auto;border-radius:10px;border:1px solid var(--line,#dfe5ec);background:#fff}.vgal figcaption{font-weight:700;margin-top:6px;color:var(--fg,#1d2530)}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

var F=[
['P1 ·',`
<p class="fidea"><b>La idea en una frase:</b> es un sistema de segundo orden (dos polos iguales en −1). Cada apartado te pide una propiedad distinta: qué tan cerca está de oscilar, qué tan rápido responde y cómo corregirlo con un compensador.</p>
<ol>
<li><b>Frecuencia de cruce ω<sub>c</sub>.</b> Es la frecuencia donde la ganancia vale 1 (0 dB): el sistema deja pasar exactamente lo que entra. Para G = 30/(s+1)² en s = jω, el módulo es 30/(1+ω²). Igualado a 1 da ω² = 29, así que ω<sub>c</sub> = 5,39 rad/s.</li>
<li><b>Margen de fase.</b> La fase de (jω+1)² es −2·arctan(ω). En ω<sub>c</sub> vale −159°. El margen es lo que le falta para llegar a −180°: 21°. Si el sistema se realimenta, 21° es lo que aguanta antes de empezar a oscilar.</li>
<li><b>Ancho de banda ω<sub>b</sub>.</b> Es hasta qué frecuencia el sistema cerrado sigue bien la consigna: la respuesta cae 3 dB (a un 70 %). No es lo mismo que ω<sub>c</sub>: ω<sub>c</sub> es del lazo abierto, ω<sub>b</sub> del lazo cerrado.</li>
<li><b>Adelanto (apartado c).</b> Un adelanto da fase positiva en una zona de frecuencias. Lo colocamos justo en la nueva ω<sub>c</sub>. Primero se calcula cuántos grados hacen falta: 50° que queremos menos 21° que tenemos, más 10° de colchón, son 39°. Con 39° sale α = 0,227, que dice cuánto se "abre" la banda de fase. Después se busca la frecuencia donde el compensador sube la ganancia lo justo para que la nueva ω<sub>c</sub> caiga en el centro de esa banda (7,87 rad/s).</li>
<li><b>Atraso (apartado d).</b> Un atraso no añade fase: baja la ganancia en frecuencias altas, así que el cruce se mueve a una zona donde el sistema ya tiene menos retraso. Se puede ver como "cambiar el cruce a una frecuencia más lenta". Por eso el sistema queda con 50° de margen, pero responde más despacio (ω<sub>c</sub> ≈ 1,9 rad/s frente a 7,7 del adelanto).</li>
</ol>
<p><b>Error típico:</b> usar ω<sub>b</sub> cuando piden ω<sub>c</sub> (o al revés), y olvidar el colchón de 5° a 10° al elegir la fase del compensador.</p>`],

['P2 ·',`
<p class="fidea"><b>La idea en una frase:</b> primero se fija el error de velocidad (K<sub>v</sub>) con una ganancia, y después se añade un adelanto para conseguir el margen de fase pedido.</p>
<ol>
<li><b>Qué es K<sub>v</sub>.</b> Es lo que mide el error cuando la entrada es una rampa: e = 1/K<sub>v</sub>. Con G = 4/(s(s+2)), K<sub>v</sub> = 2. Para que valga 20 hay que multiplicar por K<sub>c</sub> = 10. Esa ganancia es fija: el adelanto que venga después no la cambia.</li>
<li><b>Cruce y margen actuales.</b> Con G = 40/(s(s+2)) se busca el módulo 1: ω<sub>c</sub> = 6,16 rad/s. La fase es −90° − arctan(3,08) = −162°. Margen actual: 18°.</li>
<li><b>Fase que hay que añadir.</b> Queremos 50°, tenemos 18°, y añadimos 5° de colchón: 37°. Con esos grados sale α = 0,249.</li>
<li><b>Dónde colocar el adelanto.</b> Se busca la frecuencia donde la ganancia sube 6,04 dB (1/√α). Ahí está 8,84 rad/s. El cero del compensador va en 1/T y el polo en 1/(αT), con T = 0,226 s.</li>
<li><b>Comprobación.</b> El resultado da MF = 49,7°, que es 50° con redondeo. Si te sale otro valor, revisa primero las dos partes del cálculo: el −90° del integrador y el arcotangente de la esquina.</li>
</ol>
<p><b>Por qué no cambia el error:</b> en continua el adelanto vale 1, así que K<sub>v</sub> sigue en 20.</p>`],

['P3 ·',`
<p class="fidea"><b>La idea en una frase:</b> el sistema es un integrador con un polo cercano a cero, y con ζ = 0,1 apenas tiene amortiguamiento, así que su margen es muy pequeño.</p>
<ol>
<li><b>Qué significa la fórmula.</b> Con ζ pequeño el sistema oscila mucho. Por eso el margen de fase sale tan bajo (11,4°). El margen de fase depende solo de ζ, no de ω<sub>n</sub>, y con ω<sub>n</sub> = 1 es fácil de calcular.</li>
<li><b>Lo que pide el apartado c.</b> El mínimo compensador es el más sencillo posible: una simple ganancia K. Como el sistema es de orden 2, ya tiene MG infinito, así que el único reto es el margen de fase.</li>
<li><b>Paso clave.</b> Como queremos 50° de margen, la fase tiene que valer −180° + 50° = −130°. Se busca la frecuencia donde pasa eso: ω = 0,168 rad/s.</li>
<li><b>Ganancia.</b> Se fija K para que el módulo valga 1 justo ahí: K = 0,0438. Bajar la ganancia mueve el cruce a donde el polo en −0,2 todavía no ha quitado mucha fase.</li>
</ol>
<p><b>Ojo:</b> la solución clásica con adelanto también vale, pero es más rápida (ω<sub>c</sub> = 1,6 en lugar de 0,17). Si el enunciado pide "el mínimo", la respuesta correcta es la ganancia.</p>`],

['P4 ·',`
<p class="fidea"><b>La idea en una frase:</b> la planta tiene la fase muy baja, así que subir la ganancia la hace inestable. Un adelanto no basta, y hay que usar un atraso.</p>
<ol>
<li><b>Ganancia para K<sub>v</sub> = 5.</b> Con G = 1/(s(s+1)(0,5s+1)), K<sub>v</sub> = K<sub>c</sub>. Entonces K<sub>c</sub> = 5.</li>
<li><b>Por qué sale inestable.</b> Con K = 5 el cruce está en 1,80 rad/s, y allí la fase es −193°. Un margen negativo significa que el lazo cerrado oscila. Este resultado dice que la planta, a esa ganancia, ya está al borde.</li>
<li><b>Por qué el adelanto falla.</b> Un adelanto sube la frecuencia de cruce. Pero aquí la fase cae tan deprisa que, al subir el cruce, se pierde más fase de la que el adelanto aporta. La comprobación real da MF = 19°: no cumple.</li>
<li><b>La solución: un atraso.</b> El atraso baja la ganancia en frecuencias medias y altas. El cruce pasa a 0,46 rad/s, donde la fase es mejor. El compensador es 5(10s+1)/(100s+1): cero en 0,1, polo en 0,01 (β = 10).</li>
</ol>
<p><b>Lección:</b> si la fase de la planta cae muy rápido, no sigas añadiendo adelantos. Mira si un atraso resuelve el problema.</p>`],

['P5 ·',`
<p class="fidea"><b>La idea en una frase:</b> hay una realimentación H, así que el lazo de verdad es K·100/(s(s+1)(s+10)). Todo se calcula sobre ese lazo.</p>
<ol>
<li><b>Qué es el lazo L.</b> Es lo que da la vuelta: el controlador por la planta por la realimentación. Por eso el factor (s+10) aparece en el denominador y aporta fase de retraso.</li>
<li><b>a) K para MF = 40°.</b> Se busca la frecuencia donde la fase de L vale −140°. Con la suma de los tres ángulos sale ω = 0,979 rad/s. Ahí el módulo debe valer 1: esto da K = 0,138. El MG sale 18 dB.</li>
<li><b>b) La atenuación.</b> Hay que bajar la señal al menos 100 dB para frecuencias de ruido (ω ≥ 100). Con K = 0,138 ya atenúa 97,3 dB, faltan 2,7 dB. Eso se consigue con un atraso (β = 1,4), que baja la ganancia en esa zona sin estropear el margen de fase.</li>
<li><b>c) Ancho de banda del lazo cerrado.</b> Con H aparece una ganancia de 1/H(0) = 0,1, es decir −20 dB. El ancho de banda es donde la respuesta cae 3 dB respecto a ese valor, −23 dB: ω<sub>b</sub> ≈ 1,31 rad/s.</li>
</ol>
<p><b>Error típico:</b> olvidar que H cambia el lazo y hacer los cálculos sobre G sola.</p>`],

['P6 ·',`
<p class="fidea"><b>La idea en una frase:</b> el sistema es estable pero "lento y con error". Cada apartado añade una exigencia y hay que decidir qué herramienta sirve para cada una.</p>
<ol>
<li><b>a) ¿Hay margen de fase?</b> Hay que mirar si la curva llega a 0 dB. Su valor máximo es 0,144, así que <b>nunca llega a 1</b>. No hay frecuencia de cruce y el margen no existe. El sistema ya es estable, así que no hace falta compensar.</li>
<li><b>b) Error de posición.</b> Con un controlador K<sub>c</sub>, el error de posición es e<sub>p</sub> = 1/(1 + K<sub>p</sub>). Si K<sub>p</sub> sube, el error baja. Aquí queremos 7,5 %, así que K<sub>c</sub> ≈ 99. Pero con esa ganancia el margen de fase cae a 6,9°, así que hay que añadir un adelanto.</li>
<li><b>Adelanto.</b> Con 5° de colchón no basta (39°), porque la fase cae rápido por el par complejo. Con 15° de colchón se llega a 46,1°.</li>
<li><b>c) ω<sub>c</sub> = 5 rad/s fijo.</b> Aquí no basta con la fase: también hay que elegir K para que el cruce caiga en 5 rad/s. Con K = 28,9 el módulo vale 1 justo ahí.</li>
<li><b>d) Todo a la vez.</b> Con K<sub>c</sub> = 98,67 la ganancia en 5 rad/s ya es demasiado alta, y el adelanto la subiría más. Hace falta un adelanto-atraso: el adelanto da la fase y el atraso baja la ganancia en esa zona.</li>
</ol>
<p><b>Por qué el número de apartados importa:</b> cada requisito cambia la solución. Lee primero qué pide cada uno.</p>`],

['P7 ·',`
<p class="fidea"><b>La idea en una frase:</b> sube tanto la ganancia para tener K<sub>v</sub> = 10 que el sistema queda inestable. Hay que decidir si un adelanto puede arreglarlo, y en este caso no puede.</p>
<ol>
<li><b>Ganancia.</b> Con G = 1/(s(s+1)(s+2)), K<sub>v</sub> = K<sub>c</sub>/2. Para 10 hace falta K<sub>c</sub> = 20.</li>
<li><b>Margen actual.</b> Con 20 el cruce está en 2,43 rad/s y la fase en −208°. Eso es un margen de −28°: inestable.</li>
<li><b>¿Sirve un adelanto?</b> Harían falta 83° de fase. Un solo adelanto da como máximo unos 65°, y para 83° el α sale 0,0037. Eso no es realizable: en la práctica α ≥ 0,05.</li>
<li><b>Solución: atraso.</b> Se busca la frecuencia donde la fase vale −124° (la fase objetivo). Ahí ω<sub>c</sub> = 0,412 rad/s, y el módulo es 26,8 dB, así que β = 22. El cero va una década por debajo: T = 24,3 s.</li>
<li><b>Comprobación.</b> Da MF = 50,4° y MG = 15,9 dB, y K<sub>v</sub> = 10. Cumple todo.</li>
</ol>
<p><b>Regla práctica:</b> cuando falta más de 60° de fase, un adelanto no sirve; usa un atraso.</p>`],

['P8 ·',`
<p class="fidea"><b>La idea en una frase:</b> es un sistema de tipo 0 con dos polos. Primero se calcula su margen, y después se sube la ganancia para cumplir el error y se compensa.</p>
<ol>
<li><b>a) Margen de fase.</b> El cruce cumple (ω²+1)(ω²+16) = 100. Con t = ω² sale ω<sub>c</sub> = 2 rad/s. Las dos fases son −63,4° y −26,6°, que suman −90°. Margen: 90°. Es un valor alto.</li>
<li><b>b) Ancho de banda.</b> El lazo cerrado es 10/(s² + 5s + 14). Su ganancia en continua es 10/14 (−2,92 dB). El ancho de banda es donde cae 3 dB más: −5,92 dB, ω<sub>b</sub> = 3,95 rad/s.</li>
<li><b>c) Error del 10 %.</b> En un sistema de tipo 0, e<sub>p</sub> = 1/(1 + K<sub>p</sub>). Para 10 % hace falta K<sub>p</sub> = 9, así que K<sub>c</sub> = 3,6. Pero entonces el margen cae a 47,6°. Hace falta un adelanto para llegar a 65°.</li>
<li><b>Adelanto con 12° de colchón.</b> Hacen falta 29,4° y sale α = 0,342. Con esa colocación el margen sube a 65,8°.</li>
<li><b>d) Margen de ganancia.</b> Un sistema de orden 2 con adelanto nunca llega a −180°, así que el MG es infinito.</li>
</ol>
<p><b>Error típico:</b> no ver que, al subir K para el error, el margen baja.</p>`],

['Ej. 1a',`
<p class="fidea"><b>La idea en una frase:</b> un integrador. Solo tiene que dar la "forma" de la recta de −20 dB por década y la fase de −90°.</p>
<ol>
<li><b>Módulo.</b> |G| = K/ω. En escala logarítmica: 20·log K − 20·log ω. Es una recta que baja 20 dB cada vez que la frecuencia se multiplica por 10.</li>
<li><b>Qué hace K.</b> Solo sube o baja la recta entera. En ω = 1 el valor es 20·log K: 0 dB con K = 1, y 20 dB con K = 10.</li>
<li><b>Fase.</b> El ángulo de 1/(jω) es siempre −90°, sea cual sea K. Por eso el Bode tiene una línea horizontal en −90°.</li>
<li><b>Polar.</b> Con ω de 0 a infinito, el punto va desde −j∞ hasta el origen por el eje imaginario negativo.</li>
</ol>`],

['Ej. 1b',`
<p class="fidea"><b>La idea en una frase:</b> un polo simple. Tiene una esquina en ω = 1/T y, a partir de ahí, la ganancia cae 20 dB por década.</p>
<ol>
<li><b>Frecuencia de corte.</b> Es donde ωT = 1, o sea ω = 1/T = 1/2 = 0,5 rad/s. Ahí la parte imaginaria de 1 + jωT iguala a la real.</li>
<li><b>Valor en la esquina.</b> El módulo es 1/√2, es decir −3 dB, y la fase es −45°. Esos dos valores son la "señal" de la esquina: si los conoces, puedes dibujar el resto.</li>
<li><b>Baja frecuencia.</b> La ganancia es 1 (0 dB) y la fase 0°.</li>
<li><b>Alta frecuencia.</b> La ganancia cae 20 dB por década y la fase tiende a −90°. Como nunca llega a 0 dB (salvo en ω = 0), no hay margen de ganancia.</li>
</ol>`],

['Ej. 2 ·',`
<p class="fidea"><b>La idea en una frase:</b> el mismo lazo de segundo orden con distintos amortiguamientos. Cuanto más amortiguado, más margen de fase y menos resonancia.</p>
<ol>
<li><b>Por qué se toma G = 1/(s(s+2ζ)).</b> Así el lazo cerrado es s² + 2ζs + 1, que es el segundo orden estándar con ω<sub>n</sub> = 1. Es la forma de tener los números del enunciado.</li>
<li><b>Lo que se mira en la tabla.</b> ω<sub>c</sub> es la frecuencia de cruce. MF es el margen de fase. M<sub>r</sub> es el pico de resonancia (cuánto se amplifica cerca de ω<sub>r</sub>). ω<sub>b</sub> es el ancho de banda.</li>
<li><b>Qué ver en la tabla.</b> Con ζ = 0,1 el margen es de 11° y el pico de resonancia de 5: el sistema oscila mucho. Con ζ = 0,7 el margen es de 65° y ya no hay pico (M<sub>r</sub> = 1).</li>
<li><b>Regla práctica.</b> MF ≈ 100·ζ hasta ζ = 0,7. Eso sirve para comprobar que los números salen bien.</li>
</ol>
<p><b>Error típico:</b> pensar que un ancho de banda grande es siempre mejor. Más ancho de banda también significa más ruido entrando al lazo.</p>`],

['Ej. 3 ·',`
<p class="fidea"><b>La idea en una frase:</b> hay que construir el lazo abierto L = D·G·H antes de leer nada, porque los márgenes se miden sobre L, no sobre G.</p>
<ol>
<li><b>Lazo abierto.</b> Como D = 1, L = 50/((s+0,1)(s+3)(s+5)). Un error común es olvidar la H de la realimentación.</li>
<li><b>Forma de Bode.</b> Para dibujarlo hay que pasar cada factor a la forma (1 + sT). Así se ve la ganancia de continua (30,5 dB) y las esquinas en 0,1, 3 y 5.</li>
<li><b>Cruce ω<sub>c</sub>.</b> Donde |L| = 1 sale ω<sub>c</sub> = 2,36 rad/s. Ahí la fase es −151°, así que MF = 29°.</li>
<li><b>Cruce de fase ω<sub>180</sub>.</b> Es donde la parte imaginaria de (s+0,1)(s+3)(s+5) se anula, en 3,97 rad/s. Ahí |L| = 0,395, y el MG es 1/0,395 = 2,5 veces, es decir 8,1 dB.</li>
</ol>`],

['Problema de frecuencia: G(s) = 30/',`
<p class="fidea"><b>La idea en una frase:</b> es el problema P1 con otros colchones. Sirve para entender que el compensador no es único: depende de los grados de colchón que elijas.</p>
<ol>
<li><b>a) y b)</b> son iguales que en P1: ω<sub>c</sub> = 5,39 rad/s y MF = 21°; ancho de banda 8,45 rad/s.</li>
<li><b>c) Adelanto con 8° de colchón.</b> Hacen falta 37° y sale α = 0,249. El cruce nuevo es 7,69 rad/s y el MF queda en 51,8°.</li>
<li><b>d) Atraso con 5° de colchón.</b> La fase objetivo es −125°, y el cruce es 1,92 rad/s. Ahí β = 6,40, y el cero va una década por debajo. Queda MF = 50,1°.</li>
<li><b>Comparación.</b> El adelanto es rápido (cruce a 7,7 rad/s) pero deja más ruido entrar. El atraso es unas cuatro veces más lento, pero filtra el ruido.</li>
</ol>`],

['Mínimo compensador con ζ',`
<p class="fidea"><b>La idea en una frase:</b> el "mínimo compensador" es una simple ganancia K. Se elige para que el cruce caiga donde el margen de fase es 50°.</p>
<ol>
<li><b>a) y b)</b> son fórmulas generales: el margen y el ancho de banda de un segundo orden con ζ y ω<sub>n</sub>. No dependen del número concreto, solo de ζ.</li>
<li><b>c) Números.</b> Con ζ = 0,1 y ω<sub>n</sub> = 1 el sistema es G = 1/(s(s + 0,2)). Su margen es 11,4°, muy bajo.</li>
<li><b>Dónde está el cruce deseado.</b> Queremos fase −130° (50° de margen). Se resuelve −90° − arctan(ω/0,2) = −130°, y sale ω = 0,2·tan 40° = 0,168 rad/s.</li>
<li><b>Ganancia K.</b> Se elige K para que el módulo valga 1 en ese punto: K = ω·√(ω² + 0,04) = 0,0438.</li>
</ol>
<p><b>Por qué una ganancia sirve:</b> bajar la ganancia mueve el cruce hacia una zona donde la fase es menos negativa.</p>`],

['Problema completo',`
<p class="fidea"><b>La idea en una frase:</b> es un sistema de tipo 1 con K, y el reto es elegir K para el error, comprobar la estabilidad y compensar si hace falta.</p>
<ol>
<li><b>a) K para el error de rampa.</b> Con un integrador, K<sub>v</sub> = K/3. El error de rampa es e = 3/K ≤ 0,1, así que K ≥ 30. Pero con K = 30 el sistema es inestable: habría que compensar mucho.</li>
<li><b>b) MF y MG con K = 3.</b> El margen de fase sale 9,6°. El margen de ganancia se mira donde la fase vale −180°, en ω = √(3/5) = 0,775 rad/s. Ahí MG = 2,14 dB. Estable, pero muy cerca del límite.</li>
<li><b>c) Compensar.</b> Un adelanto con 12° de colchón no sirve: la planta tiene cuatro polos y la fase cae muy deprisa. El MF final se queda en 22°. La solución es un atraso con β = 3,48, cero en 0,0267 rad/s. Queda MF = 50,8° y MG = 12,6 dB.</li>
<li><b>d) Ancho de banda.</b> Con K = 3 se busca donde |T| = 1/√2: ω<sub>b</sub> ≈ 1,04 rad/s.</li>
</ol>
<p><b>Lección:</b> comprueba el MF final después de compensar. Si no llega, el adelanto no era la herramienta adecuada.</p>`],

['Sintonía de Ziegler',`
<p class="fidea"><b>La idea en una frase:</b> Ziegler–Nichols en lazo cerrado: aumentas la ganancia hasta que el sistema oscila justo, y con esa ganancia y el periodo de la oscilación calculas el PID.</p>
<ol>
<li><b>Qué es el PID del enunciado.</b> R(s) = k(s+a)(s+b)/s tiene un polo en el origen, así que es un PID. El polo en cero es lo que hace el error de posición nulo.</li>
<li><b>Ganancia crítica K<sub>cr</sub>.</b> Con solo K, la ecuación del lazo es s³ + 6s² + 11s + (6 + K) = 0. El criterio de Routh dice que la oscilación pura aparece cuando K = 60.</li>
<li><b>Periodo P<sub>cr</sub>.</b> A K = 60 el sistema oscila a ω = √11 = 3,32 rad/s. Su periodo es 2π/ω = 1,89 s.</li>
<li><b>Tabla de Ziegler–Nichols.</b> Para un PID: K<sub>p</sub> = 0,6·K<sub>cr</sub> = 36, T<sub>i</sub> = 0,5·P<sub>cr</sub> = 0,947 s, T<sub>d</sub> = 0,125·P<sub>cr</sub> = 0,237 s.</li>
<li><b>Forma pedida.</b> Se reescribe como k(s+a)(s+b)/s. El trinomio sale un cuadrado perfecto, (s + 2,11)², así que a = b = 2,11.</li>
</ol>
<p><b>Nota:</b> el enunciado no deja leer p₁, p₂ y p₃; aquí se usan 1, 2 y 3.</p>`],

['PI por asignación',`
<p class="fidea"><b>La idea en una frase:</b> decides dónde quieres los polos del lazo cerrado (con ζ y ω<sub>n</sub>), y luego calculas K<sub>p</sub> y T<sub>i</sub> para que coincidan.</p>
<ol>
<li><b>Traducir el enunciado a ζ y ω<sub>n</sub>.</b> Para M<sub>p</sub> &lt; 5 % hace falta ζ &gt; 0,69. Tomamos ζ = 0,7. Para t<sub>s</sub> &lt; 20 s hace falta ζω<sub>n</sub> &gt; 0,2, y tomamos ω<sub>n</sub> = 0,3 rad/s.</li>
<li><b>Ecuación deseada.</b> s² + 2ζω<sub>n</sub>s + ω<sub>n</sub>² = s² + 0,42s + 0,09.</li>
<li><b>Ecuación real con el PI.</b> El lazo tiene la forma s² + (1 + 3K<sub>p</sub>)/10·s + 3K<sub>p</sub>/(10T<sub>i</sub>).</li>
<li><b>Igualar coeficientes.</b> Del término en s: K<sub>p</sub> = 1,067. Del término independiente: T<sub>i</sub> = 3,56 s.</li>
</ol>
<p><b>Matiz (importante):</b> el PI añade un cero, y el cero sube el sobrepico. Con ζ = 0,7 el sobrepico real sale de unos 12,5 %, más que el 5 % pedido. Para cumplirlo hay que tomar ζ ≈ 1,05 (con ω<sub>n</sub> = 0,3): K<sub>p</sub> ≈ 1,77 y T<sub>i</sub> ≈ 5,9 s, con un sobrepico de unos 4,7 %.</p>`],

['Concentración en un reactor',`
<p class="fidea"><b>La idea en una frase:</b> ante una entrada senoidal, la salida tiene la misma frecuencia pero menor amplitud. Lo que hay que calcular es cuánto se reduce.</p>
<ol>
<li><b>Qué es el sistema.</b> Dos tanques en serie: G = K/(τs+1)². Cada tanque es un filtro que deja pasar mal las oscilaciones rápidas.</li>
<li><b>Módulo a ω = 0,2.</b> Con τ = 8,25 min: τω = 1,65. Entonces |G| = 0,448/(1 + 1,65²) = 0,120.</li>
<li><b>Amplitud de salida.</b> Entra con amplitud 0,1, así que sale 0,1·0,120 = 0,012 mol/m³.</li>
<li><b>Conclusión.</b> 0,012 es menor que el límite (0,05). No hace falta controlador. Es el ejemplo de cuándo la propia planta ya filtra la perturbación.</li>
</ol>
<p><b>Desfase:</b> −2·arctan(1,65) = −117,6°. La salida va retrasada eso, en radianes −2,05.</p>`],

['Problema de frecuencia: alerón',`
<p class="fidea"><b>La idea en una frase:</b> el alerón es un integrador con un polo lento. Es fácil de entender con el lazo, pero hay que pensar qué pide cada apartado.</p>
<ol>
<li><b>a) Respuesta ante senoide.</b> Con la fórmula de siempre se obtiene la amplitud y la fase de la salida. Cuando 0,1 − ω² es negativo, el arcotangente da el cuadrante equivocado. Por eso hay que sumar −180° a la fase.</li>
<li><b>b) Error menor que 1.</b> El sistema ya tiene un integrador, así que el error al escalón es cero. Se mira el error de rampa: e = 1/K, y K tiene que ser algo mayor que 1.</li>
<li><b>c) Margen con K ≈ 1.</b> Sale ω<sub>c</sub> = 0,31 rad/s y MF ≈ 18°. El sistema cerrado tiene ζ = 0,16: oscila mucho, con un sobrepico del 60 %.</li>
<li><b>d) MF mayor de 90° y MG mayor de 70 dB.</b> Con un integrador y un polo, la fase nunca pasa de −90°, así que hace falta un cero. Un PD con τ = 20 da C = K(20s+1) y MF ≈ 91,4°. En la práctica se añade un polo lejano para que el controlador no amplifique el ruido.</li>
</ol>`]
,
['Salida ante una senoide (primer orden)',`
<p class="fidea"><b>La idea en una frase:</b> una senoide que entra en un sistema sale con la misma frecuencia, pero con otro tamaño (amplitud) y desplazada en el tiempo (fase).</p>
<ol>
<li><b>Sustituye s por jω.</b> Con ω = 5 queda G(j5) = 1/(1 + 15j). Es un número complejo: su módulo dice cuánto cambia el tamaño y su ángulo dice cuánto se retrasa.</li>
<li><b>Módulo.</b> √(1 + 15²) = 15,03, así que |G| = 1/15,03 = 0,0665. La senoide sale unas 15 veces más pequeña.</li>
<li><b>Fase.</b> −arctan(15) = −86,2° (−1,504 rad). Casi −90°: la salida llega con casi un cuarto de periodo de retraso.</li>
<li><b>Amplitud final.</b> 2 · 0,0665 = 0,133.</li>
</ol>
<p><b>Error típico:</b> olvidar multiplicar por la amplitud de la entrada (el 2), o poner la fase en grados dentro de un seno que pide radianes.</p>`],

['Ancho de banda y respuestas temporales',`
<p class="fidea"><b>La idea en una frase:</b> el ancho de banda dice hasta qué frecuencia el sistema sigue bien la entrada. Las respuestas temporales muestran lo que hace el sistema ante un escalón y ante una rampa.</p>
<ol>
<li><b>Ancho de banda.</b> |G(jω)| = 1/√(1 + 25ω²). Vale 1/√2 (−3 dB) cuando 25ω² = 1, es decir ω = 0,2 rad/s. Es 1/τ, con τ = 5 s.</li>
<li><b>Escalón.</b> Y(s) = 1/(s(5s+1)). Se descompone en 1/s − 5/(5s+1). El resultado es y(t) = 1 − e<sup>−t/5</sup>: sube hasta 1 (el valor final) como una exponencial.</li>
<li><b>Rampa.</b> Y(s) = 1/(s²(5s+1)). El resultado es y(t) = t − 5 + 5e<sup>−t/5</sup>. Para t grande, y ≈ t − 5: la salida sigue la rampa con un retraso de 5 s, igual a la constante de tiempo.</li>
<li><b>Comprobación.</b> En t = 0 las dos respuestas valen 0, como debe ser.</li>
</ol>`],

['Diagrama de Bode asintótico (1)',`
<p class="fidea"><b>La idea en una frase:</b> un Bode asintótico se dibuja sumando piezas. Cada factor aporta una recta, y lo único que hay que saber es en qué frecuencia cambia la pendiente.</p>
<ol>
<li><b>Las piezas de G = 2/(s(1+s)(1+3s)).</b> La constante 2 da +6 dB. El integrador da una recta de −20 dB por década. El polo en ω = 1/3 y el polo en ω = 1 hacen que la pendiente baje otros 20 dB por década cada uno.</li>
<li><b>Punto de partida.</b> La recta inicial es 20·log(2/ω). En ω = 0,1 vale 26 dB (el valor real es 25,6).</li>
<li><b>Primera esquina, ω = 1/3.</b> La asíntota vale 20·log 6 = 15,6 dB y la pendiente pasa de −20 a −40 dB por década.</li>
<li><b>Segunda esquina, ω = 1.</b> La asíntota vale 15,6 − 40·log 3 = −3,5 dB y la pendiente pasa a −60.</li>
<li><b>Fase.</b> Empieza en −90° (el integrador) y acaba en −270° (el integrador más los dos polos, cada uno resta hasta 90°).</li>
</ol>
<p><b>Regla para no perderse:</b> cada polo baja la pendiente 20 dB por década y resta 90° de fase en total. Cada cero hace lo contrario.</p>`],

['Diagrama de Bode asintótico (2)',`
<p class="fidea"><b>La idea en una frase:</b> lo mismo que el anterior, pero con un doble integrador y un cero que sube la pendiente otra vez.</p>
<ol>
<li><b>Normalizar.</b> 2(s + 3) = 6(1 + s/3). Así G = 6(1 + s/3)/(s²(1 + 5s)). El 6 da 15,6 dB.</li>
<li><b>Doble integrador.</b> Pendiente de −40 dB por década y fase de −180° a baja frecuencia.</li>
<li><b>Polo en 0,2.</b> La pendiente pasa a −60 dB por década.</li>
<li><b>Cero en 3.</b> La pendiente vuelve a −40 dB por década.</li>
<li><b>Valor en ω = 0,1.</b> 15,6 + 40 (por el doble integrador) = 55,6, menos una corrección de 1 dB que dan los factores cercanos: 54,6 dB.</li>
<li><b>Fase.</b> Empieza en −180°, baja hacia −270° por el polo en 0,2 y vuelve hacia −180° por el cero en 3.</li>
</ol>`],

['Salida ante una senoide (sistema con integrador)',`
<p class="fidea"><b>La idea en una frase:</b> es el mismo método que el primer ejemplo: sustituir s por jω, calcular módulo y fase, y aplicarlos a la entrada.</p>
<ol>
<li><b>Denominador con ω = 10.</b> s(s+1)(s+5) con s = j10 tiene módulo 10 · 10,05 · 11,18 = 1123,6.</li>
<li><b>Numerador.</b> |3 + 10j| = 10,44.</li>
<li><b>Módulo y amplitud.</b> |G| = 10,44/1123,6 = 0,00929. La amplitud de salida es 5 · 0,00929 = 0,0465.</li>
<li><b>Fase.</b> El numerador aporta arctan(10/3) = 73,3°. El denominador resta 90° (por el integrador), más arctan 10 = 84,3° y arctan 2 = 63,4°. Total: 73,3 − 237,7 = −164,4°.</li>
</ol>
<p><b>Lo que no cambia:</b> la frecuencia sigue siendo 10 rad/s.</p>`],

['Margen de fase de un tercer orden',`
<p class="fidea"><b>La idea en una frase:</b> para el margen de fase hay que encontrar dos cosas: dónde el lazo tiene ganancia 1 (ω<sub>c</sub>), y qué fase tiene ahí.</p>
<ol>
<li><b>Encontrar ω<sub>c</sub>.</b> Se eleva al cuadrado el módulo para quitar las raíces: |G|² = 144/(ω²(ω² + 4)(ω² + 16)). Igualando a 1 sale ω<sub>c</sub> = 1,224 rad/s.</li>
<li><b>Fase en ω<sub>c</sub>.</b> El integrador aporta −90°. El factor (s+2) aporta −arctan(0,612) = −31,5°. El factor (s+4) aporta −arctan(0,306) = −17,0°. Total: −138,5°.</li>
<li><b>Margen.</b> MF = 180° − 138,5° = 41,5°.</li>
</ol>`],

['Margen de fase y de ganancia',`
<p class="fidea"><b>La idea en una frase:</b> es el mismo ejemplo de la imagen de la página de márgenes. Si lo entiendes aquí, entiendes el margen.</p>
<ol>
<li><b>Margen de fase.</b> Se busca dónde |G| = 1: ω<sub>c</sub> = 0,684 rad/s. La fase ahí es −90° − 34,4° − 6,5° = −130,9°. MF = 180 − 130,9 = 49,1°.</li>
<li><b>Margen de ganancia.</b> Se busca dónde la fase vale −180°. En el denominador, la parte imaginaria es 6ω − ω³ y se anula con ω² = 6, es decir ω<sub>180</sub> = 2,449 rad/s.</li>
<li><b>Módulo ahí.</b> La parte real del denominador vale −7ω² = −42, así que |G| = 5/42 = 0,119. El margen es 1/0,119 = 8,4 veces, o sea 20·log(8,4) = 18,5 dB.</li>
</ol>
<p><b>Error típico:</b> confundir el margen en veces con el margen en decibelios. Son dos formas de decir lo mismo.</p>`],

['Efecto de la ganancia en la estabilidad',`
<p class="fidea"><b>La idea en una frase:</b> subir la ganancia acerca el lazo a la inestabilidad. El margen de fase baja hasta que se hace negativo.</p>
<ol>
<li><b>K = 10.</b> ω<sub>c</sub> = 1,227 rad/s y fase −154,6°. MF = 25,4°: estable.</li>
<li><b>K = 100.</b> ω<sub>c</sub> = 3,907 rad/s y fase −203,6°. MF = −23,6°: el lazo es inestable.</li>
<li><b>Ganancia crítica.</b> La fase vale −180° en ω = √5. Ahí K<sub>cr</sub> = ω·√(ω² + 1)·√(ω² + 25) = 30. Entre 10 y 100 se cruza ese valor.</li>
</ol>`],

['Senoide con cero y tres polos',`
<p class="fidea"><b>La idea en una frase:</b> igual que el ejemplo con integrador, pero aquí el cero del numerador resta fase en lugar de sumarla.</p>
<ol>
<li><b>Denominador con ω = 10.</b> j10 · (j10 + 1) · (j10 + 3): módulo 10 · 10,05 · 10,44 = 1049,2.</li>
<li><b>Numerador.</b> |5 + 10j| = 11,18. Entonces |G| = 11,18/1049,2 = 0,01066.</li>
<li><b>Fase.</b> El numerador aporta arctan 2 = 63,4°. El denominador aporta 90° + arctan 10 (84,3°) + arctan(10/3) (73,3°) = 247,6°. Total: 63,4 − 247,6 = −184,2° (−3,214 rad).</li>
</ol>
<p><b>Resultado:</b> y(t) = A · 0,01066 · sen(10t − 3,214).</p>`],

['Compensador más sencillo y adelanto',`
<p class="fidea"><b>La idea en una frase:</b> primero se prueba lo más simple: una ganancia. Si no basta, se añade un adelanto.</p>
<ol>
<li><b>a) Una ganancia.</b> Una ganancia no cambia la fase. Para 50° de margen la fase debe valer −130°: −90° − arctan ω = −130°, así que ω = tan 40° = 0,839 rad/s.</li>
<li><b>Elegir K.</b> Ahí el módulo tiene que valer 1: 5K/(ω√(1+ω²)) = 1, y sale K = 0,219.</li>
<li><b>b) Con K<sub>v</sub> = 10.</b> Entonces 5K = 10, así que K = 2. Con esa ganancia el margen es 18°.</li>
<li><b>Adelanto.</b> Hacen falta 50 − 18 + 8 = 40°, y α = 0,217. Se coloca donde la ganancia baja 6,6 dB: ω<sub>m</sub> = 4,58 rad/s.</li>
<li><b>Resultado.</b> C(s) = 2(0,469s + 1)/(0,102s + 1). El margen queda en 52,4°.</li>
</ol>`],

['Adelanto del Ogata 7-26 con colchón de 8°',`
<p class="fidea"><b>La idea en una frase:</b> es el problema P2 con 8° de colchón en lugar de 5°. Sirve para ver que el colchón lo eliges tú, y que cambia un poco el resultado.</p>
<ol>
<li><b>Error de velocidad.</b> K<sub>v</sub> = 2K = 20, así que K = 10.</li>
<li><b>Margen actual.</b> Con G₁ = 40/(s(s+2)), ω<sub>c</sub> = 6,17 rad/s y MF = 18°.</li>
<li><b>Fase a añadir.</b> 50° − 18° + 8° = 40°, y α = 0,217. La ganancia baja 6,6 dB en ω<sub>m</sub> = 9,16 rad/s.</li>
<li><b>Cero y polo.</b> T = 0,234 s y αT = 0,0509 s. Así C(s) = 10(0,234s + 1)/(0,0509s + 1).</li>
<li><b>Comprobación.</b> K<sub>v</sub> = 20 y MF = 52,4°.</li>
</ol>`],

['Sistema de tipo 0',`
<p class="fidea"><b>La idea en una frase:</b> como el sistema es de tipo 0, no tiene integrador y el error no se anula solo. Se controla subiendo la ganancia K, y después se compensa el margen de fase.</p>
<ol>
<li><b>a) Error de posición.</b> e = 1/(1 + K<sub>p</sub>), con K<sub>p</sub> = 10K/4. Para e ≤ 0,1 hace falta K<sub>p</sub> ≥ 9, así que K ≥ 3,6. Tomamos K = 4.</li>
<li><b>Margen con K = 4.</b> Se busca |KG| = 1: ω<sub>c</sub> = 5,67 rad/s. La fase es −80° − 54,8° = −134,8°, así que MF = 45,2°.</li>
<li><b>b) Adelanto para 65°.</b> Faltan 65° − 45,2° + 10° ≈ 30°. Con 30° sale α = 1/3 (ya que sen 30° = 0,5).</li>
<li><b>Colocación.</b> Se busca donde la ganancia baja 4,77 dB (10·log 3): ω<sub>m</sub> = 7,82 rad/s. T = 0,221 s y αT = 0,0738 s.</li>
<li><b>Resultado.</b> C(s) = 4(0,221s + 1)/(0,0738s + 1). MF = 64,4°.</li>
</ol>`],

['Diagramas polares básicos',`
<p class="fidea"><b>La idea en una frase:</b> un diagrama polar dibuja, para cada frecuencia, el punto G(jω) en el plano complejo. Cuando ω crece, el punto se mueve.</p>
<ol>
<li><b>G = 1/(1 + jωT).</b> En ω = 0 vale 1. En ω = 1/T vale 0,5 − 0,5j. Cuando ω → ∞ tiende a 0 con fase −90°. Esos tres puntos forman media circunferencia de centro (0,5; 0) y radio 0,5, por la parte de abajo.</li>
<li><b>G = e<sup>−jωT</sup>.</b> El módulo es 1 para cualquier ω, y la fase es −ωT. El punto da vueltas sobre la circunferencia unidad, en sentido horario. Por eso un retardo no cambia el tamaño, solo va dando vueltas.</li>
</ol>`]
];

var V={
'P1 ·':[['p1_paso1.png','Paso 1 · Busca dónde la ganancia vale 1: ahí está ω_c.'],['p1_paso2.png','Paso 2 · Mira la fase en ω_c: lo que le falta para −180° es el margen.'],['p1_paso3.png','Paso 3 · Ancho de banda del lazo cerrado: donde cae 3 dB.'],['p1_paso4.png','Paso 4 · El adelanto sube la fase en ω_m y mueve el cruce.'],['p1_resumen.png','Resumen de los números.']],
'P2 ·':[['p2_paso1.png','Paso 1 · Subir Kc = 10 desplaza la curva: Kv = 20.'],['p2_paso2.png','Paso 2 · Fase en ω_c = −162° → MF = 18°.'],['p2_paso3.png','Paso 3 · Adelanto con 5° de colchón → MF ≈ 50°.']],
'P3 ·':[['p3_paso1.png','Paso 1 · Una ganancia K = 0,0438 lleva el cruce a la fase −130°.'],['p3_resumen.png','Resumen de los números.']],
'P4 ·':[['p4_paso1.png','Paso 1 · Con Kv = 5 el cruce cae en fase −193°: inestable.'],['p4_paso2.png','Paso 2 · Con el atraso, el cruce baja a 0,45 rad/s y MF = 41,6°.']],
'P5 ·':[['p5_paso1.png','Paso 1 · K = 0,138 da MF = 40° (y MG = 18 dB).'],['p5_paso2.png','Paso 2 · Atraso β = 1,4: −100 dB en ω ≥ 100 y MF = 45,9°.']],
'P6 ·':[['p6_paso1.png','Paso 1 · |G| nunca llega a 0 dB: no hay margen de fase.'],['p6_paso2.png','Paso 2 · Con Kc = 98,67 el error es 7,5 %, pero el margen cae a 6,9°.'],['p6_paso3.png','Paso 3 · Adelanto con 15° de colchón → MF = 46,1°.']],
'P7 ·':[['p7_paso1.png','Paso 1 · Con Kc = 20 es inestable (MF = −28°).'],['p7_paso2.png','Paso 2 · Atraso β = 22: el cruce baja a 0,41 rad/s y MF = 50,4°.']],
'P8 ·':[['p8_paso1.png','Paso 1 · MF = 90° sin compensar.'],['p8_paso2.png','Paso 2 · Kc = 3,6 para e_p = 10 %: MF = 47,6°.'],['p8_paso3.png','Paso 3 · Adelanto con 12° de colchón → MF = 65,8°.']],
'Diagrama de Bode asintótico (1)':[['ac_bode_asintotico1.png','Azul: el diagrama exacto. Gris: las asíntotas. Cada polo baja la pendiente 20 dB/déc.']],
'Diagrama de Bode asintótico (2)':[['ac_bode_asintotico2.png','El doble integrador da −40 dB/déc y −180°. El polo y el cero cambian la pendiente.']],
'Salida ante una senoide (primer orden)':[['ac_senoide_primer_orden.png','La salida tiene la misma frecuencia que la entrada, pero con 0,133 de amplitud y 86° de retraso.']],
'Ancho de banda y respuestas temporales':[['ac_escalon_rampa.png','Escalón: alcanza el 63 % en τ = 5 s. Rampa: sigue con un retraso de 5 s.']],
'Salida ante una senoide (sistema con integrador)':[['ac_senoide_integrador.png','La amplitud sale casi cero por el integrador. La frecuencia no cambia.']],
'Margen de fase de un tercer orden':[['ac_margen_tercer_orden.png','ω_c = 1,22 da MF = 41,5°. El cruce de −180° está en ω = 2,83 y da MG = 12 dB.']],
'Margen de fase y de ganancia':[['ac_margenes_5.png','Con ω_c = 0,684 el margen de fase es 49,1°. Con ω_180 = 2,45 el margen de ganancia es 18,5 dB.']],
'Efecto de la ganancia en la estabilidad':[['ac_ganancia_estabilidad.png','Con K = 10 el cruce cae antes de −180°: estable. Con K = 100 cae después: inestable.']],
'Diagramas polares básicos':[['ac_polares.png','Izquierda: 1/(1 + jωT) recorre una semicircunferencia. Derecha: e^(−jωT) recorre la circunferencia unidad.']],
'Ej. 1a':[['prac_integrador.png','K solo sube o baja la recta de −20 dB/déc. La fase es −90° con cualquiera de los dos valores.']],
'Ej. 1b':[['prac_primer_orden_T2.png','En ω = 0,5 rad/s el módulo baja 3 dB y la fase vale −45°.']],
'Ej. 3 ·':[['prac_ej3_margenes.png','MF = 28,9° en ω_c = 2,36 rad/s. MG = 8,1 dB en ω_180 = 3,97 rad/s.']],
'Sintonía de Ziegler':[['ex_zn_oscilacion.png','Con K = K_cr = 60 el lazo oscila sin amortiguarse, con periodo 1,89 s.']],
'PI por asignación':[['ex_pi_escalon.png','Con ζ = 0,7 el escalón se pasa un 12,5 %. Hace falta ζ ≈ 1,05 para bajar de 5 %.']],
'Problema completo':[['ex_completo_bode.png','Sin compensar, MF = 9,6°. Con el atraso, MF = 50,8° y MG = 12,6 dB.']],
'Mínimo compensador con ζ':[['ex_minimo_zeta.png','Con K = 0,0438 el cruce baja a 0,168 rad/s y el MF sube de 11,4° a 50°.']],
'Concentración en un reactor':[['ex_reactor_senoide.png','La amplitud de salida es 0,012, menor que 0,05: el proceso ya amortigua la perturbación.']],
'Problema de frecuencia: G(s) = 30/':[['ex_g30_bode.png','El cruce está en ω_c = 5,39 rad/s con MF = 21°.']],
'Adelanto del Ogata 7-26 con colchón de 8°':[['ex_ogata_adelanto.png','El adelanto sube el cruce de 6,17 a 9,15 rad/s y el MF de 18° a 52°.']],
'Senoide con cero y tres polos':[['ac_senoide_cero_tres_polos.png','La salida tiene amplitud 0,0107 veces la entrada y un desfase de −184°.']]
};
function galeria(k){var L=V[k];if(!L)return '';return '<div class="vgal">'+L.map(function(x){return '<figure><img src="assets/visual/'+x[0]+'" alt="'+x[1]+'" loading="lazy"><figcaption>'+x[1]+'</figcaption></figure>'}).join('')+'</div>';}
window.facilHTML=function(e){
  for(var i=0;i<F.length;i++){
    if(e.t.indexOf(F[i][0])===0){
      return '<details class="facil" open><summary>Explicación visual y sencilla · léela antes de la solución</summary><div class="fbody">'+galeria(F[i][0])+F[i][1]+'</div></details>';
    }
  }
  return '';
};
})();
