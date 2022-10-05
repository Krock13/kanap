// Récupération de la liste des produits
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(cartList => {
        generateCartCard(cartList);
        totalArticlesAndPrice(cartList);
    })
    .catch(err => console.log("error", err));

// Fonction pour la création des fiches produits
function generateCartCard(cartList) {
    // Récupération du localStorage
    const list = localStorage.getItem("cartStorage");
    let listJson = JSON.parse(list);

    for (const item of listJson) {
        // Recherche dans cartList(API) l'element correspondant à l'id de l'item
        const cart = cartList.find(cart => cart._id === item.id);

        // Récupération de l'élément qui accueillera le/les articles du panier
        const itemsCart = document.getElementById("cart__items");

        // Création d'une balise article avec sa classe et ses attributs / Rattachement à la section #cart__items
        const itemCartElement = document.createElement("article");
        itemCartElement.classList.add("cart__item");
        itemCartElement.dataset.id = item.id;
        itemCartElement.dataset.color = item.color;
        itemsCart.appendChild(itemCartElement);

        // Création d'une div pour l'image du produit / Rattachement à la balise article
        const imageItemElement = document.createElement("div");
        imageItemElement.classList.add("cart__item__img");
        itemCartElement.appendChild(imageItemElement);

        // Création d'une balise image  / Rattachement à la div .cart__item__img
        const imageElement = document.createElement("img");
        imageElement.src = cart.imageUrl;  // A voir
        imageElement.setAttribute("alt", cart.altTxt);  // A voir
        imageItemElement.appendChild(imageElement);

        // Création d'une div pour les élément du produit / Rattachement à la balise article
        const contentItemElement = document.createElement("div");
        contentItemElement.classList.add("cart__item__content");
        itemCartElement.appendChild(contentItemElement);

        // Création d'une div pour la description du produit / Rattachement à la div .cart__item__content
        const descriptionContentElement = document.createElement("div");
        descriptionContentElement.classList.add("cart__item__content__description");
        contentItemElement.appendChild(descriptionContentElement);

        // Création d'un titre h2 avec le nom du produit / Rattachement à la div .cart__item__content__description
        const nomElement = document.createElement("h2");
        nomElement.innerText = cart.name;  // A voir
        descriptionContentElement.appendChild(nomElement);

        // Création d'une balise p avec la couleur du produit / Rattachement à la div .cart__item__content__description
        const colorElement = document.createElement("p");
        colorElement.innerText = item.color;  // A voir
        descriptionContentElement.appendChild(colorElement);

        // Création d'une balise p avec le prix du produit / Rattachement à la div .cart__item__content__description
        const priceElement = document.createElement("p");
        priceElement.innerText = cart.price;  // A voir
        descriptionContentElement.appendChild(priceElement);

        // Création d'une div pour les paramètres du produit / Rattachement à la div .cart__item__content
        const settingsContentElement = document.createElement("div");
        settingsContentElement.classList.add("cart__item__content__settings");
        contentItemElement.appendChild(settingsContentElement);

        // Création d'une div pour la quantité du produit / Rattachement à la div .cart__item__content__settings
        const quantitySettingsElement = document.createElement("div");
        quantitySettingsElement.classList.add("cart__item__content__settings__quantity");
        settingsContentElement.appendChild(quantitySettingsElement);

        // Création d'une balise p avec la quantité du produit / Rattachement à la div .cart__item__content__settings__quantity
        const quantityElement = document.createElement("p");
        quantityElement.innerText = item.quantity;  // A voir
        quantitySettingsElement.appendChild(quantityElement);

        // Création d'un input avec sa classe et ses attributs / Rattachement à la div .cart__item__content__settings__quantity
        const quantityItemElement = document.createElement("input");
        quantityItemElement.classList.add("itemQuantity");
        quantityItemElement.setAttribute("type", "number");
        quantityItemElement.setAttribute("name", "itemQuantity");
        quantityItemElement.setAttribute("min", "1");
        quantityItemElement.setAttribute("max", "100");
        quantityItemElement.setAttribute("value", item.quantity); // A voir!
        quantitySettingsElement.appendChild(quantityItemElement);
        // Ajout de la possibilité de modifier la quantité du produit
        quantityItemElement.addEventListener("change", function () {
            quantityElement.textContent = this.value;
            const existingObject = (element) => element.id == item.id && element.color == item.color;
            let arrayID = (listJson.findIndex(existingObject))
            listJson[arrayID].quantity = quantityItemElement.value;
            let cartRec = JSON.stringify(listJson);
            localStorage.setItem("cartStorage", cartRec);
            totalArticlesAndPrice(cartList);
        });

        // Création d'une div pour le bouton supprimer / Rattachement à la div .cart__item__content__settings
        const deleteSettingsElement = document.createElement("div");
        deleteSettingsElement.classList.add("cart__item__content__settings__delete");
        settingsContentElement.appendChild(deleteSettingsElement);

        // Création d'une balise p pour le bouton supprimer / Rattachement à la div .cart__item__content__settings__delete
        const deleteItemElement = document.createElement("p");
        deleteItemElement.classList.add("deleteItem");
        deleteItemElement.innerText = "Supprimer";
        deleteSettingsElement.appendChild(deleteItemElement);
        // Ajout de la possibilité de supprimer un produit
        deleteItemElement.addEventListener("click", function () {
            itemsCart.removeChild(itemCartElement)
            // Recherche dans listJson l'element correspondant et suppression
            const cartId = listJson.find(cart => cart.id === item.id);
            const cartColor = listJson.find(cart => cart.color === item.color);
            const existingObject = (element) => element.id == cartId.id && element.color == cartColor.color;
            let arrayID = (listJson.findIndex(existingObject))
            listJson.splice(arrayID ,1)
            let cartRec = JSON.stringify(listJson);
            localStorage.setItem("cartStorage", cartRec);
            totalArticlesAndPrice(cartList);
        });
    };
}

