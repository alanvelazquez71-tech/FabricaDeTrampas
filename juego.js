/* Juego 2: el detector propone dos resultados para simplificar una fracción
   algebraica; el jugador elige uno con LEFT o RIGHT. */

const banco = REACTIVOS;          // definido en reactivos.js
const VIDAS_INICIALES = 3;
const PAUSA_ACIERTO = 4500;       // ms que se ve la solución antes de seguir
const PAUSA_ERROR = 7000;         // más tiempo para leer la factorización
const PAUSA_RESOLVIENDO = 900;    // ms con el aviso "Resolviendo..." antes de mostrar el desarrollo

const IMG = {
    izq: { normal: 'LEFT', verde: 'LEFT VERDE', rojo: 'LEFT ROJO' },
    der: { normal: 'RIGHT', verde: 'RIGHT VERDE', rojo: 'RIGHT ROJO' }
};

let partida = [];           // reactivos elegidos para esta partida
let indice = 0;
let vidas = VIDAS_INICIALES;
let ladoCorrecto = 'izq';
let opcionesActuales = {};  // { izq: tex, der: tex }
let respondido = true;      // bloquea los botones hasta que haya pregunta
let historial = [];         // { reactivo, acerto, eligio }
let timersSolucion = [];    // temporizadores de la solución en curso

const pantalla = document.getElementById('pantalla');
const propuesta = document.getElementById('propuesta');
const textoPregunta = document.getElementById('textoPregunta');
const progreso = document.getElementById('progreso');
const botones = {
    izq: document.getElementById('btnIzq'),
    der: document.getElementById('btnDer')
};
const opciones = {
    izq: document.getElementById('opcionIzq'),
    der: document.getElementById('opcionDer')
};
const resultados = document.querySelectorAll('.resultado');
const modalAyuda = document.getElementById('modalAyuda');

document.getElementById('modalResultado').textContent = banco.resultadoAprendizaje;
document.getElementById('temaJuego').textContent = banco.tema;
document.querySelectorAll('#modalAyuda .tex').forEach(el => renderMath(el, el.textContent));
bloquearBotones(true);

/* ---------- Inicio ---------- */

document.getElementById('btnComenzar').addEventListener('click', () => {
    document.getElementById('modalInicio').hidden = true;
    iniciarPartida();
});

