import {mostrarAlert} from "./alerts.js"
const CONTENEDOR_CARRITO = document.querySelector(".carrito-container")
class Producto{
    constructor(imagen, nombre, precio, cantidad){
        this.imagen = imagen
        this.nombre = nombre
        this.precio = precio
        this.cantidad = cantidad
    }
    // En cada objeto se podra calcular el subtotal dependiendo del precio y la cantidad
    subtotal(){
        let cantidad = parseInt(this.cantidad)
        let precio = this.precio
        // Necesito quitar el '$' de mi precio para tratarlo como int, por eso uso la funcion subtring
        precio = Number(precio.substring(1, precio.length))
        return cantidad * precio
    }
}
export let listaCarrito = []

let calcularTotalCarrito = (listaCarrito) => {
    let total = 0
    for (let item of listaCarrito){
        total += item.subtotal()
    }
    CONTENEDOR_CARRITO.querySelector(".total").style.display = "block"
    CONTENEDOR_CARRITO.querySelector(".total").textContent = `Total: $${total}`
    return total
}
let mostrarCantidadArticulosCarrito = (listaCarrito) => {
    const ICONO_CANTIDAD = document.querySelector(".carrito-cantidad-articulos")
    let cantidadArticulos = listaCarrito.length
    if (cantidadArticulos > 0){
        ICONO_CANTIDAD.style.display = "block"
        ICONO_CANTIDAD.textContent = cantidadArticulos
    }
    else{
        ICONO_CANTIDAD.textContent = cantidadArticulos
        ICONO_CANTIDAD.style.display = "none"
    }
}
let vaciarCarrito = (listaCarrito) => {
    const LISTA_CARRITO = CONTENEDOR_CARRITO.querySelector(".carrito-content").querySelector("ul")
    const MENSAJE_CONTENIDO_VACIO = "Tu carrito está vacío"
    const BTN_VACIAR_CARRITO = CONTENEDOR_CARRITO.querySelector(".btn-vaciar-carrito")
    BTN_VACIAR_CARRITO.addEventListener("click", function(){
        while(listaCarrito.pop() != undefined){
            listaCarrito.pop()
        }
        calcularTotalCarrito(listaCarrito)
        mostrarCantidadArticulosCarrito(listaCarrito)
        LISTA_CARRITO.innerHTML = `<p>${MENSAJE_CONTENIDO_VACIO}</p><button class="total"></button>`
        sessionStorage.removeItem("listaCarrito")
        mostrarAlert({
            type: "check-alert", 
            text: "SE QUITARON TODOS LOS PRODUCTOS"
        })
    })
}
let generarEstructuraHtml = (producto) => {
        let estructuraHtml = `
            <li>
                <div class="producto-deseado">
                    <div class="producto-img">
                        <img src="${producto.imagen}" alt="">
                    </div>
                    <div class="producto-detalles">
                        <h5>${producto.nombre}</h5>
                        <span>${producto.precio}</span>
                    </div>
                    <div class="producto-cantidad">
                        <button class="btn-quitar">-</button>
                        <input type="text" value="${producto.cantidad}">
                        <button class="btn-agregar">+</button>
                    </div>
                    <div class="producto-subtotal">Subtotal: $${producto.subtotal()}</div>
                </div>
            </li>
        `
    return estructuraHtml
}
let imprimirHTMLListaCarrito = () => {
    const LISTA_CARRITO = CONTENEDOR_CARRITO.querySelector(".carrito-content").querySelector("ul")
    LISTA_CARRITO.innerHTML = ""
    for (let item of listaCarrito){
        LISTA_CARRITO.innerHTML += generarEstructuraHtml(item);
    }
    LISTA_CARRITO.innerHTML += `<button class="btn-vaciar-carrito">Vaciar Carrito</button>`
    //LISTA_CARRITO.innerHTML += `<button class="total" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>`
    LISTA_CARRITO.innerHTML += `<button class="total"></button>`
    vaciarCarrito(listaCarrito)
    generarComprobante()
}
let determinarExistencia = (lista, objeto) => {
    let existe = false
    for (let i of lista){
        if (i.nombre == objeto.nombre){
            existe = true
        }
    }
    return existe
}
export let recuperarDatosListaCarrito = (datosCarritoSessionStorage, listaCarrito) => {
    if (datosCarritoSessionStorage != null){
        datosCarritoSessionStorage = datosCarritoSessionStorage.substring(2, datosCarritoSessionStorage.length - 2)
        let objeto = datosCarritoSessionStorage.split("},{")
        for (let item of objeto){
            item = `{ ${item} }`
            item = JSON.parse(item)
            let productoRecuperado = new Producto(item.imagen, item.nombre, item.precio, item.cantidad)
            listaCarrito.push(productoRecuperado)
        }
        imprimirHTMLListaCarrito()
        calcularTotalCarrito(listaCarrito)
        mostrarCantidadArticulosCarrito(listaCarrito)
        controlDeUnidades(listaCarrito)
    }
}
let controlDeUnidades = (listaCarrito) => {
    let productosEnCarrito = document.querySelectorAll(".producto-deseado")
    for (let subitem of productosEnCarrito){
        subitem.querySelector(".btn-quitar").addEventListener("click", function(){
            if (Number(subitem.querySelector("input").value) > 0){
                subitem.querySelector("input").value = Number(subitem.querySelector("input").value) - 1
                for (let i of listaCarrito){
                    if (i.nombre == subitem.querySelector("h5").textContent){
                            i.cantidad -= 1
                            // Actualizo el subtotal
                            subitem.querySelector(".producto-subtotal").textContent = `Subtotal: $${i.subtotal()}`
                            calcularTotalCarrito(listaCarrito)
                            sessionStorage.setItem("listaCarrito", JSON.stringify(listaCarrito))
                    }
                }
            }
        })
        subitem.querySelector(".btn-agregar").addEventListener("click", function(){
            subitem.querySelector("input").value = Number(subitem.querySelector("input").value) + 1
            for (let i of listaCarrito){
                if (i.nombre == subitem.querySelector("h5").textContent){
                    i.cantidad += 1
                    // Actualizo el subtotal
                    subitem.querySelector(".producto-subtotal").textContent = `Subtotal: $${i.subtotal()}`
                    calcularTotalCarrito(listaCarrito)
                    sessionStorage.setItem("listaCarrito", JSON.stringify(listaCarrito))
                }
            }
        })
    }
}
let crearObjetoProducto = (productoHtmlContext) => {
    let imagenProducto = productoHtmlContext.querySelector(".imagen-producto").querySelector("img").getAttribute("src")
    let nombreProducto = productoHtmlContext.querySelector(".nombre-producto").textContent
    let precioProducto = productoHtmlContext.querySelector(".precio-producto").textContent
    let cantidadProducto = 1
    let productoGenerado = new Producto(imagenProducto, nombreProducto, precioProducto, cantidadProducto)
    return productoGenerado
}
export let agregarProductosAlCarrito = (listaCarrito, PRODUCTOS_DISPONIBLES) => {
    for (let item of PRODUCTOS_DISPONIBLES){
        const BTN_PEDIR = item.querySelector(".btn-pedir")
        BTN_PEDIR.addEventListener("click", () => {
            let nuevoProducto = crearObjetoProducto(item)
            if (determinarExistencia(listaCarrito, nuevoProducto) == false){
                listaCarrito.push(nuevoProducto)
                mostrarAlert({
                    type: "info-alert",
                    text: "PRODUCTO AGREGADO"
                })
                sessionStorage.setItem("listaCarrito", JSON.stringify(listaCarrito))
                imprimirHTMLListaCarrito()
                calcularTotalCarrito(listaCarrito)
                mostrarCantidadArticulosCarrito(listaCarrito)
                controlDeUnidades(listaCarrito)
            }
            else{
                let productosEnCarrito = document.querySelectorAll(".producto-deseado")
                for (let subitem of productosEnCarrito){
                    if (subitem.querySelector("h5").textContent == nuevoProducto.nombre){
                        subitem.querySelector("input").value = Number(subitem.querySelector("input").value) + 1
                        for (let i of listaCarrito){
                            if (i.nombre == subitem.querySelector("h5").textContent){
                                i.cantidad += 1
                                subitem.querySelector(".producto-subtotal").textContent = `Subtotal: $${i.subtotal()}`
                                calcularTotalCarrito(listaCarrito)
                                sessionStorage.setItem("listaCarrito", JSON.stringify(listaCarrito))
                            }
                        }
                    }
                }
                mostrarAlert({
                    type: "info-alert", 
                    text: "UNIDAD AGREGADA"
                })
            }
        })
    }
}

