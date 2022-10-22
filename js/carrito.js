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

const PRODUCTOS_DISPONIBLES = document.querySelectorAll(".producto")
let datosCarritoSessionStorage = sessionStorage.getItem("listaCarrito")
let listaCarrito = []
recuperarDatosListaCarrito(datosCarritoSessionStorage, listaCarrito)
agregarProductosAlCarrito(listaCarrito, PRODUCTOS_DISPONIBLES)
