//VARIABLES GLOBALES

//Accedemos al motor gráfico ("contexto")
const canvas = document.getElementById("lienzo");
const contexto = canvas.getContext("2d");

//N es el tamaño del mundo
const N = 40;
//velocidad a la que se actualiza el mundo (en sg)                
let velocidad = 10;  
//cuanto ocupa cada celula=celda
let tamanoCelda = canvas.width / N;

//CREAMOS EL PROPIO MUNDO      
let mundo = new Mundo(N, N); 

var temporizador=null;       //para controlar la simulación
let simulando = false; // indica si la simulación está en marcha

//--------------------INICIALIZACIÓN--------------------
//CREAMOS EL TABLERO INICIAL
mundo.crearTablero();
//DIBUJAMOS EL MUNDO INICIAL
mundo.dibujar(contexto, tamanoCelda);
console.log("Juego de la Vida cargado correctamente.");



//-------------------BOTONES--------------------
const btnIniciar = document.getElementById("Iniciar");
const btnDetener = document.getElementById("Detener");
const btnReanudar = document.getElementById("Reanudar");

function actualizarEstadoBotones() {
    const hayVivas = mundo.contarCelulasVivas() > 0;
    btnIniciar.disabled = !hayVivas || simulando;
    btnDetener.disabled = !simulando;
    btnReanudar.disabled = simulando || !hayVivas;
}


//-------------------SIMULACIÓN--------------------
// Realiza un paso de la simulación
function pasoSimulacion() {
    mundo.actualizarTablero(); //calcula la siguiente generación
    mundo.dibujar(contexto, tamanoCelda); //dibuja el mundo actualizado
}


//iniciar simulación
function iniciarSimulacion() {
    if (simulando) return;                     // ya está corriendo

    // Si no hay ninguna célula viva, inicializamos con aleatorio
    if (mundo.contarCelulasVivas() === 0) {
        console.log("No hay células vivas. No se puede iniciar la simulación.");
        actualizarEstadoBotones();
        return;
    }
    simulando = true;
    temporizador = setInterval(pasoSimulacion, 1000 / velocidad); // velocidad = pasos/milisegundo
    actualizarEstadoBotones();
}

function detenerSimulacion() {
    simulando = false;
    clearInterval(temporizador);
    temporizador = null;
    actualizarEstadoBotones();
}

function reanudarSimulacion() {
    if (simulando) return; // ya está corriendo
    iniciarSimulacion();
}


//-------------------EVENTOS BOTONES--------------------
//añadimos los eventos de botón
document.getElementById("Iniciar").onclick = () =>{
    if (btnIniciar.disabled) return;
    //como anteriormente, comprobamos si hay células vivas, para empezar a correr el juego
    //y actualizamos el estado de los botones
    //por último iniciamos la simulación
    if (contarCelulasVivas() === 0) {
        alert("No hay ninguna célula viva. Pinta alguna célula antes de iniciar.");
        actualizarEstadoBotones();
        return;
    }
    iniciarSimulacion();
    actualizarEstadoBotones();
};

document.getElementById("Detener").onclick = () => { detenerSimulacion(); actualizarEstadoBotones(); }
document.getElementById("Reanudar").onclick = () => { reanudarSimulacion(); actualizarEstadoBotones(); }

function actualizarEstadoBotones() {
    const hayVivas = contarCelulasVivas() > 0;
    btnIniciar.disabled = !hayVivas || simulando;
    btnDetener.disabled = !simulando;
    btnReanudar.disabled = simulando || !hayVivas;
}

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
    actualizarEstadoBotones();
});

//para que si no hay ninguna celula viva, se creen aleatoriamente
document.getElementById("Aleatorio")?.onclick = () => {
    mundo.poblarAleatorio(0.2); // 20% de células vivas por defecto
    actualizarEstadoBotones();
};


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



//INICIALIZACION
actualizarEstadoBotones();




