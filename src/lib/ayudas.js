let instanciaGame = null;
let desplazamientoTablero = null;
let finalizarMartillo;

function calcularPosicionesOriginales(div, desplazamientoGrid) {
    const [despX, despY] = desplazamientoGrid;
    const [fila, columna] = div.style.gridArea.split(' / ').map(num => parseInt(num) - 1);
    return {
        filaOriginal: fila - despY,
        columnaOriginal: columna - despX,
    };
}

function obtenerLetraCorrecta(div, desplazamientoTablero) {
    const { filaOriginal, columnaOriginal } = calcularPosicionesOriginales(div, desplazamientoTablero);
    return instanciaGame.letterAt(columnaOriginal, filaOriginal);
}

function cambiarEstadoFondo() {
    const fondoNegro = document.getElementById('black');

    if (fondoNegro.classList.contains('hidden')) {
        fondoNegro.classList.remove('hidden');

    } else {
        fondoNegro.classList.add('hidden');

    }
}

function cambiarClaseLetras() {
    const letras = document.getElementsByClassName('letter');

    Array.from(letras).forEach(letra => {
        if (letra.classList.contains('on-top')) {
            letra.classList.remove('on-top');
        } else {
            letra.classList.add('on-top');
        }
    });

}

function manejarClic(event) {
    const letraDiv = event.target;

    if (!event.target.classList.contains('letter')) {
        finalizarMartillo();
    } else {
        if (letraDiv.textContent.trim() === '') {
            const letraCorrecta = obtenerLetraCorrecta(letraDiv, desplazamientoTablero);

            if (letraCorrecta) {
                letraDiv.textContent = letraCorrecta;
                finalizarMartillo();
            }
        }
    }

}

//Está como variable por dependencias circulares
finalizarMartillo = function () {
    cambiarEstadoFondo();
    cambiarClaseLetras();

    document.removeEventListener('click', manejarClic);

}

function activarMartillo(event) {
    event.stopImmediatePropagation(); //para que no se active manejarClicGlobal
    cambiarEstadoFondo();
    cambiarClaseLetras();

    document.addEventListener('click', manejarClic);

}

/**
 * Revela una 'cantidad' de letras al azar en el tablero. 
 * Selecciona los divs vacíos, los baraja aleatoriamente y selecciona la cantidad a revelar
 * Inserta en cada uno de los divs seleccionados la letra correspondiente
 */
function revelarLetras(cantidad) {

    const grid = document.getElementById('grid');

    const letrasVacias = Array.from(grid.children).filter(div => div.textContent.trim() === '');

    if (letrasVacias.length === 0) {
        return;
    }

    //por si no hay tantas letras para revelar
    const cantidadARevelar = Math.min(cantidad, letrasVacias.length);

    const letrasARevelar = letrasVacias
        .sort(() => Math.random() - 0.5)
        .slice(0, cantidadARevelar);

    letrasARevelar.forEach(div => {

        const letraCorrecta = obtenerLetraCorrecta(div, desplazamientoTablero);
        if (letraCorrecta) div.textContent = letraCorrecta;
    });
}



/**
 * Mezcla las letras de la rueda cambiando sus posiciones. 
 * Extrae las posiciones originales (left y top) de cada letra y crea un array
 * Baraja las posiciones aleatoriamente y las reasigna  left y top
 * las clases css hacen las transiciones
 **/
function mezclarLetras() {
    const letras = Array.from(document.querySelectorAll('.wheel-letter'));
    const posicionesOriginales = letras.map(letra => ({
        left: letra.style.left,
        top: letra.style.top,
    }));

    const posicionesMezcladas = posicionesOriginales.sort(() => Math.random() - 0.5);

    letras.forEach((letra, index) => {
        letra.style.left = posicionesMezcladas[index].left;
        letra.style.top = posicionesMezcladas[index].top;
    });

}


/**
 * Inicializa los eventos para los botones de las ayudas
 */
function iniciarAyudas(game, desplazamientoGrid) {
    instanciaGame = game
    desplazamientoTablero = desplazamientoGrid
    const botonMezcla = document.getElementById('mezcla');
    const botonBombilla = document.getElementById('bombilla');
    const botonDiana = document.getElementById('diana');
    const botonMartillo = document.getElementById('martillo');

    botonMezcla.addEventListener('click', mezclarLetras);
    botonBombilla.addEventListener('click', () => revelarLetras(1));
    botonDiana.addEventListener('click', () => revelarLetras(5));
    botonMartillo.addEventListener('click', activarMartillo);
}


export default iniciarAyudas;
