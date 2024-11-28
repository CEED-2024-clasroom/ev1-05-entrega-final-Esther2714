import calculateLetterPositions from './letter_positions'

function crearDivLetra(letra, posicion) {
    const divLetra = document.createElement('div');
    divLetra.classList.add('wheel-letter');
    divLetra.textContent = letra;
    divLetra.style.left = posicion.left;
    divLetra.style.top = posicion.top;
    return divLetra;
}

function generarLetrasRueda(letras){
    const rueda=document.getElementById('wheel')
    const posiciones= calculateLetterPositions(letras.length);
    rueda.innerHTML='';
    
    let index = 0;
    for (const letra of letras) {
        const divLetra = crearDivLetra(letra, posiciones[index]);
        rueda.appendChild(divLetra);
        index++;
    }
}

export default generarLetrasRueda