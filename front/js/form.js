// Regex pour le prénom, le nom et la ville
const simpleRgex = /^\S[a-z- 'éèçêùà]*$/i;
// Regex pour l'adresse
const addressRGEX = /^\S[0-9a-z- 'éèçêùà]*$/i;
// Regex pour l'email
const emailRGEX = /^[\w-\.]+@([\w-]+\.)+[a-z]{2,}$/g;

// Récupération des éléments du DOM dédiés aux messages d'erreur pour le formulaire
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

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

// Fonction pour envoyer le contact et l'id des produits à l'API afin de recevoir un numéro de confirmation + redirection vers la page confirmation.html
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

// Fonction de vérification et de validation du formulaire
export function form(listJson) {
    // Récupération du bouton "Commander" dans le DOM
    const order = document.getElementById("order");

    // Récupération des éléments du DOM dédiés aux entrées utilisateur
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const email = document.getElementById("email");

    // Fonction qui crée les éléments à envoyer à l'api (contact + id produits)
    order.addEventListener("click", function(e) {
        e.preventDefault();
        // Si l'un des champs du formulaire n'est pas valide, la fonction s'arrête
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
            const products = listJson.map(list => list.id);
            let jsonCart = JSON.stringify({contact, products});
            send(jsonCart);
        };
    });
};