// Fonction d'enregistrement du panier dans le localStorage
export function recordCart(e) {
    let cartRec = JSON.stringify(e);
    localStorage.setItem("cartStorage", cartRec);
};