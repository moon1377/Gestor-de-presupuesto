import * as gesGastos from "./gestionPresupuesto.js";

// Obtenemos referencias a elementos del DOM dond mostraremos datos
let divTotal = document.getElementById("total");
let divForm = document.getElementById("formcreacion");

// Creamos formulario para añadir nuevos gastos
let form = document.createElement("form");

// Creamos un div para la descripcion
let divDesc = document.createElement("div");
divDesc.classList.add("form-control");

// Para la descripcion
let campoDesc = document.createElement("input");
campoDesc.setAttribute("name", "descripcion");
campoDesc.setAttribute("id", "descripcion");

let labelDesc = document.createElement("label");
labelDesc.textContent = "Descripción";
labelDesc.setAttribute("for", "descripcion");
divDesc.append(labelDesc, campoDesc); //ponemos el label e input dentro del div

let divValor = document.createElement("div");
divValor.classList.add("form-control");

let campoValor = document.createElement("input");
campoValor.setAttribute("name", "valor");
campoValor.setAttribute("type", "number"); //ponemos que sea de tipo numerico
campoValor.setAttribute("id", "valor");

let labelValor = document.createElement("label");
labelValor.textContent = "Valor";
labelValor.setAttribute("for", "valor");

divValor.append(labelValor, campoValor);


// Fecha
let divFecha = document.createElement("div");
divFecha.classList.add("form-control");

let campoFecha = document.createElement("input");
campoFecha.setAttribute("name", "fecha");
campoFecha.setAttribute("id", "fecha");
campoFecha.setAttribute("type", "date"); //para poner la fecha

let labelFecha = document.createElement("label");
labelFecha.textContent = "Fecha";
labelFecha.setAttribute("for", "fecha");

divFecha.append(labelFecha, campoFecha);

// Etiquetas
let divEtiquetas = document.createElement("div");
divEtiquetas.classList.add("form-control");

let campoEtiquetas = document.createElement("input");
campoEtiquetas.setAttribute("name", "etiquetas");
campoEtiquetas.setAttribute("id", "etiquetas");

let labelEtiquetas = document.createElement("label");
labelEtiquetas.textContent = "Etiquetas";
labelEtiquetas.setAttribute("for", "etiquetas");

divEtiquetas.append(labelEtiquetas, campoEtiquetas);

// Boton para enviar
let botonEnvio = document.createElement("button");
botonEnvio.setAttribute("type", "submit");
botonEnvio.textContent = "Crear";

// Ponemos todos los campos y el boton
form.append(divDesc, divValor, divFecha, divEtiquetas, botonEnvio);

// Gestion de envio
form.addEventListener("submit", function(evento) {
    evento.preventDefault(); //para qeu no se recargo

    // Para los valores que pongamos
    let desc = evento.target.elements.descripcion.value;
    let valor = parseFloat(evento.target.elements.valor.value);
    let fecha = evento.target.elements.fecha.value;
    let etiquetas = evento.target.elements.etiquetas.value.split(" ");
    console.log(etiquetas);
    let nuevoGasto = new gesGastos.CrearGasto(desc, valor, fecha, ...etiquetas);
    gesGastos.anyadirGasto(nuevoGasto);
    pintarGastosWeb(); //actualiza interfaz
});

divForm.append(form);

class MiGasto extends HTMLElement {
    constructor() {
	super();
    } // Llamamos al constructor de HTMLElement

    connectedCallback() {
	
	const shadow = this.attachShadow({mode: 'open'});

	//Cargamos la plantilla
	let plantilla = document.getElementById('gastoPlantilla'); 
	let plantillaContenido = plantilla.content; 

	
	shadow.append(plantillaContenido.cloneNode(true));

	
	shadow.querySelector(".gasto-descripcion").textContent = this.gasto.descripcion;
	shadow.querySelector(".gasto-valor").textContent = this.gasto.valor;
	shadow.querySelector(".gasto-fecha").textContent = new Date(this.gasto.fecha).toISOString().substring(0,10);
	shadow.querySelector(".gasto-etiquetas").textContent = this.gasto.etiquetas;

	
	let formEdicion = shadow.querySelector("form");

	// Boton de editar
	let botonEditar = shadow.querySelector(".gasto-editar-formulario");
	botonEditar.addEventListener("click", (evento) => {
	    
	    formEdicion.elements.descripcion.value = this.gasto.descripcion;
	    formEdicion.elements.valor.value = this.gasto.valor;
	    formEdicion.elements.fecha.value = new Date(this.gasto.fecha).toISOString().substring(0,10);
	    formEdicion.elements.etiquetas.value = this.gasto.etiquetas.join(",");

	    
	    formEdicion.classList.toggle("oculto");
	});

	// Boton de cancelae
	let botonCancelar = shadow.getElementById("cancelar");
	botonCancelar.addEventListener("click", (evento) => {
	    
	    formEdicion.classList.toggle("oculto");
	});

	// Boton de borrar
	let botonBorrar = shadow.querySelector(".gasto-borrar");
	botonBorrar.addEventListener("click", (evento) => {
	    
	    if (confirm("¿Seguro que desea borrar?")) {
		
		gesGastos.borrarGasto(this.gasto.id);

		
		pintarGastosWeb();

	    }
	});

	
	formEdicion.addEventListener("submit", (evento) => {
	    this.gasto.actualizarDescripcion(evento.target.elements.descripcion.value);
	    
	    this.gasto.actualizarValor(Number(evento.target.elements.valor.value));
	    this.gasto.actualizarFecha(evento.target.elements.fecha.value);
	    this.gasto.etiquetas = evento.target.elements.etiquetas.value.split(",");
	    
	    pintarGastosWeb();
	});
    }
}


customElements.define('mi-gasto', MiGasto);


let divLista = document.getElementById("listado");

// Para reeditar la lista de los gastos
function pintarGastosWeb() {
    
    divLista.innerHTML = ""; // Borra la lista

    
    for (let gasto of gesGastos.listarGastos()) { // Crea nueva
	
	let gastoEl = document.createElement("mi-gasto");

	
	gastoEl.gasto = gasto;

	
	divLista.append(gastoEl);
    }

    
    divTotal.innerHTML = `<h1>Total: ${gesGastos.calcularTotalGastos()} €</h1>`; // Se muestra el total
}

pintarGastosWeb();