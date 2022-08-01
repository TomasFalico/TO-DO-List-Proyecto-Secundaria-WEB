//listado de listas 
let listadoListasHTML = document.getElementById("listado-list");

//listado de tareas
let listadoTareasHtml = document.querySelector("[data-lista-tareas]");

//campo de entrada para ingresar nombre de lista
let nombreNuevaLista = document.querySelector(".nueva-lista");

//formulario para agregar lista compuesto por el boton "+" y el campo de entrada
const formularioNuevaLista = document.querySelector('[data-new-lista-form]');

//boton para eliminar la lista seleccionada
const btnBorrarLista = document.querySelector(".btn-borrar-lista");

//boton para eliminar las tareas completadas
const btnBorrarTareasCompletas = document.querySelector(".btn-borrar-tareas");

//-----------------------------------------------------------------------------

//formulario donde se hace el ingreso de tareas
const formularioNuevaTarea = document.querySelector('[data-new-tarea-form]');

//contiene todo el listado de tareas
const listaTareasContainerDisplay = document.querySelector("[data-lista-tareas-container]");

//titulo h2 del listado tareas
const listaTareasTitulo = document.querySelector("[data-lista-tarea-titulo]");

//contador de tareas pendientes
const listaTareasContador = document.querySelector("[data-tareas-contador]");

//contiene el listado de las tareas y el formulario de ingreso de tareas
const listaTareasContainer = document.querySelector("[data-lista-tareas]");

//input donde ingreso el nombre de una nueva tarea
const nombreNuevaTarea = document.querySelector(".nueva-tarea");

//lista que se muetra por default si no hay ninguna lista presente
const listaDefault = { id: "id_default", name : "Listado por default ", task: ['Tarea Default']}

//Lista de listas default 
var listadoListasWebDefault = [listaDefault];

//Contador de tareas sin completar
let cuentaTareasFaltantes = 0;


//Funcion para eliminar tareas completadas
btnBorrarTareasCompletas.addEventListener("click", e =>{
    const listadoTareasCheck = $(':checkbox:checked');
    $('.tareas div').has('input:checkbox:checked').remove()
        //Consigo el listado de listas y el id de la lista seleccionada
        var listadoListasWeb = getListadoListasStorage();
        var listaSeleccionadaId = getIdListaSeleccionada();
        //Recorro el listado de listas
        for(i=0; i < listadoListasWeb.length; i++) {
            //Checkeo si alguna lista es la lista seleccionada
            if(listaSeleccionadaId === listadoListasWeb[i]["id"]){
                //recorro la lista de tareas checkeadas
                for(x=0; x < listadoTareasCheck.length ; x++){
                        //elimino las tareas seleccionadas de la lista de tareas 
                        listadoListasWeb[i]["task"].splice([listadoTareasCheck[x].id],1);
                }
            }
        }
        //guardo cambios en cache
        simpleStorage.set("listaListas", listadoListasWeb);
        generarListadoTareas()
});

