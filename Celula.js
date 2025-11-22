class Celula{
    constructor(){
        this.estado = false; // false = muerta, true = viva
        this.time = 0; // tiempo que ha estado viva
        this.nextEstado = false; // estado para la siguiente generación

    }

    setEstado(estado){
        if(this.estado !== estado){
            this.time = 0; // reiniciar el tiempo si cambia de estado
        }
        this.estado = estado;
    }

    calcularSiguienteEstado(vecinasVivas){ //aplicamos la logica de la supervivencia de las reglas
        if(!this.estado && vecinasVivas === 3){
            this.nextEstado = true; //si esta muerta y tiene 3 vecinas vivas nace
        }else if(this.estado && (vecinasVivas === 2 || vecinasVivas === 3)){
            this.nextEstado = true; // si esta viva y tiene 2 o 3 vecinas vivas sobrevive
        }   else{
            this.nextEstado = false; // muere por soledad o sobrepoblacion
        }

    }

    actualizarEstado(){
        this.setEstado(this.nextEstado);
        if(this.estado){
            this.time += 1; // si esta viva aumenta el tiempo que ha estado viva
        }
    }





}