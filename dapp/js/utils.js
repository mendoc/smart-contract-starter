let Utils = {

}

export const message = {
    erreur: {
        install_metamask: `Prière d'installer l'extention MetaMask et actualisez la page. <a href="https://metamask.io/download/" target="_blank">https://metamask.io/download</a>`,
        adresse_contrat_absente: "Veuillez renseigner l'adresse du contrat",
        abi_contrat_absent: "Veuillez renseigner l'ABI du contrat",
        adresse_contrat_invalide: "L'adresse du contrat est invalide",
        fonction_absente: "Veuillez renseigner une fonction du contrat à exécuter",
        fonction_invalide: "La fonction demandée n'existe pas dans le contrat", 
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

export const afficherRetour = (msg) => {
    byId("retour").text(msg)
    $(".alert-light").show()
}

export const masquerRetour = () => {
    byId("retour").text("")
    $(".alert-light").hide()
}

export const texte = (id, txt) => {
    byId(id).html(txt)
}

export const valeur = (id, v) => {
    byId(id).val(v)
}

export default Utils;