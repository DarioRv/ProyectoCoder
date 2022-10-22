const FORM = document.querySelectorAll("form")[2]
FORM.addEventListener("submit", (e) => {
    e.preventDefault()
    const DATOS = Object.fromEntries(new FormData(e.target))
    console.log(DATOS)
    sessionStorage.getItem("form", JSON.stringify(DATOS))
    mostrarAlert("check-alert", "PRONTO RECIBIRÁS NOTICIAS NUESTRAS")
})