// TODO: Variables globales
let presupuesto = 0;

// TODO: Funciones adicionales

function actualizarPresupuesto(valor) {
    if (typeof valor === "number" && valor > 0) {
        presupuesto = valor;
        return presupuesto;
    } else {
        return -1;
    }
}

function mostrarPresupuesto() {
    return `Tu presupuesto actual es de ${presupuesto} €`;
}

function CrearGasto(descripcion, valor) {
    if (!(this instanceof CrearGasto)) {
        // Asegurar que se usa como constructor
        return new CrearGasto(descripcion, valor);
    }

    this.descripcion = descripcion;
    this.valor = (typeof valor === "number" && valor > 0) ? valor : 0;

    // Método: mostrarGasto
    this.mostrarGasto = function() {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    };

    // Método: actualizarDescripcion
    this.actualizarDescripcion = function(nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
    };

    // Método: actualizarValor
    this.actualizarValor = function(nuevoValor) {
        if (typeof nuevoValor === "number" && nuevoValor > 0) {
            this.valor = nuevoValor;
        }
    };
}

// Exportación de funciones
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto
}
