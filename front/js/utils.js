// Fonction d'enregistrement du panier dans le localStorage
export function recordCart(e) {
    let cartRec = JSON.stringify(e);
    localStorage.setItem("cartStorage", cartRec);
};

// Lecture du localStorage
const list = localStorage.getItem("cartStorage");
let listJson = JSON.parse(list);
export {listJson};
