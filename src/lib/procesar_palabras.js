
import { WordNotFound } from './Game.js';
import { transformarCoordenadasGrid } from './grid.js';
const palabrasSeleccionadas = [];
import confetti from 'canvas-confetti';

/**
 * Calcula las coordenadas para cada letra de la palabra. Según si la posición es horizontal o 
 * vertical, avanzaremos en columna o en fila para calcular las coordenadas a partir de la posición
 * inicial de la palabra
 */
function calcularCoordenadasPalabra(palabra, posicion) {

    let avanceColumna = 0;
    let avanceFila = 0;

    if (posicion.direction === 'horizontal') {
        avanceColumna = 1;
    } else if (posicion.direction === 'vertical') {
        avanceFila = 1;
    }

    // Posición inicial
    const [x, y] = posicion.origin;

    // Coordenadas para cada letra
    const coordenadas = [];

    for (let i = 0; i < palabra.length; i++) {
        const nuevaCoordenada = [x + i * avanceColumna, y + i * avanceFila];
        coordenadas.push(nuevaCoordenada);
    }

    return coordenadas;
}

/**
 * Muestra la palabra en el tablero. Primero desplaza las coordenadas originales de las letras para 
 * que estén centradas. Luego compara las coordenadas de las letras con las de los divs. si las 
 * coordenadas coinciden con el gridArea de algun div, inserta la letra en el div
 */
function mostrarPalabra(coordenadas, palabra, desplazamientoGrid) {

    const grid = document.getElementById('grid');
    coordenadas.forEach(([columna, fila], index) => {
        const gridAreaValue = transformarCoordenadasGrid({ columna, fila }, desplazamientoGrid);

        const letraDiv = Array.from(grid.children).find(
            (div) => div.style.gridArea === gridAreaValue
        );

        if (letraDiv) {
            letraDiv.textContent = palabra[index];
        }
    });
}

/**
 * Transforma las letras seleccionadas en un string: palabra.
 * Busca la posición de la palabra en el juego con findWord, y si existe, calcula las 
 * coordenadas necesarias para colocarla en el grid, mediante mostrarPalabra
 */
function procesarPalabra(letrasSeleccionadas, instanciaGame, limitesGrid) {
    const palabra = letrasSeleccionadas.map(letra => letra.textContent).join('');

    try {

        if (palabrasSeleccionadas.includes(palabra)) {  //si no uso esto, la palabra se sobreescribe.No se nota, no sería necesario, pero es para ahorrar recursos
                                                        //No cuenta las palabras que se muestran con las ayudas. 
            return;
        }
        const posicion = instanciaGame.findWord(palabra);

        if (posicion) {
            const coordenadas = calcularCoordenadasPalabra(palabra, posicion);
            mostrarPalabra(coordenadas, palabra, limitesGrid);
            palabrasSeleccionadas.push(palabra);
            const jsConfetti = new confetti();
            jsConfetti.addConfetti();
        }
    } catch (error) {
        if (error instanceof WordNotFound) {
            // console.warn(error.message);
        }
    }
}

export { calcularCoordenadasPalabra, procesarPalabra }