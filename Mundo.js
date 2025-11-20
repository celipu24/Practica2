class Mundo{
    constructor(ancho=40){
        this.ancho = Number(ancho) || 40;
        this.matriz = [];
        this.crearMatriz();
    }

    /*Este método crea una matriz de tamaño ancho x ancho inicializada con null
    y se van rellenando las casillas con un bucle que recorre las filas y columnas */
    crearMatriz(){
        this.matriz = new Array(this.ancho);
        for(let fila=0; fila < this.ancho; fila++){
            this.matriz[fila] = new Array(this.ancho);
            for(let columna=0; columna < this.ancho; columna++){
                this.matriz[i][j] = null;
            }
        }
    }
}

