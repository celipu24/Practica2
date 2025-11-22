class Mundo{
    constructor(ancho=40){
        this.ancho = Number(ancho) || 40;
        this.tablero = [];
        this.crearTablero();
    }

    /*Este método crea una matriz de tamaño ancho x ancho inicializada con null
    y se van rellenando las casillas con un bucle que recorre las filas y columnas */
    crearTablero(){
        this.tablero = new Array(this.ancho);
        for(let fila=0; fila < this.ancho; fila++){
            this.tablero[fila] = new Array(this.ancho);
            for(let columna=0; columna < this.ancho; columna++){
                this.tablero[fila][columna] = new Celula;
            }
        }
    }

    /*esto implica que el mundo se comporte como una esfera, evita índices
     negativos y que se salen por la derecha*/
    getCelula(fila, columna){
        const f = (fila + this.ancho) % this.ancho;
        const c = (columna + this.ancho) % this.ancho;
        return this.tablero[f][c];
    }



    //--------------------FILAS--------------------
    /*para numerar las casillas de alrededor de una celula dada lo haremos dandole valor negativo
    a las casillas de arriba/izq.; arriba y arriba/der., neutro a las de izq. y der. y positivo abajo izq; abajo y abajo der.*/
    //--------------------COLUMNAS--------------------
    /* valor negativo a las casillas de arriba/izq.; izq y abajo/izq., neutro a las de arriba y de bajo y positivo al resto*/
    contarVecinasVivas(fila, columna){
        let vivas = 0;
        //este for anidado recorre las 8 posiciones alrededor de la celula según el criterio anteriormente descrito
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
                if(i === 0 && j === 0){
                    continue;//como es la posicion de la propia celula la saltamos
                }if(this.getCelula(fila + i, columna + j).estado){
                    //si en la posicion hay una celula en estado viva aumentamos el contador
                    vivas++;
                }
            }
        }
        return vivas;
    }


    //Actualizamos el estado del tablero
    actualizarTablero(){
        for(let fila = 0; fila < this.ancho; fila++){
            for(let columna = 0; columna < this.ancho; columna++){
                //recorremos las "casillas" del tablero para actualizar el estado de las celulas
                const celula = this.getCelula(fila, columna);
                const vecinasVivas = this.contarVecinasVivas(fila, columna);
                //aquí estamos actualizando el estado siguiente que tienen las celulas vecinas.
                celula.calcularSiguienteEstado(vecinasVivas);
            }
        }
        for (let fila = 0; fila < this.ancho; fila++){
            for (let columna = 0; columna < this.ancho; columna++){
                /*separamos la actualización en 2 partes para que primero se actualice el estado siguiente
                y aquí se actualice en tiempo real.*/
                this.tablero[fila][columna].actualizarEstado();
            }
        }
    }

    dibujar(ctx, tamCelda) {
        for (let fila = 0; fila < this.ancho; fila++) {
            for (let col = 0; col < this.ancho; col++) {
                const celula = this.getCelula(fila, col);
                ctx.fillStyle = celula.estado ? "black" : "white";
                ctx.fillRect(col * tamCelda, fila * tamCelda, tamCelda, tamCelda);
                ctx.strokeStyle = "#ccc";
                ctx.strokeRect(col * tamCelda, fila * tamCelda, tamCelda, tamCelda);
            }
        }
    }





















}