//Metodo para eliminar una lista del listado
btnBorrarLista.addEventListener("click", e => {
    //Consigo el listado de listas actual guardado en cache
    var listadoListasWeb = getListadoListasStorage();
    //Consigo el id de la ultima lista seleccionada guardado en cache
    var listaSeleccionadaId = simpleStorage.get("listaSeleccionadaId");

    if(listaSeleccionadaId == undefined){
        alert("Debe hacer click en una lista para poder elimininarla");
        return;

    }
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

//Evento que se triggerea al momento de ingresar datos en el formulario de creacion de tareas
formularioNuevaTarea.addEventListener("submit", e=>{
    //Consigo el listado de listas guardado en cache
    var listadoListasWeb = getListadoListasStorage();
    //Consigo el id de la lista seleccionada
    var listaSeleccionadaId = getIdListaSeleccionada();

    //Verifico si el usuario ingreso informacion en el campo de entrada
    if(nombreNuevaTarea.value == ""){
        //En el caso de que no se haya ingresado informacion, aviso por pantalla
        alert("Debe ingresar el nombre de la tarea");
        return;
    }

    //recorro listado de listas
    for(i=0; i < listadoListasWeb.length; i++) {
        if(listaSeleccionadaId === listadoListasWeb[i]["id"]){
            //al encontrar la lista seleccionada, agrego la tarea a su lista de tareas
            listadoListasWeb[i].task.push(nombreNuevaTarea.value);
        }
    }
    //guardo la lista actualizada en cache
    simpleStorage.set("listaListas", listadoListasWeb);
    //vacio el campo de entrada de tarea
    nombreNuevaTarea.value = null;
    //reinicio la lista de tareas
    generarListadoTareas();
});

//Evento que se triggerea al momento de ingresar datos en el formulario de creacion de listas
formularioNuevaLista.addEventListener('submit', e =>{
    //Consigo el listado de listas actual
    var listadoListasWeb = getListadoListasStorage();
    //Si no se ingresa ningun dato, no se hace nada - TO-DO: Crear una alerta que le avise esto al usuario
    if(nombreNuevaLista.value == null || nombreNuevaLista.value === ''){
        alert("Debe ingresar el nombre de su lista");
        return;
    }
    //Creo un elemento lista con el nombre de la lista ingresada
    const lista = crearLista(nombreNuevaLista.value);
    //Agrego el elemnto a nuestra lista de listados general
    listadoListasWeb.push(lista);
    console.log(lista);
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
        generarListadoTareas();
    }
});

//Funcion encargada de generar el listado de listas
function generarListadoListas(){

    //vacio el listado de listas
    limpiarElemento(listadoListasHTML);

    //Consigo la lista de listados creados hasta el momento
    let listadoListas = getListadoListasStorage();

    //recorro la lista de listadops
    listadoListas.forEach(lista =>{
        //creo el elemento listado
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

//Fucion encargada de generar el listado de tareas
function generarListadoTareas(){
    //vacio el listado de tareas
    limpiarElemento(listadoTareasHtml);
    //Consigo el listado de listas y el id de la lista seleccionada
    var listadoListasWeb = getListadoListasStorage();
    var listaSeleccionadaId = getIdListaSeleccionada();

    if(listaSeleccionadaId == undefined){
        listaTareasContainerDisplay.classList.add("ocultar");
        return;
    }
    else{
        listaTareasContainerDisplay.classList.remove("ocultar");
    }

    //Recorro el listado de listas
    for(i=0; i < listadoListasWeb.length; i++) {
        //Checkeo si alguna lista es la lista seleccionada
        if(listaSeleccionadaId === listadoListasWeb[i]["id"]){
            //Cambio el titulo del listado de tareas por el de la lista seleccionada
            listaTareasTitulo.textContent = listadoListasWeb[i].name;
            //Recorro la lista de tareas del elemento que cumple con la anterior condicion
            for(j=0; j < listadoListasWeb[i]["task"].length; j++)
            {
                //Creo un elemento "div"
                const div = document.createElement("div");
                div.classList.add("tarea");
                //Creo un input de tipo checkbox con el id de la tarea
                const input = document.createElement("input");
                input.type = "checkbox";
                input.classList.add("checkbox");
                input.id = [j];
                //Creo un label describiendo la tarea con su nombre
                const label = document.createElement("span");
                label.classList.add("tarea-label");
                label.innerText = listadoListasWeb[i]["task"][j];
                div.append(input);
                div.append(label);
                listaTareasContainer.append(div);
                //Inserto la tarea dentro de mi contenedor de tareas
            }
        }
    }

    //Cuenta la cantidad de tareas sin checkear
    cuentaTareasFaltantes = $('input[type=checkbox]').not(':checked').length;
    //Ingreso el numero de tareas en mi contador por default
    listaTareasContador.innerText = "Tareas pendientes: " + cuentaTareasFaltantes;

    //Funcion creada para refrescar el contador de tareas en caso de que se tilde o destilde alguna tarea
    $('.tareas div input[type=checkbox]').click(function() { // while you're at it listen for change rather than click, this is in case something else modifies the checkbox
        cuentaTareasFaltantes = $('input[type=checkbox]').not(':checked').length;
        //Cuenta la cantidad de tareas sin checkear
        listaTareasContador.innerText = "Tareas pendientes: " + cuentaTareasFaltantes;
    });
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

//Verifico si hay algun listado guardado en cache
if(getListadoListasStorage() == undefined){
    //En el caso de que no haya un listado guardado, inicializo mi sistema con una lista default
    simpleStorage.set("listaListas", listadoListasWebDefault);
}

//Vacio la variable donde guardo el id de la lista seleccionada para que la pagina inicie sin un listado de tareas abierto
simpleStorage.set("listaSeleccionadaId", undefined);

generarListadoListas();

generarListadoTareas();
