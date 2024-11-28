import './styles/styles.css'
import './lib/fontawesome.js'
import { Game } from './lib/Game.js'
import {generarGrid} from './lib/grid.js'
import generarLetrasRueda from './lib/generar_rueda.js'
import iniciarEventosLetras from './lib/eventos.js' 
import iniciarAyudas from './lib/ayudas.js'

const game = new Game();
const wordPositions = game.wordPositions;
const letters = game.letters;

const desplazamientoGrid = generarGrid(wordPositions);

generarLetrasRueda(letters);

iniciarEventosLetras (game, desplazamientoGrid)

iniciarAyudas(game, desplazamientoGrid)