function totalArticlesAndPrice(cartList) {
    // Récuperation du localStorage
    const list = localStorage.getItem("cartStorage");
    let listJson = JSON.parse(list);

    // Récupération des elements du DOM pour la quantité et le prix
    const totalQuantity = document.getElementById("totalQuantity");
    const totalPrice = document.getElementById("totalPrice");

    // Calcul de la quantité et insertion dans le DOM
    const quantity = listJson.map(list => Number(list.quantity));
    totalQuantity.innerText = quantity.reduce((a, b) => a + b, 0);

    // Prix total
    let priceList = [];

    for (const item of listJson) {
        const cartId = listJson.find(cart => cart.id === item.id);
        const existingObject = (element) => element._id == cartId.id;
        const arrayID = (cartList.findIndex(existingObject));
        const price = cartList[arrayID].price * item.quantity;
        priceList.push(price);
        totalPrice.innerText = priceList.reduce((a, b) => a + b, 0);
    };
};

// Récupération du bouton "commander" dans le DOM
let order = document.getElementById("order");

// Regex pour le prénom, le nom et la ville
const simpleRgex = /^\S[a-z- 'éèçêùà]*$/i;
// Regex pour l'adresse
const addressRGEX = /^\S[0-9a-z- 'éèçêùà]*$/i;
// Regex pour l'email
const emailRGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

// Récupération des éléments du DOM dédiés aux entrées utilisateur
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");

// Récupération des éléments du DOM dédiés aux messages d'erreur pour le formulaire
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

// Fonction pour autoriser ou empecher l'envoie de la commande
function disableSubmit(disabled) {
    if (disabled) {
      document
        .getElementById("order")
        .setAttribute("disabled", true);
    } else {
      document
        .getElementById("order")
        .removeAttribute("disabled");
    }
};

// Vérification de la validité du prénom
firstName.addEventListener("input", function(e) {
    if (simpleRgex.test(e.target.value)) {
        firstNameErrorMsg.innerText = "";
        disableSubmit(false);
    }else {
        firstNameErrorMsg.innerText = "Le prénom que vous avez entré n'est pas valide";
        disableSubmit(true);
    }
});

// Vérification de la validité du nom
lastName.addEventListener("input", function(e) {
    if (simpleRgex.test(e.target.value)) {
        lastNameErrorMsg.innerText = "";
        disableSubmit(false);
    }else {
        lastNameErrorMsg.innerText = "Le nom que vous avez entré n'est pas valide";
        disableSubmit(true);
    }
});

// Vérification de la validité de l'adresse
address.addEventListener("input", function(e) {
    if (addressRGEX.test(e.target.value)) {
        addressErrorMsg.innerText = "";
        disableSubmit(false);
    }else {
        addressErrorMsg.innerText = "L'adresse que vous avez entré n'est pas valide";
        disableSubmit(true);
    }
});

// Vérification de la validité de la ville
city.addEventListener("input", function(e) {
    if (simpleRgex.test(e.target.value)) {
        cityErrorMsg.innerText = "";
        disableSubmit(false);
    }else {
        cityErrorMsg.innerText = "La ville que vous avez entré n'est pas valide";
        disableSubmit(true);
    }
});

// Vérification de la validité de l'email
email.addEventListener("input", function(e) {
    if (emailRGEX.test(e.target.value)) {
        emailErrorMsg.innerText = "";
        disableSubmit(false);
    }else {
        emailErrorMsg.innerText = "L'adresse email que vous avez entré n'est pas valide";
        disableSubmit(true);
    }
});
