let Utils = {

}

export const message = {
    erreur: {
        install_metamask: `Prière d'installer l'extention MetaMask et actualisez la page. <a href="https://metamask.io/download/" target="_blank">https://metamask.io/download</a>`
    }
}

export const byId = (id) => {
    let el = $(`#${id}`)
    el.desactiver = () => {
        el.prop("disabled", true)
    }
    el.activer = () => {
        el.prop("disabled", false)
    }
    return el
}

export const afficherErreur = (msg) => {
    $(".alert-danger").html(msg)
    $(".alert-danger").show()
}

export const masquerErreur = () => {
    $(".alert-danger").html("")
    $(".alert-danger").hide()
}

export const texte = (id, txt) => {
    byId(id).html(txt)
}

export default Utils;