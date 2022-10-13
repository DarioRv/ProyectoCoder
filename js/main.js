// MOSTRAR Y OCULTAR EL CARRITO
const CARRITO_ICONO = document.querySelector("#carrito-icono")
const CONTENEDOR_CARRITO = document.querySelector(".carrito-container")
const BTN_CERRAR_CARRITO = document.querySelector("#btn-cerrar-carrito")
CARRITO_ICONO.addEventListener("click", function(){
    if (CONTENEDOR_CARRITO.style.display == "flex"){
        CONTENEDOR_CARRITO.style.display = "none"
    }
    else{
        CONTENEDOR_CARRITO.style.display = "flex"
    }
})
BTN_CERRAR_CARRITO.addEventListener("click", function(){
    CONTENEDOR_CARRITO.style.display = "none"
})


// CREO UNA CLASE PARA MIS PRODUCTOS
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

// FUNCIÓN PARA IMPRIMIR MI ARRAY EN EL CARRITO
function imprimir(){
    const LISTA_CARRITO = CONTENEDOR_CARRITO.querySelector(".carrito-content").querySelector("ul")
    // LIMPIO EL CARRITO ANTIGUO PARA IMPRIMIR EL NUEVO
    LISTA_CARRITO.innerHTML = ""
    // IMPRIMO EL ARRAY
    for (let item of listaCarrito){
        LISTA_CARRITO.innerHTML += `
            <li>
                <div class="producto-deseado">
                    <div class="producto-img">
                        <img src="${item.imagen}" alt="">
                    </div>
                    <div class="producto-detalles">
                        <h5>${item.nombre}</h5>
                        <span>${item.precio}</span>
                    </div>
                    <div class="producto-cantidad">
                        <button class="btn-quitar">-</button>
                        <input type="text" value="${item.cantidad}">
                        <button class="btn-agregar">+</button>
                    </div>
                    <div class="producto-subtotal">Subtotal: $${item.subtotal()}</div>
                </div>
            </li>
        `
    }
    LISTA_CARRITO.innerHTML += `<button class="btn-vaciar-carrito">Vaciar Carrito</button>`
    LISTA_CARRITO.innerHTML += `<button class="total"></button>`
    /*
    Boton vaciar carrito -> quito todos mis objetos del array y cambio la estructura
    html por un mensaje de contenido vacío
    */
    const MENSAJE_CONTENIDO_VACIO = "Tu carrito está vacío"
    const BTN_VACIAR_CARRITO = CONTENEDOR_CARRITO.querySelector(".btn-vaciar-carrito")
    BTN_VACIAR_CARRITO.addEventListener("click", function(){
        while(listaCarrito.pop() != undefined){
            listaCarrito.pop()
        }
        listaCarrito.pop()
        LISTA_CARRITO.innerHTML = `<p>${MENSAJE_CONTENIDO_VACIO}</p>`
        calcularTotal()
    })
}
// CALCULAR TOTAL DEL CARRITO
function calcularTotal(){
    let total = 0
    for (let item of listaCarrito){
        total += item.subtotal()
    }
    CONTENEDOR_CARRITO.querySelector(".total").style.display = "block"
    CONTENEDOR_CARRITO.querySelector(".total").textContent = `Total: $${total}`
}
// DETERMINAR LA EXISTENCIA DE UN OBJETO EN EL ARRAY
function determinarExistencia(lista, objeto){
    let existe = false
    for (let i of lista){
        if (i.nombre == objeto.nombre){
            existe = true
        }
    }
    return existe;
}
// CREO UN ARRAY PARA PODER GUARDAR LOS PRODUCTOS EN EL CARRITO
let listaCarrito =[]
// SELECCIONO TODOS MIS PRODUCTOS DE LA CARTELERA
const PRODUCTOS = document.querySelectorAll(".producto")
for (let item of PRODUCTOS){
    const BTN_PEDIR = item.querySelector(".btn-pedir")
    BTN_PEDIR.addEventListener("click", function(){
        let imagenProducto = item.querySelector(".imagen-producto").querySelector("img").getAttribute("src")
        let nombreProducto = item.querySelector(".nombre-producto").textContent
        let precioProducto = item.querySelector(".precio-producto").textContent
        let cantidadProducto = 1
        let nuevoProducto = new Producto(imagenProducto, nombreProducto, precioProducto, cantidadProducto)
        console.log(determinarExistencia(listaCarrito, nuevoProducto))
        if (determinarExistencia(listaCarrito, nuevoProducto) == false){
            listaCarrito.push(nuevoProducto)
            sessionStorage.setItem("listaCarrito", JSON.stringify(listaCarrito))
            imprimir()
            calcularTotal()
            // AGREGAR EVENTO DE AGREGAR O QUITAR UNIDADES DE PRODUCTOS
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
                                    calcularTotal()
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
                            calcularTotal()
                            sessionStorage.setItem("listaCarrito", JSON.stringify(listaCarrito))
                        }
                    }
                })
            }
        }
        else{
            delete nuevoProducto
        }
    })
}