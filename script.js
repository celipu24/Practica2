var canvas = document.getElementById("lienzo");
var contexto = canvas.getContext("2d");

//VARIABLES GLOBALES
//N es el tamaño del mundo
let N = 40;
//velocidad a la que se actualiza el mundo (en sg)                
let velocidad = 10;  
//CREAMOS EL PROPIO MUNDO      
let mundo = new Mundo(N);  
//cuanto ocupa cada celula=celda
let tamanoCelda = canvas.width / N;

let temporizador;       //para controlar la simulación
let simulando = false; // indica si la simulación está en marcha

//EMPIEZO A PINTAR CÉLULAS
let click = false;
let dibujarEstado = true; // true para dibujar vivas, false para muertas

//PARA DIBUJAR EL MUNDO
//clearRect(x,y,alto,ancho) borra una zona rectangular.
contexto.clearRect(0, 0, canvas.width, canvas.height);
mundo.dibujar(contexto, tamanoCelda);

//JUEGO

// Realiza un paso de la simulación
function pasoSimulacion() {
    mundo.actualizarTablero(); //calcula la siguiente generación
    mundo.dibujar(contexto, tamanoCelda); //dibuja el mundo actualizado
}

//iniciar simulación
// Cuenta cuántas células vivas hay en el mundo
function contarCelulasVivas() {
    let cont = 0;
    for (let f = 0; f < mundo.ancho; f++) {
        for (let c = 0; c < mundo.ancho; c++) {
            if (mundo.getCelula(f, c).estado) cont++;
        }
    }
    return cont;
}

// Crea células aleatorias SOLO si el mundo está vacío
function poblarAleatorio(prob = 0.05) {
    // limpias completamente (creaTablero reinicia celulas y tiempos)
    mundo.crearTablero();

    for (let f = 0; f < mundo.ancho; f++) {
        for (let c = 0; c < mundo.ancho; c++) {
            const viva = Math.random() < prob;
            mundo.getCelula(f, c).setEstado(viva);
        }
    }
    // dibujamos el resultado inicial
    mundo.dibujar(contexto, tamanoCelda);
}




function iniciarSimulacion() {
    // Si no hay ninguna célula viva, inicializamos con aleatorio
    if (mundo.contarCelulasVivas() === 0) {
        console.log("No hay células vivas. No se puede iniciar la simulación.");
        actualizarEstadoBotones();
        return;
    }

    simulando = true;
    temporizador = setInterval(pasoSimulacion, 1000 / velocidad); // velocidad = pasos/segundo
}


function detenerSimulacion() {
    if (!simulando) return; // ya está detenido
    simulando = false;
    clearInterval(temporizador);
    temporizador = null;
}

function reanudarSimulacion() {
    if (simulando) return; // ya está corriendo
    iniciarSimulacion();
}



//-------------------EVENTOS TECLADO--------------------
//detección de varias teclas a la vez
let teclas = [];
window.addEventListener("keydown", manejaTeclado, false);
window.addEventListener("keyup", limpiaTeclado, false);
function manejaTeclado(e) {
    teclas[e.code] = true;
    // Ctrl + Shift + 5
    if (teclas['ControlLeft'] && teclas['ShiftLeft'] && teclas['Digit5']) {
        console.log("Pulsado Ctrl + Shift + 5");
    }
    // Ctrl + f
    if (teclas['ControlLeft'] && teclas['KeyF']) {
        console.log("Pulsado Ctrl + f");
        // cancelar acción por omisión del navegador
        e.preventDefault();
    }
}
function limpiaTeclado(e) {
// pone a false la tecla liberada
teclas[e.code] = false;
}

//-------------------EVENTOS BOTONES--------------------
//añadimos los eventos de botón
document.getElementById("Iniciar").onclick = () => iniciarSimulacion();
document.getElementById("Detener").onclick = () => detenerSimulacion();
document.getElementById("Reanudar").onclick = () => reanudarSimulacion();



//-------------------EVENTOS RATÓN--------------------
canvas.addEventListener("click", function(e) {
    if (simulando) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    tamanoCelda = canvas.width / N;
    const col = Math.floor(x / tamanoCelda);
    const fila = Math.floor(y / tamanoCelda);

    const cel = mundo.getCelula(fila, col);
    cel.setEstado(true);

    mundo.dibujar(contexto, tamanoCelda);
});


// Método para mostrar información de una célula al pasar el mouse sobre ella
const cellInfoPanel = document.getElementById('cellInfoPanel');
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / tamanoCelda);
    const fila = Math.floor(y / tamanoCelda);

    const cel = mundo.getCelula(fila, col);
    if (cel) {
        cellInfoPanel.innerHTML = `Célula (${fila}, ${col}) - Viva: ${cel.estado ? 'Sí' : 'No'} - Tiempo viva: ${cel.time}`;
    }
});


//DIBUJAMOS EL MUNDO INICIAL
mundo.dibujar(contexto, tamanoCelda);
console.log("Juego de la Vida cargado correctamente.");



