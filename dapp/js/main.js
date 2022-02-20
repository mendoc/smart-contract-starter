import { ethers } from "./ethers-5.1.esm.min.js";
import { message, byId, masquerErreur, afficherErreur, afficherRetour, texte, masquerRetour } from "./utils.js"
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
    const btnCharger = byId("btn-charger")
    const btnExecuter = byId("btn-executer")
    const listeFonctions = byId("contrat-fonction")

    // ######################  Traitemant principal #############################

    // Initialisation de l'application
    await App.init(window.ethereum)

    if (App.comptes.length === 0) {
        btnConnexion.show()
    } else {
        auth();
    }

    // ######################  Evènements  ##########################

    // Au clic du bouton de connexion
    // On demande la permission au Wallet MetaMask
    btnConnexion.click(auth)
    btnCharger.click(chargerContrat)
    btnExecuter.click(executerFonction)
    listeFonctions.change(e => {
        byId("contrat-params").val("")
    })

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

    function chargerContrat() {
        masquerErreur()
        masquerRetour()
        const contratAdresse = byId("contrat-adresse").val()
        const contratABI = byId("contrat-abi").val()

        if (!contratAdresse) {
            afficherErreur(message.erreur.adresse_contrat_absente)
            return
        }

        if (!ethers.utils.isAddress(contratAdresse)) {
            afficherErreur(message.erreur.adresse_contrat_invalide)
            return
        }

        if (!contratABI) {
            afficherErreur(message.erreur.abi_contrat_absent)
            return
        }

        try {
            const contrat = nouveauContrat()
            byId("contrat-fonction").empty()
            Object.keys(contrat).forEach(k => {
                if (k.includes('(')) {
                    let fonc = k.substring(0, k.indexOf("("))
                    byId("contrat-fonction").append(`<option value="${fonc}">${k}</option>`)
                    btnExecuter.show()
                    byId("contrat-fonction").activer()
                    byId("contrat-params").activer()
                }
            })
        } catch (err) {
            afficherErreur(err.message)
        }
    }

    function executerFonction() {
        masquerErreur()
        masquerRetour()
        const contratFonction = byId("contrat-fonction").val()
        const contratParams = byId("contrat-params").val()

        let params = []

        if (contratParams) {
            params = contratParams.split(",")
        }

        params = params.map(p => {
            p = p.trim()
            return p
        })

        const contrat = nouveauContrat()
        afficherRetour("Transacrtion en cours ...")
        btnExecuter.desactiver()
        contrat[`${contratFonction}`].apply(null, params).then((ret) => {
            console.log(typeof ret)
            if (ret.hash) {
                App.provider.waitForTransaction(ret.hash).then((transaction) => {
                    chargerInfos()
                    afficherRetour(JSON.stringify(transaction, null, 4))
                    btnExecuter.activer()
                })
            } else {
                switch (typeof ret) {
                    case 'string':
                        afficherRetour(ret)
                        break
                    case 'object':
                        afficherRetour(JSON.stringify(ret, null, 4))
                        break
                    default:
                        afficherRetour(ret)
                        break
                }
                btnExecuter.activer()
            }
        }).catch(err => {
            afficherErreur(err.message)
            masquerRetour()
            btnExecuter.activer()
        })
    }

    function nouveauContrat() {
        const contratAdresse = byId("contrat-adresse").val()
        const contratABI = byId("contrat-abi").val()
        return new ethers.Contract(contratAdresse, contratABI, App.signer)
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
        byId("contrat").show()
    }
})