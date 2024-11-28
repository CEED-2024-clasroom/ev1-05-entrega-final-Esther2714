import center from './center'

const TAMANYO_GRID = { width: 10, height: 10 };

/**
 * Dadas las coordenadas originales y el desplazamiento en el grid, 
 * devuelve una cadena para definir el gridArea css
 */
function transformarCoordenadasGrid(coordenadasOriginales, desplazamientoGrid) {
    const [despX, despY] = desplazamientoGrid;

    const columnaDesplazada = coordenadasOriginales.columna + despX + 1;
    const filaDesplazada = coordenadasOriginales.fila + despY + 1;

    return `${filaDesplazada} / ${columnaDesplazada}`;
}

/**
 * Calcula la posición final de una palabra en el grid, en funcion de su origen, dirección y longitud. 
 * @returns  objeto con la columna y la fila final 
 */
function calcularFinales(origen, direccion, length) {
    const columnaFinal = origen[0] + (direccion === 'horizontal' ? length - 1 : 0)
    const filaFinal = origen[1] + (direccion === 'vertical' ? length - 1 : 0)
    return { columnaFinal, filaFinal }
}

/**
 * Calcula el desplazamiento necesario para centrar el grid
 * Calcula las posiciones maximas de las palabras con calcularFinales y se las pasa a 
 * la funcion center, junto con las dimensiones del grid, para calcular el desplazamiento
 */
function centrarGrid(wordPositions) {

    const { width: gridWidth, height: gridHeight } = TAMANYO_GRID;

    let maxColumna = 0;
    let maxFila = 0;

    wordPositions.forEach(({ origin, direction, length }) => {
        const { columnaFinal, filaFinal } = calcularFinales(origin, direction, length);
        maxColumna = Math.max(maxColumna, columnaFinal);
        maxFila = Math.max(maxFila, filaFinal);
    });

    return center(maxColumna, maxFila, gridWidth, gridHeight);

}

/**
 * Crea una casilla (div) en el tablero si no existe una antes en esa posición
 * Evita los problemas de las intersecciones en el tablero
 */
function crearDiv(contenedorGrid, gridArea) {

    const existe = Array.from(contenedorGrid.children).some(
        div => div.style.gridArea == gridArea
    )

    if (!existe) {

        const divLetra = document.createElement('div')
        divLetra.classList.add('letter')
        divLetra.style.gridArea = gridArea
        contenedorGrid.appendChild(divLetra)
    }

}

/**
 *  Vacía el grid y luego calcula el desplazamiento necesario para centrar las palabras. 
 * Itera sobre cada palabra y su longitud para crear un <div> para cada letra 
 * Ajusta las posiciones de cada letra aplicando el desplazamiento (despX, despY)
 * Configura las propiedades de gridRowStart y gridColumnStart para colocar cada letra en la posición correcta del grid
 * @returns [despX, despY]
 */
function generarGrid(wordPositions) {

    const contenedorGrid = document.getElementById('grid');
    contenedorGrid.innerHTML = '';

    const desplazamientoGrid = centrarGrid(wordPositions);

    wordPositions.forEach(({ origin, direction, length }) => {
        const [origenX, origenY] = origin;

        for (let j = 0; j < length; j++) {
            const coordenadas = {
                columna: origenX + (direction === 'horizontal' ? j : 0),
                fila: origenY + (direction === 'vertical' ? j : 0),
            };

            const gridAreaValue = transformarCoordenadasGrid(coordenadas, desplazamientoGrid);
            crearDiv(contenedorGrid, gridAreaValue);
        }
    });

    return desplazamientoGrid;

}

export { transformarCoordenadasGrid, generarGrid };
