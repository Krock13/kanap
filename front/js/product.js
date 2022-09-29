// Recuperation de l'URL pour isolé l'id du produit
const params = (new URL(document.location)).searchParams;
const id = params.get("_id");

// Récupération du produit selon l'id
let apiUrl = "http://localhost:3000/api/products/" + id;
fetch(apiUrl)
    .then(res => res.json())
    .then(productId => {
        productDetails(productId);
    })
    .catch(err => console.log("error", err));

// Fonction pour la création de la fiches produit
function productDetails(productId) {
    // Récupération de l'élément du DOM qui accueillera l'image du produit
    const imageItem = document.querySelector(".item__img");

    // Création de l’élément img
    const imageElement = document.createElement("img");

    // Accès à la fiche produit pour configurer la source de l’image
    imageElement.src = productId.imageUrl;
    imageElement.setAttribute("alt", productId.altTxt);

    // Rattachement de l’image à item_img
    imageItem.appendChild(imageElement);

    // Idem pour le nom, le prix et la description

    const nameItem = document.getElementById("title");
    const nameElement = productId.name;
    nameItem.innerText =  nameElement;

    const priceItem = document.getElementById("price");
    const priceElement = productId.price;
    priceItem.innerText =  priceElement;

    const descriptionItem = document.getElementById("description");
    const descriptionElement = productId.description;
    descriptionItem.innerText =  descriptionElement;

    // Couleurs
    const colorsItem = document.getElementById("colors");
    const colorsElement = productId.colors;

    // Boucle pour inserer chaque couleur dans une option
    for (let i in colorsElement) {
        const color = document.createElement("option");
        color.setAttribute("value", colorsElement[i]);
        color.innerText =  colorsElement[i];
        colorsItem.appendChild(color);
    }
};

// Récupération de l'élément sur lequel on veut détecter le clic
const elt = document.getElementById("addToCart");

// Enregistre le panier dans le localStorage
function stringifyLocalStorage(e) {
    let cartRec = JSON.stringify(e);
    localStorage.setItem("cartStorage", cartRec);
}

// Lit le panier enregistré dans le localStorage
function parseLocalStorage() {
    let list = localStorage.getItem("cartStorage");
    let listJson = JSON.parse(list);
}

// S'active lorsque l'utilisateur clique sur "ajouter au panier"
elt.addEventListener("click", function() {
    const quantityItem = document.getElementById("quantity").value;
    const colorChoice = document.getElementById("colors").value;
    let cart = {
        id: id,
        quantity: quantityItem,
        color: colorChoice
    }
    // Vérification d'erreur de la part de l'utilisateur
    if (cart.quantity < 0 || cart.quantity > 100 || cart.color == "") {
        console.log("Error");
    } else {
        newCart();
    }

    // Vérification de l'existance d'un panier dans le localStorage - sinon création de ce dernier
    function newCart() {
        if (localStorage.hasOwnProperty("cartStorage")) {
        recNewCart();
        } else {
            let arrayStorage = [];
            arrayStorage.push(cart);
            stringifyLocalStorage(arrayStorage);
        }
    }

    // Vérification de l'absence d'un objet similaire dans le panier pour l'ajouter à la liste - sinon incremente l'objet similaire
    function recNewCart() {
        let list = localStorage.getItem("cartStorage");
        let listJson = JSON.parse(list);
        const existingObject = (element) => element.id == cart.id && element.color == cart.color;
        if (listJson.findIndex(existingObject) == -1) {
            listJson.push(cart);
            stringifyLocalStorage(listJson);
        } else {
            let arrayID = (listJson.findIndex(existingObject))
            listJson[arrayID].quantity = Number(listJson[arrayID].quantity) + Number(cart.quantity);
            stringifyLocalStorage(listJson);
        };
    };
});