// Fisher-Yates: devuelve una copia revuelta
function revolver(arreglo) {
    const copia = [...arreglo];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function iniciarPartida() {
    partida = revolver(banco.reactivos).slice(0, banco.reactivosPorPartida);
    indice = 0;
    historial = [];
    cargarPregunta();
}

function cargarPregunta() {
    const r = partida[indice];

    limpiarSolucion();
    renderTextoConMath(textoPregunta, r.pregunta);
    progreso.textContent = `${indice + 1} / ${partida.length}`;

    // La correcta cae al azar a la izquierda o a la derecha
    ladoCorrecto = Math.random() < 0.5 ? 'izq' : 'der';
    const ladoDistractor = ladoCorrecto === 'izq' ? 'der' : 'izq';
    opcionesActuales = { [ladoCorrecto]: r.correcta, [ladoDistractor]: r.distractor };

    ['izq', 'der'].forEach(lado => {
        opciones[lado].classList.remove('es-correcta', 'es-incorrecta');
        renderMath(opciones[lado], opcionesActuales[lado]);
        ponerImagenBoton(lado, 'normal');
    });

    resultados.forEach(img => img.classList.remove('mostrar'));
    pantalla.classList.remove('oculto');
    propuesta.classList.remove('oculto');
    bloquearBotones(false);
    respondido = false;
}

/* ---------- Respuesta ---------- */

Object.entries(botones).forEach(([lado, boton]) => {
    boton.addEventListener('click', () => responder(lado));
});

document.addEventListener('keydown', e => {
    if (hayModalAbierto()) return;
    if (e.key === 'ArrowLeft') responder('izq');
    if (e.key === 'ArrowRight') responder('der');
});

function responder(lado) {
    if (respondido) return;
    respondido = true;
    bloquearBotones(true);

    const r = partida[indice];
    const acerto = lado === ladoCorrecto;
    const otro = lado === 'izq' ? 'der' : 'izq';

    historial.push({ reactivo: r, acerto, eligio: opcionesActuales[lado] });

    // Botones y propuestas: la correcta siempre queda en verde
    if (acerto) {
        ponerImagenBoton(lado, 'verde');
        opciones[lado].classList.add('es-correcta');
    } else {
        ponerImagenBoton(lado, 'rojo');
        ponerImagenBoton(otro, 'verde');
        opciones[lado].classList.add('es-incorrecta');
        opciones[otro].classList.add('es-correcta');
    }

    // Letrero: CORRECTO o BIEN al azar; si se equivoca, TRAMPA o ERROR según el distractor
    let letrero;
    if (acerto) letrero = Math.random() < 0.5 ? 'resCorrecto' : 'resBien';
    else letrero = r.trampa ? 'resTrampa' : 'resError';
    document.getElementById(letrero).classList.add('mostrar');

    // La pantalla muestra la factorización
    if (acerto) {
        mostrarSolucion(r.explicacion, PAUSA_ACIERTO, siguiente);
    } else {
        perderVida();
        mostrarSolucion(r.explicacion, PAUSA_ERROR, () => (vidas > 0 ? siguiente() : juegoTerminado(false)));
    }
}

/* ---------- Solución en pantalla ---------- */

// Primero avisa "Resolviendo...", luego destaca el desarrollo con una etiqueta
// y una barra que se vacía para que se note cuánto tiempo queda para leerlo.
function mostrarSolucion(explicacion, duracion, alTerminar) {
    limpiarSolucion();
    textoPregunta.innerHTML = '';
    textoPregunta.classList.add('modo-solucion');

    const etiqueta = document.createElement('div');
    etiqueta.className = 'etiqueta-solucion';
    etiqueta.textContent = 'Resolviendo';

    const cuerpo = document.createElement('div');
    cuerpo.className = 'solucion-cuerpo';
    renderTextoConMath(cuerpo, explicacion);

    const barra = document.createElement('div');
    barra.className = 'solucion-barra';
    const relleno = document.createElement('span');
    relleno.style.animationDuration = `${duracion - PAUSA_RESOLVIENDO}ms`;
    barra.appendChild(relleno);

    textoPregunta.append(etiqueta, cuerpo, barra);

    timersSolucion.push(setTimeout(() => {
        etiqueta.textContent = 'Solución';
        etiqueta.classList.add('lista');
        cuerpo.classList.add('visible');
        barra.classList.add('corriendo');
    }, PAUSA_RESOLVIENDO));

    timersSolucion.push(setTimeout(() => {
        limpiarSolucion();
        alTerminar();
    }, duracion));
}

function limpiarSolucion() {
    timersSolucion.forEach(clearTimeout);
    timersSolucion = [];
    textoPregunta.classList.remove('modo-solucion');
}

function siguiente() {
    indice++;
    if (indice < partida.length) {
        cargarPregunta();
    } else {
        juegoTerminado(true);
    }
}

function perderVida() {
    const restantes = document.querySelectorAll('#vidas .vida:not(.perdida)');
    const corazon = restantes[restantes.length - 1];
    vidas--;
    if (!corazon) return;

    corazon.classList.add('parpadeando');
    setTimeout(() => {
        corazon.classList.remove('parpadeando');
        corazon.classList.add('perdida');
    }, 1000); // dura lo mismo que el parpadeo (0.5s x 2)
}

function juegoTerminado(gano) {
    resultados.forEach(img => img.classList.remove('mostrar'));
    propuesta.classList.add('oculto');
    bloquearBotones(true);
    limpiarSolucion();
    textoPregunta.textContent = gano ? '¡Detector superado!' : 'Sin vidas';
    setTimeout(() => mostrarRetro(gano), 900);
}

/* ---------- Utilidades ---------- */

function ponerImagenBoton(lado, estado) {
    botones[lado].querySelector('img').src = `./public/decision/${IMG[lado][estado]}.png`;
}

function bloquearBotones(bloquear) {
    Object.values(botones).forEach(b => b.disabled = bloquear);
}

function hayModalAbierto() {
    return [...document.querySelectorAll('.modal')].some(m => !m.hidden);
}

/* ---------- Render de matemáticas (KaTeX) ---------- */

function renderMath(elemento, tex) {
    if (window.katex) {
        katex.render(tex, elemento, { throwOnError: false });
    } else {
        elemento.textContent = texPlano(tex);
    }
}

// Respaldo si KaTeX no cargó: convierte el TeX a texto legible, p. ej. (x - 2)/(x + 2)
function texPlano(tex) {
    let s = tex;
    let antes;
    do {
        antes = s;
        s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)');
    } while (s !== antes);
    return s
        .replace(/\^\{2\}/g, '²').replace(/\^\{3\}/g, '³')
        .replace(/\^\{([^{}]*)\}/g, '^$1')
        .replace(/\\neq/g, '≠').replace(/\\pm/g, '±').replace(/\\cdot/g, '·')
        .replace(/\\,/g, ' ').replace(/[{}]/g, '');
}

