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
let vaciarCarrito = (LISTA_CARRITO_HTML_CONTEXT, listaCarrito) => {
    const MENSAJE_CONTENIDO_VACIO = "Tu carrito está vacío"
    const BTN_VACIAR_CARRITO = CONTENEDOR_CARRITO.querySelector(".btn-vaciar-carrito")
    BTN_VACIAR_CARRITO.addEventListener("click", function(){
        while(listaCarrito.pop() != undefined){
            listaCarrito.pop()
        }
        listaCarrito.pop()
        calcularTotalCarrito(listaCarrito)
        mostrarCantidadArticulosCarrito(listaCarrito)
        LISTA_CARRITO_HTML_CONTEXT.innerHTML = `<p>${MENSAJE_CONTENIDO_VACIO}</p>`
        sessionStorage.removeItem("listaCarrito")
        mostrarAlert("check-alert", "SE QUITARON TODOS LOS PRODUCTOS")
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
    LISTA_CARRITO.innerHTML += `<button class="total" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>`
    vaciarCarrito(LISTA_CARRITO, listaCarrito)
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
let recuperarDatosListaCarrito = (datosCarritoSessionStorage, listaCarrito) => {
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
let mostrarCartelInformacion = () => {
    const CARTEL_INFORMACION = document.querySelector(".info-alert")
    CARTEL_INFORMACION.style.display = "flex"
    setTimeout(() => { CARTEL_INFORMACION.style.display = "none" }, 1000)
}
let agregarProductosAlCarrito = (listaCarrito, PRODUCTOS_DISPONIBLES) => {
    for (let item of PRODUCTOS_DISPONIBLES){
        const BTN_PEDIR = item.querySelector(".btn-pedir")
        BTN_PEDIR.addEventListener("click", () => {
            let nuevoProducto = crearObjetoProducto(item)
            if (determinarExistencia(listaCarrito, nuevoProducto) == false){
                listaCarrito.push(nuevoProducto)
                mostrarAlert("info-alert", "PRODUCTO AGREGADO")
                //mostrarCartelInformacion()
                sessionStorage.setItem("listaCarrito", JSON.stringify(listaCarrito))
                imprimirHTMLListaCarrito()
                calcularTotalCarrito(listaCarrito)
                mostrarCantidadArticulosCarrito(listaCarrito)
                controlDeUnidades(listaCarrito)
            }
            else{
                mostrarAlert("error-alert", "EL PRODUCTO YA ESTA AGREGADO")
                delete nuevoProducto
            }
        })
    }
}
let setIcon = (alertType) => {
    let icon = String()
    if (alertType == "info-alert"){
        icon = `<i class="fa-sharp fa-solid fa-circle-info"></i>`
    }
    else if (alertType == "check-alert"){
        icon = `<i class="fa-solid fa-circle-check"></i>`
    }
    else if (alertType == "error-alert"){
        icon = `<i class="fa-solid fa-circle-xmark"></i>`
    }
    else{
        icon = `<i class="fa-solid fa-triangle-exclamation"></i>`
    }
    return icon
}
let positionTop = 60
let cantidadAlerts = 0
let mostrarAlert = (tipoAlert, mensajeAlert) => {
    console.log(cantidadAlerts)
    /*
    Tipos de alerts: 
     - "info-alert" => Alerta de información
     - "check-alert" => Alerta de confirmación
     - "error-alert" => Alerta de error crítico
    */
    let contenedor = document.createElement("div")
    contenedor.setAttribute("class", `${tipoAlert}`)
    contenedor.innerHTML += `${mensajeAlert}  <span>${setIcon(tipoAlert)}</span>`
    document.querySelector(".alerts").appendChild(contenedor)
    document.querySelectorAll(`.${tipoAlert}`)[cantidadAlerts].style.top = `${positionTop}px`
    positionTop += 80
    cantidadAlerts += 1
    console.log(cantidadAlerts)
    setTimeout(() => { 
        document.querySelector(".alerts").removeChild(contenedor)
        positionTop -= 80
        cantidadAlerts -= 1
    }, 4000)
}