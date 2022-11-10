/* - - - - - - Imports  - - - - - -*/
import * as carrito from "./librerias/carritoFunciones.js"
import {mostrarAlert} from "./librerias/alerts.js"
/* - - - - - - Carrito  - - - - - -*/
if (location.pathname == "/pages/productos.html"){
const CARRITO_ICONO = document.querySelector("#carrito-icono")
const CONTENEDOR_CARRITO = document.querySelector(".carrito-container")
const BTN_CERRAR_CARRITO = document.querySelector("#btn-cerrar-carrito")
CARRITO_ICONO.addEventListener("click", () => {
    if (CONTENEDOR_CARRITO.style.display == "flex"){
        CONTENEDOR_CARRITO.style.display = "none"
    }
    else{
        CONTENEDOR_CARRITO.style.display = "flex"
    }
})
BTN_CERRAR_CARRITO.addEventListener("click", () => {
    CONTENEDOR_CARRITO.style.display = "none"
})

const PRODUCTOS_DISPONIBLES = document.querySelectorAll(".producto")
let datosCarritoSessionStorage = sessionStorage.getItem("listaCarrito")
carrito.recuperarDatosListaCarrito(datosCarritoSessionStorage, carrito.listaCarrito)
carrito.agregarProductosAlCarrito(carrito.listaCarrito, PRODUCTOS_DISPONIBLES)
}
/* - - - - - - Formulario Página Contacto  - - - - - -*/
if (location.pathname == "/pages/contacto.html"){
const FORM = document.querySelectorAll("form")[2]
FORM.addEventListener("submit", (e) => {
    e.preventDefault()
    const DATOS = Object.fromEntries(new FormData(e.target))
    console.log(DATOS)
    sessionStorage.getItem("form", JSON.stringify(DATOS))
    mostrarAlert({
        type: "check-alert", 
        text: "PRONTO RECIBIRÁS NOTICIAS NUESTRAS"
    })
    let popUp = document.querySelector(".container-pop-up")
    if (popUp.style.display == "flex"){
            popUp.style.display = "none"
    }
    else{
        popUp.style.display = "flex"
    }
    let botonCerrarPop = popUp.querySelector("span")
    botonCerrarPop.addEventListener("click", () => {
        popUp.style.display = "none"
    })
    // Mensaje
    popUp.querySelector(".pop-up-body").innerHTML = `
        <div class="datos-contacto">
            <p>De: <span>${DATOS.nombre}</span></p>
            <p>Asunto: <span>${DATOS.asunto}</span></p>
            <p>Mensaje: <span>${DATOS.contenido}</span></p>
        </div>
        <span><i>Tiempo media de respuesta: 4 hs</i></span>
    `
})
}
/* - - - - - - Formulario Página Comentarios  - - - - - -*/
if (location.pathname == "/pages/comentarios.html"){
    let renderComentario = (DATOS) => {
        let contenedorComentarios = document.querySelector(".comentarios")
        let comentariosAnteriores = contenedorComentarios.innerHTML
        contenedorComentarios.innerHTML = ""
        contenedorComentarios.innerHTML += `
            <article class="opinion">
                <div class="nombre-usuario">
                    <img src="../images/logo-3.jpg" alt="Foto de ${DATOS.nombre}">
                    <h5>${DATOS.nombre}</h5>
                </div>
                <div class="opinion-usuario">
                    <p>${DATOS.opinion}</p>
                </div>
                <div class="fecha-opinion">
                    <span>Ahora mismo</span>
                </div>
            </article>
        `
        contenedorComentarios.innerHTML += comentariosAnteriores
    }
    const FORM = document.querySelectorAll("form")[2]
    FORM.addEventListener("submit", (e) => {
        e.preventDefault()
        const DATOS = Object.fromEntries(new FormData(e.target))
        console.log(DATOS)
        sessionStorage.setItem("form", JSON.stringify(DATOS))
        mostrarAlert({
            type: "check-alert", 
            text: "GRACIAS POR TUS COMENTARIOS"
        })
        renderComentario(DATOS)
        location.hash = "#comentarios"
    })
}
/* - - - - - - Recetas  - - - - - -*/
if (location.pathname == "/pages/productos.html"){
    let renderReceta = (receta) => {
        let popUp = document.querySelector(".container-pop-up")
        if (popUp.style.display == "flex"){
                popUp.style.display = "none"
        }
        else{
            popUp.style.display = "flex"
        }
        let botonCerrarPop = popUp.querySelector("span")
        botonCerrarPop.addEventListener("click", () => {
            popUp.style.display = "none"
        })
        let div = document.createElement("div")
        div.setAttribute("class", "receta")
        popUp.querySelector(".pop-up-body").innerHTML = ""
        popUp.querySelector(".pop-up-body").append(div)
        popUp.querySelector(".pop-up-header").querySelector("h5").textContent = "Receta del Día"
        popUp.querySelector(".pop-up-body").querySelector(".receta").innerHTML = `
            <h5>${receta.nombre}</h5>
            <img src="${receta.imagen}">
            <p>Preparación: ${receta.tiempoTotal}<span><i class="bi bi-clock-fill"></i></span></p>
            <span>Ingredientes</span>
            <ul></ul>
        `
        for (let ingrediente of receta.ingredientes){
            popUp.querySelector(".pop-up-body").querySelector(".receta").querySelector("ul").innerHTML += `<li>${ingrediente}</li>`
        }
        let indice = 0
        popUp.querySelector(".pop-up-body").querySelector(".receta").innerHTML += `
            <span>Intrucciones</span>
            <div class="receta-pasos">
                <button class="anterior"> < </button>
                <div class="paso"><b>Paso ${indice + 1} de ${receta.pasos.length}</b>: ${receta.pasos[indice]}</div>
                <button class="siguiente"> > </button>
            </div>
        `
        /* Flechas */
        popUp.querySelector(".anterior").addEventListener("click", () => {
            indice -= 1
            if (indice < 0)
                indice = receta.pasos.length - 1
            popUp.querySelector(".pop-up-body").querySelector(".receta").querySelector(".paso").innerHTML = `<b>Paso ${indice + 1} de ${receta.pasos.length}</b>: ${receta.pasos[indice]}`
        })
        popUp.querySelector(".siguiente").addEventListener("click", () => {
            indice += 1
            if (indice > receta.pasos.length - 1)
                indice = 0
            popUp.querySelector(".pop-up-body").querySelector(".receta").querySelector(".paso").innerHTML = `<b>Paso ${indice + 1} de ${receta.pasos.length}</b>: ${receta.pasos[indice]}`

        })
        //popUp.querySelector(".pop-up-body").querySelector(".receta").innerHTML += `<p>Fuente: <a href="https://recetinas.com/" target="_blink">Recetinas</a></p>`
    }
    let obtenerReceta = (recetas) => {
        let indice = Math.floor(Math.random() * recetas.length)
        let receta = recetas[indice]
        console.log(receta.nombre)
        console.log(receta.tiempoTotal)
        console.log(receta.ingredientes)
        console.log(receta.pasos)
        renderReceta(receta)
    }
    let btnReceta = document.querySelector(".recetas").querySelector(".btn-ver-receta")
    btnReceta.addEventListener("click", () => {
        fetch("/js/librerias/recetas.json")
        .then((respuesta) => {
            return respuesta.json()
        })
        .then((recetas) => {
            obtenerReceta(recetas)
        })
        .catch((error) => {
            mostrarAlert({
                type: "warning-alert",
                text: "LAS RECETAS NO ESTÁN DISPONIBLES POR AHORA"
            })
        })
    })
}