// Texto con fragmentos $...$ en modo matemático
function renderTextoConMath(elemento, texto) {
    elemento.innerHTML = '';
    const linea = document.createElement('span');
    texto.split('$').forEach((parte, i) => {
        const span = document.createElement('span');
        if (i % 2 === 1) renderMath(span, parte);
        else span.textContent = parte;
        linea.appendChild(span);
    });
    elemento.appendChild(linea);
}

/* ---------- Ayuda, instrucciones y créditos ---------- */

document.getElementById('btnAyuda').addEventListener('click', () => modalAyuda.hidden = false);
document.getElementById('cerrarAyuda').addEventListener('click', () => modalAyuda.hidden = true);
modalAyuda.addEventListener('click', e => {
    if (e.target === modalAyuda) modalAyuda.hidden = true;
});

document.querySelectorAll('[data-abrir]').forEach(boton => {
    boton.addEventListener('click', () => {
        document.getElementById(boton.dataset.abrir).hidden = false;
    });
});

document.querySelectorAll('.modal-info').forEach(modal => {
    modal.querySelector('.modal-cerrar').addEventListener('click', () => modal.hidden = true);
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.hidden = true;
    });
});

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    modalAyuda.hidden = true;
    document.querySelectorAll('.modal-info').forEach(m => m.hidden = true);
});

/* ---------- Retroalimentación final ---------- */

// Los fragmentos entre $...$ se dibujan con KaTeX
const CONSEJOS = {
    'factor común': 'Busca lo que se repite en todos los términos y sácalo: $3x^{2}+6x = 3x(x+2)$.',
    'diferencia de cuadrados': 'Una resta de dos cuadrados se factoriza como binomios conjugados: $a^{2}-b^{2} = (a+b)(a-b)$.',
    'trinomio cuadrado perfecto': 'Si el primer y el último término son cuadrados y el de en medio es el doble de sus raíces: $a^{2} \\pm 2ab + b^{2} = (a \\pm b)^{2}$.',
    'trinomio de la forma x²+bx+c': 'Busca dos números que multiplicados den $c$ y sumados den $b$: $x^{2}+5x+6 = (x+2)(x+3)$.',
    'factorización combinada': 'Factoriza por completo numerador y denominador (primero el factor común) y solo después cancela los factores iguales: $\\dfrac{2x^{2}-8}{x-2} = \\dfrac{2(x+2)(x-2)}{x-2}$.'
};

