//listado de listas 
let listadoListasHTML = document.getElementById("listado-list");

//campo de entrada para ingresar nombre de lista
let nombreNuevaLista = document.querySelector(".nueva-lista");

//formulario para agregar lista compuesto por el boton "+" y el campo de entrada
const formularioNuevaLista = document.querySelector('[data-new-lista-form]');

//contiene todo el litado de tareas
const listaTareasContainerDisplay = document.querySelector("[data-lista-tareas-container]");

//titulo h2 del listado tareas
const listaTareasTitulo = document.querySelector("[data-lista-tarea-titulo]");

//contador de tareas pendientes
const listaTareasContador = document.querySelector("[data-tareas-contador]");

//contiene el listado de las tareas y el formulario de ingreso de tareas
const listaTareasContainer = document.querySelector("[data-lista-tareas]");

//boton para eliminar la lista seleccionada
const btnBorrarLista = document.querySelector(".btn-borrar-lista");



//Metodo para eliminar una lista del listado
btnBorrarLista.addEventListener("click", e => {
    //Consigo el listado de listas actual guardado en cache
    var listadoListasWeb = getListadoListasStorage();
    //Consigo el id de la ultima lista seleccionada guardado en cache
    var listaSeleccionadaId = simpleStorage.get("listaSeleccionadaId");
    //Recorro el listado 
    for(i=0; i < listadoListasWeb.length; i++) {
        //Si encuentro una lista que tiene el mismo id que la ultima lista seleccionada
        if(listaSeleccionadaId === listadoListasWeb[i]["id"]){
            //Elimino el registro que cumpla con la condicion previa
            listadoListasWeb.splice(i,1);
            //TO-DO: Hacer una pregunta previa al usuario antes de borrar el registro
        }
    }
    //Guardo la lista nueva con el registro eliminado en el cache
    simpleStorage.set("listaListas", listadoListasWeb);
    //Vuevlo a generar la lista para mostrar la version mas actualizada
    generarListadoListas()
});


//Evento que se triggerea al momento de ingresar datos en el formulario de creacion de listas
formularioNuevaLista.addEventListener('submit', e =>{
    //Consigo el listado de listas actual
    var listadoListasWeb = getListadoListasStorage();
    //Si no se ingresa ningun dato, no se hace nada - TO-DO: Crear una alerta que le avise esto al usuario
    if(nombreNuevaLista.value == null || nombreNuevaLista.value === '')return;
    //Creo un elemento lista con el nombre de la lista ingresada
    const lista = crearLista(nombreNuevaLista.value);
    //Agrego el elemnto a nuestra lista de listados general
    listadoListasWeb.push(lista);
    //Guardo esta nueva lista en el cache de nuestro navegador
    simpleStorage.set("listaListas", listadoListasWeb);
    //Vuelvo a generar el listado de listas para que aparezca esta nueva lista
    generarListadoListas();
    //Vacio el campo de texto donde se ingreso el nombre de la lista
    nombreNuevaLista.value = null;
});


//Funcion para crear un registro de la lista ingresada
function crearLista(nombre){
    //Creo un id utilizando la fecha y horario actual
    return { id: Date.now().toString(), name : nombre, task: []}
}

//Evento que se triggerea cuando hacemos click en alguna lista del listado
listadoListasHTML.addEventListener('click', e=>{
    //Verficio que se este haciendo click a uno de los item dentro del listado
    if (e.target.tagName.toLowerCase() === 'li'){
        //Guardo el id del item seleccionado en cache
        simpleStorage.set("listaSeleccionadaId",e.target.dataset.listaId);
        //Vuelvo a generar el listado para resaltar el item seleccionado en la lista
        generarListadoListas();
    }
});

//Funcion encargada de generar el listado de listas
function generarListadoListas(){

    //vacio el listado
    limpiarElemento(listadoListasHTML);

    //Consigo la lista de listados creados hasta el momento
    let listadoListas = getListadoListasStorage();

    listadoListas.forEach(lista =>{
        //creo el item de listado
        const li = document.createElement('li');
        //le asigno un id
        li.dataset.listaId = lista.id;
        //le agrego la clase nombre-lista
        li.classList.add("nombre-lista");
        //inserto el nombre de la lista
        li.innerText = lista.name;
        //Si el id de la lista es un id que fue seleccionado de forma previa
        if (lista.id === getIdListaSeleccionada()){
            //agrego una clase para resaltar lista
            li.classList.add("lista-activa");
        }

        //agrego item de listado a nuestro listado de listas
        listadoListasHTML.append(li);
    })
}

//Listado que se almacena en cache y almacena el ultimo id del listado que se selecciono
function getIdListaSeleccionada(){
    return simpleStorage.get("listaSeleccionadaId");
}

//Listado que se guarda en cache y almacena el listado de listas
function getListadoListasStorage(){
    return simpleStorage.get("listaListas");
}

//Funcion generica para vaciar un elemnto
function limpiarElemento(elemento){
    while(elemento.firstChild){
        elemento.removeChild(elemento.firstChild);
    }
}


generarListadoListas();

