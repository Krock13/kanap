// Récupération de l'URL pour isolé l'id du produit
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

// Boucle pour insérer chaque couleur dans une option
function colorsOption (productId) {
    // Couleurs
    const colorsItem = document.getElementById("colors");
    const colorsElement = productId.colors;
    for (let i in colorsElement) {
        const color = document.createElement("option");
        color.setAttribute("value", colorsElement[i]);
        color.innerText =  colorsElement[i];
        colorsItem.appendChild(color);
    }
};

// Fonction pour la création de la fiche produit
function productDetails(productId) {
    // Récupération des éléments du DOM pour l'image, le titre, le prix et la description
    const imageItem = document.querySelector(".item__img");
    const nameItem = document.getElementById("title");
    const priceItem = document.getElementById("price");
    const descriptionItem = document.getElementById("description");

    // Création de l’élément "img" et de ses paramètres
    const imageElement = document.createElement("img");
    imageElement.src = productId.imageUrl;
    imageElement.setAttribute("alt", productId.altTxt);
    imageItem.appendChild(imageElement);

    // Définition du nom, du prix et de la description dans la page
    const nameElement = productId.name;
    nameItem.innerText =  nameElement;

    const priceElement = productId.price;
    priceItem.innerText =  priceElement;

    const descriptionElement = productId.description;
    descriptionItem.innerText =  descriptionElement;

    // Appel de la fonction pour les couleurs (ligne 15)
    colorsOption(productId);
};

// Fonction pour enregistrer le panier dans le localStorage
function stringifyLocalStorage(e) {
    let cartRec = JSON.stringify(e);
    localStorage.setItem("cartStorage", cartRec);
};

// Fonction de vérification de l'absence d'un objet similaire dans le panier pour l'ajouter à la liste - sinon incrémente l'objet similaire
function recNewCart(cart) {
    let list = localStorage.getItem("cartStorage");
    let listJson = JSON.parse(list);
    const existingObject = (element) => element.id == cart.id && element.color == cart.color;
    if (listJson.findIndex(existingObject) == -1) {
        listJson.push(cart);
        stringifyLocalStorage(listJson);
    } else {
        let arrayID = (listJson.findIndex(existingObject));
        listJson[arrayID].quantity = Number(listJson[arrayID].quantity) + Number(cart.quantity);
        stringifyLocalStorage(listJson);
    };
};

// Fonction de vérification de l'existence d'un panier dans le localStorage - sinon création de ce dernier
function newCart(cart) {
    if (localStorage.hasOwnProperty("cartStorage")) {
    recNewCart(cart);
    } else {
        let arrayStorage = [];
        arrayStorage.push(cart);
        stringifyLocalStorage(arrayStorage);
    }
};

// Récupération de l'élément sur lequel on veut détecter l'événement
const elt = document.getElementById("addToCart");

// S'active lorsque l'utilisateur clique sur "ajouter au panier"
elt.addEventListener("click", function() {
    const quantityItem = document.getElementById("quantity").value;
    const colorChoice = document.getElementById("colors").value;
    let cart = {
        id: id,
        quantity: quantityItem,
        color: colorChoice
    };
    // Vérification d'erreur de la part de l'utilisateur
    if (cart.quantity < 0 || cart.quantity > 100 || cart.color == "") {
        console.log("Cart quantity error");
    } else {
        newCart(cart);
    }
});