function mostrarRetro(gano) {
    const total = historial.length;
    const aciertos = historial.filter(h => h.acerto).length;
    const trampas = historial.filter(h => !h.acerto && h.reactivo.trampa).length;
    const porcentaje = total ? Math.round((aciertos / total) * 100) : 0;

    const porTema = {};
    historial.forEach(h => {
        const t = h.reactivo.tema;
        porTema[t] ??= { total: 0, bien: 0 };
        porTema[t].total++;
        if (h.acerto) porTema[t].bien++;
    });

    let mensaje;
    if (porcentaje >= 90) mensaje = '¡Excelente! Ninguna trampa te engaña.';
    else if (porcentaje >= 70) mensaje = '¡Muy bien! Solo repasa los casos donde fallaste.';
    else if (porcentaje >= 50) mensaje = 'Vas por buen camino, pero conviene repasar la factorización.';
    else mensaje = 'Te recomendamos revisar la ayuda antes de volver a intentarlo.';

    const cont = document.getElementById('retroContenido');
    cont.innerHTML = '';

    const titulo = document.createElement('h2');
    titulo.textContent = gano ? '¡Partida completada!' : 'Juego terminado';
    cont.appendChild(titulo);

    const resumen = document.createElement('p');
    resumen.innerHTML = `Acertaste <strong>${aciertos} de ${total}</strong> ejercicios (${porcentaje}%).` +
        (trampas ? ` Caíste en <strong>${trampas}</strong> trampa${trampas > 1 ? 's' : ''} absurda${trampas > 1 ? 's' : ''}.` : '');
    cont.appendChild(resumen);

    const pMensaje = document.createElement('p');
    pMensaje.className = 'retro-mensaje';
    pMensaje.textContent = mensaje;
    cont.appendChild(pMensaje);

    // Tabla por caso de factorización
    const tabla = document.createElement('table');
    tabla.className = 'retro-tabla';
    tabla.innerHTML = '<tr><th>Caso</th><th>Aciertos</th></tr>';
    Object.entries(porTema).forEach(([t, v]) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${t[0].toUpperCase() + t.slice(1)}</td><td>${v.bien} / ${v.total}</td>`;
        if (v.bien < v.total) fila.className = 'retro-debil';
        tabla.appendChild(fila);
    });
    cont.appendChild(tabla);

    // Consejos para los casos con errores
    const debiles = Object.keys(porTema).filter(t => porTema[t].bien < porTema[t].total && CONSEJOS[t]);
    if (debiles.length) {
        const h3 = document.createElement('h3');
        h3.textContent = 'Para repasar';
        cont.appendChild(h3);
        const ul = document.createElement('ul');
        debiles.forEach(t => {
            const li = document.createElement('li');
            renderTextoConMath(li, CONSEJOS[t]);
            ul.appendChild(li);
        });
        cont.appendChild(ul);
    }

    // Ejercicios donde se equivocó
    const fallidas = historial.filter(h => !h.acerto);
    if (fallidas.length) {
        const h3 = document.createElement('h3');
        h3.textContent = 'Ejercicios en los que te equivocaste';
        cont.appendChild(h3);
        const ul = document.createElement('ul');
        ul.className = 'retro-fallidas';
        fallidas.forEach(h => {
            const li = document.createElement('li');

            const pregunta = document.createElement('div');
            renderTextoConMath(pregunta, h.reactivo.pregunta);
            if (h.reactivo.trampa) {
                const etiqueta = document.createElement('span');
                etiqueta.className = 'etiqueta-trampa';
                etiqueta.textContent = 'Trampa';
                pregunta.appendChild(etiqueta);
            }
            li.appendChild(pregunta);

            const detalle = document.createElement('div');
            detalle.className = 'retro-detalle';
            detalle.append('Elegiste: ');
            const eligio = document.createElement('span');
            renderMath(eligio, h.eligio);
            detalle.append(eligio, ' · Correcta: ');
            const correcta = document.createElement('strong');
            renderMath(correcta, h.reactivo.correcta);
            detalle.append(correcta);
            li.appendChild(detalle);

            const explicacion = document.createElement('div');
            explicacion.className = 'retro-detalle';
            renderTextoConMath(explicacion, h.reactivo.explicacion);
            li.appendChild(explicacion);

            ul.appendChild(li);
        });
        cont.appendChild(ul);
    }

    const boton = document.createElement('button');
    boton.className = 'retro-boton';
    boton.textContent = 'Jugar de nuevo';
    boton.addEventListener('click', () => location.reload());
    cont.appendChild(boton);

    document.getElementById('modalRetro').hidden = false;
}

/* ---------- Regresar al menú principal ---------- */

document.getElementById('btnRegresar').addEventListener('click', () => {
    const enPartida = document.getElementById('modalInicio').hidden;
    if (enPartida && !confirm('¿Regresar al menú principal? Se perderá el avance de esta partida.')) return;
    location.reload(); // vuelve a la pantalla inicial con todo reiniciado
});

/* ---------- Música de fondo (melodía original, ver musica.js) ---------- */

crearMusica({
    tempo: 116,
    ondaMelodia: 'square',
    filtro: 2000,
    platillo: 'todos',
    melodia: [
        // A: arpegio "electrónico"  Am - F - C - G
        'A4', 'C5', 'E5', 'A5', 'E5', 'C5', 'B4', 'C5',
        'A4', 'C5', 'F5', 'A5', 'F5', 'C5', 'A4', 'C5',
        'G4', 'C5', 'E5', 'G5', 'E5', 'C5', 'G4', 'C5',
        'G4', 'B4', 'D5', 'G5', 'F5', 'D5', 'B4', 'D5',
        // B: melodía de suspenso
        'E5', '-', '-', 'A5', '-', 'G5', 'E5', '-',
        'F5', '-', '-', 'C6', '-', 'A5', 'F5', '-',
        'E5', '-', 'G5', '-', 'C6', '-', 'B5', 'G5',
        'D5', '-', 'B4', '-', 'G5', '-', 'F5', 'D5'
    ],
    bajo: bajoSaltarin(['A2', 'F2', 'C3', 'G2', 'A2', 'F2', 'C3', 'G2'])
}).conectarBoton(document.getElementById('btnMusica'));
