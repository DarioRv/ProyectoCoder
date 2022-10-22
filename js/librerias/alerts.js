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
    /*
    Tipos de alerts: 
     - "info-alert" => Alerta de información
     - "check-alert" => Alerta de confirmación
     - "error-alert" => Alerta de error crítico
    */
    let contenedor = document.createElement("div")
    contenedor.setAttribute("class", `${tipoAlert}`)
    contenedor.innerHTML += `${mensajeAlert}  <span>${setIcon(tipoAlert)}</span>`
    if (document.querySelector(".alerts") == null){
        document.querySelector("body").innerHTML += `<div class="alerts"></div>`
    }
    document.querySelector(".alerts").appendChild(contenedor)
    document.querySelectorAll(`.${tipoAlert}`)[cantidadAlerts].style.top = `${positionTop}px`
    positionTop += 80
    cantidadAlerts += 1
    setTimeout(() => { 
        document.querySelector(".alerts").removeChild(contenedor)
        positionTop -= 80
        cantidadAlerts -= 1
    }, 4000)
}