let generarFecha = () => {
    let DateTime = luxon.DateTime
    let fecha = DateTime.now()
    return fecha.toLocaleString(DateTime.DATE_FULL) + " - " + fecha.toLocaleString(DateTime.TIME_24_WITH_SECONDS)
}
export let generarComprobante = () => {
    document.querySelector(".total").addEventListener("click", () => {
    document.querySelector(".carrito-container").style.display = "none"
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
    popUp.querySelector(".pop-up-header").querySelector("h5").textContent = "COMPROBANTE"
    popUp.querySelector(".pop-up-body").innerHTML = ""
    let div = document.createElement("div")
    div.setAttribute("class", "comprobante")
    popUp.querySelector(".pop-up-body").append(div)
    popUp.querySelector(".pop-up-body").querySelector(".comprobante").innerHTML = `
    <h5>Ideal</h5>
    <div>Compra Online</div>
    <div>Ticket Nº: #########</div>
    <div class="fecha">${generarFecha()}</div>
    <div class="columnas">PRODUCTO <span>SUBTOTAL</span></div>
    `
    for (let i of listaCarrito){
        popUp.querySelector(".pop-up-body").querySelector(".comprobante").innerHTML += `
            <p class="item">${i.nombre} x${i.cantidad} <span>$${i.subtotal()}</span></p>
        `
    }
    popUp.querySelector(".pop-up-body").querySelector(".comprobante").innerHTML += `
    <p class="ticket-total">${document.querySelector(".total").textContent}</p>
    <p>¡GRACIAS POR SU COMPRA!</p>
    `
    mostrarAlert({
        type: "check-alert", 
        text: "PEDIDO RECIBIDO"
    })
    })
}