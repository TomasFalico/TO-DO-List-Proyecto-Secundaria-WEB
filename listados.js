let listadoListas = document.getElementById("listado-list");

const listadoListasPlaceholder = ["Lista 1", "Lista 2", "Lista 3", "Lista Placeholder"];


function generarListadoListas(){
    for(let i=0; i<listadoListasPlaceholder.length; i++){
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(listadoListasPlaceholder[i]));
        listadoListas.append(li);
    }
}

generarListadoListas();