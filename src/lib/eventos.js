import { crearLinea, calcularYActualizarLinea } from './linea.js';
import { getElementCenter } from "./line_position.js";
import { procesarPalabra } from './procesar_palabras.js'; 

let letrasSeleccionadas = [];
let lineaActual = null;
let instanciaGame = null;
let limitesGrid = null;


/**
 * Añade una letra a letrasSeleccionadas si aún no está en el array
 */
function agregarLetraSeleccionada(letra) {

    if (!letrasSeleccionadas.includes(letra)) {
        letrasSeleccionadas.push(letra); // Almacena el nodo HTML, no la letra como tal
        letra.classList.add('selected');
    }
}

/**
 * Limpia las clases de las letras seleccionadas y resetea el array
 */
function limpiarLetrasSeleccionadas() {

    letrasSeleccionadas.forEach((letra) => letra.classList.remove('selected'));
    letrasSeleccionadas = [];
}

/**
 * Limpia todas las líneas creadas en el DOM
 */
function limpiarLineas() {

    const lineas = document.querySelectorAll('.line');
    lineas.forEach((linea) => linea.remove());
    lineaActual = null;
}


/**
 * Detecta el nodo HTML debajo del puntero. Añade la letra a letrasseleccionadas si aún no está,  
 * llama a las funciones para actualizar las lineas
 */
function manejarNuevaLetra(event, ultimaLetra) {
    const nuevaLetra = document.elementFromPoint(event.clientX, event.clientY);  //detecto el nodo HTML debajo del puntero

    if (nuevaLetra && nuevaLetra.classList.contains('wheel-letter') && !letrasSeleccionadas.includes(nuevaLetra)) {
        agregarLetraSeleccionada(nuevaLetra);

        const centroNuevaLetra = getElementCenter(nuevaLetra);

        calcularYActualizarLinea(lineaActual, getElementCenter(ultimaLetra), centroNuevaLetra);

        return crearLinea(centroNuevaLetra, { x: centroNuevaLetra.x, y: centroNuevaLetra.y });
    }

    return null;
}

/**
 * Maneja el evento mousemove mientras el usuario selecciona letras,
 * creando líneas visuales y seleccionando nuevas letras si el ratón pasa por ellas
 */
function onMouseMove(event) {
    if (!lineaActual) return; // No hace nada si no hay una línea activa

    const ultimaLetra = letrasSeleccionadas[letrasSeleccionadas.length - 1];
    const centroUltimaLetra = getElementCenter(ultimaLetra);

    calcularYActualizarLinea(lineaActual, centroUltimaLetra, { x: event.pageX, y: event.pageY });

    const nuevaLinea = manejarNuevaLetra(event, ultimaLetra); 
    if (nuevaLinea) {
        lineaActual = nuevaLinea;
        document.body.appendChild(lineaActual);
    }
}

/**
 * Cuando se suelta el ratón, procesa la palabra seleccionada, limpia las letras 
 * seleccionadas, las líneas y los listeners
 */
function onMouseUp() {

    procesarPalabra(letrasSeleccionadas, instanciaGame, limitesGrid); 
    limpiarLetrasSeleccionadas();
    limpiarLineas();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

/**
 * Inicia la selección de letras y creación de líneas al hacer clic en una letra
 * de la rueda
 */
function onMouseDown(event) {

    const letra = event.target;
    agregarLetraSeleccionada(letra);

    const centro = getElementCenter(letra);
    lineaActual = crearLinea(centro, { x: event.clientX, y: event.clientY });
    document.body.appendChild(lineaActual);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

/**
 * Asocia eventos a todas las letras para la interacción con el usuario
 */
function iniciarEventosLetras(game, dimensionesGrid) {
    instanciaGame = game;
    limitesGrid = dimensionesGrid;

    const letras = document.querySelectorAll('.wheel-letter');
    letras.forEach((letra) => letra.addEventListener('mousedown', onMouseDown));
}

export default iniciarEventosLetras;

