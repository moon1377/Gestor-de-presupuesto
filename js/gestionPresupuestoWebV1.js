import * as gesGastos from "./gestionPresupuesto.js";
// Importa todas las funciones y clases del archivo "gestionPresupuesto.js" dentro del objeto gesGastos


let divTotal = document.getElementById("total");
// Obtiene el div con id "total".

divTotal.innerHTML = gesGastos.calcularTotalGastos();

let divForm = document.getElementById("formcreacion");
// Obtiene el div donde se insertará el formulario de creación de gastos


let form = document.createElement("form");
// Crea un elemento form dinámicamente

let campoDesc = document.createElement("input");
campoDesc.setAttribute("name", "descripcion");
campoDesc.setAttribute("id", "descripcion");
// Asigna name="descripcion" y id="descripcion" para poder acceder a el

let campoValor = document.createElement("input");
campoValor.setAttribute("name", "valor");
campoValor.setAttribute("type", "number");
campoValor.setAttribute("id", "valor");
// Crea un input para el valor del gasto del tipo number

let campoFecha = document.createElement("input");
campoFecha.setAttribute("name", "fecha");
campoFecha.setAttribute("id", "fecha");
campoFecha.setAttribute("type", "date");
// Crea un input para fecha del tipo date

let campoEtiquetas = document.createElement("input");
campoEtiquetas.setAttribute("name", "etiquetas");
campoEtiquetas.setAttribute("id", "etiquetas");
//Crea un input para etiquetas

let botonEnvio = document.createElement("button");
botonEnvio.setAttribute("type", "submit");
botonEnvio.textContent = "Crear";
// Crea un botón de envio para el formulario con texto: Crear.

form.append("Valor: ", campoValor, "Descripción: ", campoDesc, "Fecha: ", campoFecha, "Etiquetas: ", campoEtiquetas, botonEnvio);


form.addEventListener("submit", function(evento) { //Añade un evento al formulario para cuando se envíe
    evento.preventDefault();

    // Obtiene los valores de los campos del formulario
    let desc = evento.target.elements.descripcion.value;
    let valor = parseFloat(evento.target.elements.valor.value);
    let fecha = evento.target.elements.fecha.value;
    let etiquetas = evento.target.elements.etiquetas.value.split(" ");

    console.log(etiquetas);
    //Muestra las etiquetas en la consola para depuración.

    let nuevoGasto = new gesGastos.CrearGasto(desc, valor, fecha, ...etiquetas);
    gesGastos.anyadirGasto(nuevoGasto);
    //Añade el gasto a la lista de gastos usando la función anyadirGasto
    pintarGastosWeb(); //Llama a pintarGastosWeb para actualizar la lista y el total en la web.
});

divForm.append(form);



let ManejadorBorrado = {  //Define un objeto para el boton de borrar
    handleEvent: function(evento) {
	
	if (confirm("¿Quieres borrar?")) {
        //Muestra una ventana de confirmación antes de borrar.

	
	    gesGastos.borrarGasto(this.gasto.id);
	    
	    pintarGastosWeb(); //Actualiza la lista y el total tras borrar el gasto.

	}
    }
}


let divLista = document.getElementById("listado"); // Obtiene el div donde se mostrará la lista de gastos

function pintarGastosWeb() {

    divLista.innerHTML = ""; //Borra cualquier contenido anterior de la lista para reconstruirla desde cero.

    // Creamos un listado nuevo
    for (let gasto of gesGastos.listarGastos()) {
	let gastoDiv = document.createElement("div");
	gastoDiv.innerHTML = `${gasto.descripcion} - ${gasto.valor} - ${new Date(gasto.fecha).toISOString()} - ${gasto.etiquetas}`;

	// Crea un botón de borrado para cada gasto.
	let gastoBorrar = document.createElement("button");
	gastoBorrar.setAttribute("type", "button");
	gastoBorrar.textContent = "Borrar";

	// Crea un manejador personalizado para este botón de borrado
	let manejadorBorrar = Object.create(ManejadorBorrado);
	manejadorBorrar.gasto = gasto;
	gastoBorrar.addEventListener("click", manejadorBorrar);


	gastoDiv.append(gastoBorrar);
	divLista.append(gastoDiv);


    }

    // Mostramos el total
    divTotal.innerHTML = gesGastos.calcularTotalGastos();
}

pintarGastosWeb();

