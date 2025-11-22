//Accedemos al motor gráfico ("contexto")
var canvas = document.getElementById("lienzo");
var contexto = canvas.getContext("2d");

//VARIABLES GLOBALES
//N es el tamaño del mundo
let N = 40;
//velocidad a la que se actualiza el mundo (en sg)                
let velocidad = 10;  
//CREAMOS EL PROPIO MUNDO      
let mundo = new Mundo(N);  
//cuanto ocupa cada celda
let tamanoCelda = canvas.width / N;

let temporizador;       //para controlar la simulación
let simulando = false; // indica si la simulación está en marcha

//EMPIEZO A PINTAR CÉLULAS
let click = false;
let dibujarEstado = true; // true para dibujar vivas, false para muertas

//PARA DIBUJAR EL MUNDO
//clearRect(x,y,alto,ancho) borra una zona rectangular.
contexto.clearRect(0, 0, canvas.width, canvas.height);
mundo.getCelula(10, 10).setEstado(true); 
mundo.dibujar(contexto, tamanoCelda);

//JUEGO
function pasoSimulacion() {
    mundo.actualizarTablero();
    dibujarMundo();
}

function iniciarSimulacion() {
    if (simulando) return;
    simulando = true;
    temporizador = setInterval(pasoSimulacion, 1000 / velocidad);
}

function detenerSimulacion() {
    simulando = false;
    clearInterval(temporizador);
}

function reanudarSimulacion() {
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
canvas.addEventListener("mousedown", (e) => {
    ratonPresionado = true;
    modificarCelula(e);
});

canvas.addEventListener("mouseup", () => {
    ratonPresionado = false;
});

canvas.addEventListener("mousemove", (e) => {
    mostrarInfoCelula(e);
    if (ratonPresionado) modificarCelula(e);
});

dibujarMundo();
console.log("Juego de la Vida cargado correctamente.");