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
    
}