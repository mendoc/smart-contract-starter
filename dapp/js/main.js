import { ethers } from "./ethers-5.1.esm.min.js";
import { message, byId, masquerErreur, afficherErreur, texte } from "./utils.js"
import App from "./App.js";

$(document).ready(async () => {
    byId("app-nom").text(App.nom);
    $("title").text(`${App.nom} - ${App.description}`);

    // On vérifie l'installation de MetaMask
    if (!window.ethereum) {
        afficherErreur(message.erreur.install_metamask)
        return
    }

    // ######################  Récupération des éléments ##########################
    const btnConnexion = byId("btn-connexion")

    // ######################  Evènements  ##########################

    // Au clic du bouton de connexion
    // On demande la permission au Wallet MetaMask
    btnConnexion.click(auth)

    // ######################  Traitemant principal #############################

    // Initialisation de l'application
    await App.init(window.ethereum)

    if (App.comptes.length === 0) {
        btnConnexion.show()
    } else {
        auth();
    }

    // ######################  Fonctions ##################################
    function auth() {
        masquerErreur()
        btnConnexion.desactiver();

        App.connecterWallet(async (comptes) => {
            // On cache le bouton de connexion
            btnConnexion.hide()

            chargerInfos()
        }, (msg) => {
            afficherErreur(msg)
            btnConnexion.activer();
        })
    }

    async function chargerInfos() {
        const adresse = await App.signer.getAddress();
        const balance = await App.signer.getBalance();
        const chaineId = await App.signer.getChainId();
        const transNbre = await App.signer.getTransactionCount();

        texte("adresse", adresse)
        texte("balance", ethers.utils.formatEther(balance).toString() + " ETH")
        texte("chaine-id", chaineId)
        texte("trans-nbre", transNbre)

        byId("compte-infos").show()
    }
})