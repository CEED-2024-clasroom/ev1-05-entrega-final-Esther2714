import { lengthAndAngle } from "./line_position.js";


function actualizarLinea(linea, inicio, longitud, angulo){
    linea.style.left= `${inicio.x}px`
    linea.style.top= `${inicio.y}px`
    linea.style.width= `${longitud}px`
    linea.style.transform= `rotate(${angulo}deg)`
}

function calcularYActualizarLinea(linea, puntoInicial, puntoFinal) {
    const { length, angle } = lengthAndAngle([puntoInicial.x, puntoInicial.y], [puntoFinal.x, puntoFinal.y]);
    actualizarLinea(linea, puntoInicial, length, angle);
}


function crearLinea(inicio, final){
    const linea = document.createElement('div')
    linea.classList.add('line')

    const {length, angle} = lengthAndAngle([inicio.x, inicio.y],[final.x, final.y])
    actualizarLinea(linea, inicio, length, angle)

    return linea
}

export{ crearLinea, calcularYActualizarLinea }