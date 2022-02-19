import { ethers } from "./ethers-5.1.esm.min.js";

const App = {
    nom: "Smart Contract Starter",

    description: "Projet exemple",

    provider: null,

    signer: null,

    comptes: null,

    init: async (ethereum) => {
        // Récupération du provider
        App.provider = new ethers.providers.Web3Provider(ethereum)

        // Récupération des comptes gérés
        App.comptes = await App.provider.listAccounts()
    },

    connecterWallet: (cb, cbErreur) => {
        App.provider.send("eth_requestAccounts", []).then((comptes) => {
            App.signer = App.provider.getSigner();
            cb(comptes)
        }).catch((err) => {
            cbErreur(`Erreur ${err.code} : ${err.message}`)
        });
    }
}

export default App;