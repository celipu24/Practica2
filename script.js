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
    if (simulando) return;                     // ya está corriendo

    // Si no hay ninguna célula viva, inicializamos con aleatorio
    if (contarCelulasVivas() === 0) {
        // Puedes cambiar la probabilidad aquí (ej: 0.15 = 15% de celdas vivas)
        poblarAleatorio(0.05);
        mundo.dibujar(contexto, tamanoCelda);
    }

    simulando = true;
    temporizador = setInterval(pasoSimulacion, 1000 / velocidad); // velocidad = pasos/segundo
}


function detenerSimulacion() {
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
//DIBUJAMOS EL MUNDO INICIAL





mundo.dibujar(contexto, tamanoCelda);
console.log("Juego de la Vida cargado correctamente.");