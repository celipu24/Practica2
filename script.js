var canvas = document.getElementById("lienzo");
var contexto = canvas.getContext("2d");
let paso=0;
const pasoPanel = document.getElementById("pasoPanel");
//constantes para el cambio del tamaño de mundo
const inputN = document.getElementById("inputN");
const btnCambiarN = document.getElementById("btnCambiarN");


//VARIABLES GLOBALES
//N es el tamaño del mundo
let N = 40;

//cuanto ocupa cada celula=celda
let tamanoCelda = 15;

//tamaño del canvas para que al aumentar el tamaño de las celdas, este no cambie
canvas.width = N*tamanoCelda;
canvas.height = N*tamanoCelda;

//N maxima y minima para elegir al cambiar el tamaño
const N_MIN = 5;
const N_MAX = 100;


//variables para cuando el canvas no es divisible entre N
let offsetX = 0;
let offsetY = 0;

// ------------------- DIBUJO DE LA CUADRÍCULA --------------------
function dibujarCuadricula() {
    // color rosa sutil para las líneas de la cuadricula
    contexto.save();
    contexto.strokeStyle = 'rgba(244,114,182,0.12)'; // rosa suave
    contexto.lineWidth = 1;

    // rectángulo del tablero (área usada por las N celdas)
    const startX = offsetX;
    const startY = offsetY;
    const boardSize = tamanoCelda * N;

    // dibujar verticales
    for (let i = 0; i <= N; i++) {
        const x = Math.round(startX + i * tamanoCelda) + 0.5; // +0.5 para líneas nítidas
        contexto.beginPath();
        contexto.moveTo(x, startY);
        contexto.lineTo(x, startY + boardSize);
        contexto.stroke();
    }

    // dibujar horizontales
    for (let j = 0; j <= N; j++) {
        const y = Math.round(startY + j * tamanoCelda) + 0.5;
        contexto.beginPath();
        contexto.moveTo(startX, y);
        contexto.lineTo(startX + boardSize, y);
        contexto.stroke();
    }

    contexto.restore();
}


//CREAMOS EL PROPIO MUNDO      
let mundo = new Mundo(N); 

//velocidad a la que se actualiza el mundo (en sg)                
var velocidad = 10;  
var temporizador;       //para controlar la simulación
let simulando = false; // indica si la simulación está en marcha

//VARIABLE PARA GUARDAR EL PATRÓN SELECCIONADO
let patronSeleccionado = null;

//EMPIEZO A PINTAR CÉLULAS
let click = false;
let dibujarEstado = true; // true para dibujar vivas, false para muertas

//PARA DIBUJAR EL MUNDO
//clearRect(x,y,alto,ancho) borra una zona rectangular.
contexto.clearRect(0, 0, canvas.width, canvas.height);
mundo.dibujar(contexto, tamanoCelda, offsetX, offsetY);
dibujarCuadricula();


//JUEGO

// Realiza un paso de la simulación
function pasoSimulacion() {
    mundo.actualizarTablero(); //calcula la siguiente generación
    mundo.dibujar(contexto, tamanoCelda, offsetX, offsetY);
    dibujarCuadricula();
    paso++;
    pasoPanel.textContent = "Simulación en marcha: Paso " + paso;
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
    mundo.dibujar(contexto, tamanoCelda, offsetX, offsetY);
    dibujarCuadricula();

}


// Actualiza el estado habilitado/deshabilitado de los botones
function actualizarEstadoBotones() {
    const bStart = document.getElementById("Iniciar");
    const bStop  = document.getElementById("Detener");
    const bRean  = document.getElementById("Reanudar");
    if (bStart) bStart.disabled = simulando;
    if (bStop)  bStop.disabled  = !simulando;
    if (bRean)  bRean.disabled  = simulando; // opcional: reanudar no tiene sentido si ya corre
}


function iniciarSimulacion() {
    // Evita crear múltiples timers si ya está corriendo
    if (simulando) return;

    // Si no hay ninguna célula viva, evita iniciar (tu comportamiento actual)
    if (contarCelulasVivas() === 0) {
        console.log("No hay células vivas. No se puede iniciar la simulación.");
        actualizarEstadoBotones();
        return;
    }
    //reiniciar el contador de pasos al pulsar iniciar
    paso = 0; 
    pasoPanel.textContent = "Simulación en marcha: Paso 0";

    simulando = true;
    // actualizar botones inmediatamente
    actualizarEstadoBotones();

    // guarda el id del intervalo en temporizador (hay solo uno gracias al guard)
    temporizador = setInterval(pasoSimulacion, 1000 / velocidad); // velocidad = pasos/segundo
}


function detenerSimulacion() {
    if (!simulando) return; // ya está detenido

    simulando = false;

    if (temporizador !== null) {
        clearInterval(temporizador);
        temporizador = null;
    }

    // actualizar botones
    actualizarEstadoBotones();
}

function reanudarSimulacion() {
    if (simulando) return;
    simulando = true;
    // actualizar botones
    actualizarEstadoBotones();
    temporizador = setInterval(pasoSimulacion, 1000 / velocidad);
}

