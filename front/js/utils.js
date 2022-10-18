// Fonction d'enregistrement du panier dans le localStorage
export function recordCart(e) {
    let cartRec = JSON.stringify(e);
    localStorage.setItem("cartStorage", cartRec);
};

// Fonction de lecture du panier dans le localStorage
export function readListJson() {
    const list = localStorage.getItem("cartStorage");
    let listJson = JSON.parse(list);
    return listJson;
};