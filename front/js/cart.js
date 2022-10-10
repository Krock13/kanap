// Récupération de la liste des produits
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(cartList => {
        generateCartCard(cartList);
        totalArticlesAndPrice(cartList);
    })
    .catch(err => console.log("error", err));

// Lecture du localStorage
const list = localStorage.getItem("cartStorage");
let listJson = JSON.parse(list);

// Fonction pour la création des fiches produits
function generateCartCard(cartList) {
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
        imageElement.src = cart.imageUrl;
        imageElement.setAttribute("alt", cart.altTxt);
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
        nomElement.innerText = cart.name;
        descriptionContentElement.appendChild(nomElement);

        // Création d'une balise p avec la couleur du produit / Rattachement à la div .cart__item__content__description
        const colorElement = document.createElement("p");
        colorElement.innerText = item.color;
        descriptionContentElement.appendChild(colorElement);

        // Création d'une balise p avec le prix du produit / Rattachement à la div .cart__item__content__description
        const priceElement = document.createElement("p");
        priceElement.innerText = cart.price;
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
        quantityElement.innerText = item.quantity;
        quantitySettingsElement.appendChild(quantityElement);

        // Création d'un input avec sa classe et ses attributs / Rattachement à la div .cart__item__content__settings__quantity
        const quantityItemElement = document.createElement("input");
        quantityItemElement.classList.add("itemQuantity");
        quantityItemElement.setAttribute("type", "number");
        quantityItemElement.setAttribute("name", "itemQuantity");
        quantityItemElement.setAttribute("min", "1");
        quantityItemElement.setAttribute("max", "100");
        quantityItemElement.setAttribute("value", item.quantity);
        quantitySettingsElement.appendChild(quantityItemElement);

        // Création d'une div pour le bouton supprimer / Rattachement à la div .cart__item__content__settings
        const deleteSettingsElement = document.createElement("div");
        deleteSettingsElement.classList.add("cart__item__content__settings__delete");
        settingsContentElement.appendChild(deleteSettingsElement);

        // Création d'une balise p pour le bouton supprimer / Rattachement à la div .cart__item__content__settings__delete
        const deleteItemElement = document.createElement("p");
        deleteItemElement.classList.add("deleteItem");
        deleteItemElement.innerText = "Supprimer";
        deleteSettingsElement.appendChild(deleteItemElement);
        
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

// Fonction pour afficher la quantité totale et le prix total du panier
function totalArticlesAndPrice(cartList) {

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

////////////////
// FORMULAIRE //
////////////////

// Récupération du bouton "commander" dans le DOM
const order = document.getElementById("order");

// Regex pour le prénom, le nom et la ville
const simpleRgex = /^\S[a-z- 'éèçêùà]*$/i;
// Regex pour l'adresse
const addressRGEX = /^\S[0-9a-z- 'éèçêùà]*$/i;
// Regex pour l'email
const emailRGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

// Récupération des éléments du DOM dédiés aux entrées utilisateur
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

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
function validateFirstName(firstName) {
    if (simpleRgex.test(firstName)) {
        firstNameErrorMsg.innerText = "";
        return true;
    }else {
        firstNameErrorMsg.innerText = "Le prénom que vous avez entré n'est pas valide";
        return false;
    }
};

// Vérification de la validité du nom
function validateLastName(lastName) {
    if (simpleRgex.test(lastName)) {
        lastNameErrorMsg.innerText = "";
        return true;
    }else {
        lastNameErrorMsg.innerText = "Le nom que vous avez entré n'est pas valide";
        return false;
    }
};

// Vérification de la validité de l'adresse
function validateAddress(address) {
    if (addressRGEX.test(address)) {
        addressErrorMsg.innerText = "";
        return true;
    }else {
        addressErrorMsg.innerText = "L'adresse que vous avez entré n'est pas valide";
        return false;
    }
};

// Vérification de la validité de la ville
function validateCity(city) {
    if (simpleRgex.test(city)) {
        cityErrorMsg.innerText = "";
        return true;
    }else {
        cityErrorMsg.innerText = "La ville que vous avez entré n'est pas valide";
        return false;
    }
};

// Vérification de la validité de l'email
function validateEmail(email) {
    if (emailRGEX.test(email)) {
        emailErrorMsg.innerText = "";
        return true;
    }else {
        emailErrorMsg.innerText = "L'adresse email que vous avez entré n'est pas valide";
        return false;
    }
};

// Fonction qui créé les éléments à envoyer à l'api (contact + id produits)
order.addEventListener("click", function(e) {
    e.preventDefault();
    // Si l'un des champs du formulaire n'est pas valide, la fonction s'arrete
    if (
        validateFirstName(firstName.value) == false ||
        validateLastName(lastName.value) == false ||
        validateAddress(address.value) == false ||
        validateCity(city.value) == false ||
        validateEmail(email.value) == false
        ) {
        return;
    } else {
        let contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        };
        const list = localStorage.getItem("cartStorage");
        let listJson = JSON.parse(list);
        const products = listJson.map(list => list.id);
        let jsonCart = JSON.stringify({contact, products});
        send(jsonCart);
    }
});

// Fonction pour envoyer le contact et l'id des produits à l'API afin de recevoir un numero de confirmation + redirection vers la page confirmation.html
function send(jsonCart) {
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: jsonCart
    })
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(data) {
        localStorage.clear();
        let confirmationUrl = "./confirmation.html?id=" + data.orderId;
        window.location.href = confirmationUrl;
    })
    .catch(err => console.log("error", err));
};