/*Definimos los patrones(figuras) para que luego al llamar su identificador usemos esta función
y solo tengamos que declarar en que coordenadas se colocan las vecinas*/
function ponerPatron(patron, fila, col) {
    for (let [df, dc] of patron) {
        let f = fila + df;
        let c = col + dc;
        let cel = mundo.getCelula(f, c);
        cel.setEstado(true);
    }
    mundo.dibujar(contexto, tamanoCelda, offsetX, offsetY);
    dibujarCuadricula();
    recalcularOffset();
    }

/*éste método sirve para que al cambiar la N se recalcule el tamaño de las celdas
y por ende calcule de nuevo el tamaño del tablero*/
btnCambiarN.addEventListener("click", () => {
    //parseInt (función predefinida de js) hace que un String se convierta en int 
    //.value te devuelve el valor de input
    let nuevoN = parseInt(inputN.value);  
    //añadimos un maximo y un minimo para que visualmente no se recorte y sea visible el mundo     
    if (nuevoN < N_MIN) nuevoN = N_MIN;   
    if (nuevoN > N_MAX) nuevoN = N_MAX; 
    N = nuevoN;

    tamanoCelda = 15;   
    canvas.width = N * tamanoCelda;
    canvas.height = N * tamanoCelda;

    mundo.ancho = N;
    mundo.alto = N;
    mundo.crearTablero(); // Mantiene las celdas viejas y añade las nuevas

    recalcularOffset();
    mundo.dibujar(contexto, tamanoCelda, offsetX, offsetY);
    dibujarCuadricula();

});


function recalcularOffset() {
    const boardSize = N * tamanoCelda;
    offsetX = Math.floor((canvas.width  - boardSize) / 2);
    offsetY = Math.floor((canvas.height - boardSize) / 2);
}
recalcularOffset();

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
const btnIniciar = document.getElementById("Iniciar");
const btnDetener = document.getElementById("Detener");
const btnReanudar = document.getElementById("Reanudar");

if (btnIniciar) btnIniciar.addEventListener('click', iniciarSimulacion);
if (btnDetener) btnDetener.addEventListener('click', detenerSimulacion);
if (btnReanudar) btnReanudar.addEventListener('click', reanudarSimulacion);

//inicializa el estado de los botones
actualizarEstadoBotones(); 
const btnParpadeador = document.getElementById("btnParpadeador");
const btnBarco = document.getElementById("btnBarco");
const btnPlaneador = document.getElementById("btnPlaneador");
if (btnParpadeador) {
    btnParpadeador.addEventListener('click', function() {
        //posiciones que hacen el parpadeador
        patronSeleccionado = [[-1,0],[0,0],[1,0]]; 
        console.log("Parpadeador seleccionado. Haz clic en el tablero para colocarlo.");
    }); 
}
if (btnBarco) {
    btnBarco.addEventListener('click', function() {
        //posiciones que hacen el barco
        patronSeleccionado = [[0,0],[0,1],[1,0],[1,2],[2,1]]; 
        console.log("Barco seleccionado. Haz clic en el tablero para colocarlo.");

    }); 
}
if (btnPlaneador) {
    btnPlaneador.addEventListener('click', function() {
        //posiciones que hacen el planeador
        patronSeleccionado = [[0,1],[1,2],[2,0],[2,1],[2,2]]; 
        console.log("Planeador seleccionado. Haz clic en el tablero para colocarlo.");
    });
}


//-------------------EVENTOS RATÓN--------------------
canvas.addEventListener("click", function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor((x - offsetX) / tamanoCelda);
    const fila = Math.floor((y - offsetY) / tamanoCelda);


     if (col < 0 || col >= N || fila < 0 || fila >= N) return;

    if (patronSeleccionado) {
        ponerPatron(patronSeleccionado, fila, col);
        //el patrón se resetea después de colocar alguna de las figuras
        patronSeleccionado = null; 
        return;
    }
    mundo.getCelula(fila, col).setEstado(true);
    mundo.dibujar(contexto, tamanoCelda, offsetX, offsetY);
    dibujarCuadricula();
    recalcularOffset();
    });


//Método para mostrar información de una célula al pasar el mouse sobre ella
const cellInfoPanel = document.getElementById('cellInfoPanel');
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;

    const col = Math.floor(x / tamanoCelda);
    const fila = Math.floor(y / tamanoCelda);

    if (col < 0 || col >= mundo.ancho || fila < 0 || fila >= mundo.alto) return;

    const cel = mundo.getCelula(fila, col);
    if (cel) {
        cellInfoPanel.innerHTML = `Célula (${fila}, ${col}) - Viva: ${cel.estado ? 'Sí' : 'No'} - Tiempo viva: ${cel.time}`;
    }
});


//------------MÚSICA OPCIONAL-----------------
const musica = document.getElementById("musicaFondo");
const btnMusica = document.getElementById("btnMusica");
let musicaOn = false;

btnMusica.addEventListener("click", () => {
    if (!musicaOn) {
        musica.volume = 0.4;
        musica.play();
        musicaOn = true;
        btnMusica.textContent = "🔇 Silenciar";
    } else {
        musica.pause();
        musicaOn = false;
        btnMusica.textContent = "🎵 Música";
    }
});




//DIBUJAMOS EL MUNDO INICIAL
mundo.dibujar(contexto, tamanoCelda, offsetX, offsetY);
dibujarCuadricula();
recalcularOffset();

console.log("Juego de la Vida cargado correctamente.");



