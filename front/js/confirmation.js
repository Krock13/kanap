// Récupération de l'URL pour isolé l'id du produit
const params = (new URL(document.location)).searchParams;
const id = params.get("id");

// Insertion de l'id dans la page
document
    .getElementById("orderId")
    .innerText = id;