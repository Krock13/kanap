// Récupération de la liste des produits
 fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(productList => {
        generateProductsCard(productList);
    })
    .catch(err => console.log("error", err));

// Fonction pour la création des fiches produits
function generateProductsCard(productList) {
    for (let i in productList) {
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".items");

        // Création des éléments du DOM
        const linkElement = document.createElement("a");
        const productElement = document.createElement("article");
        const imageElement = document.createElement("img");
        const nomElement = document.createElement("h3");
        const descriptionElement = document.createElement("p");

        // Affichage du nom et de la description du produit
        nomElement.innerText = productList[i].name;
        descriptionElement.innerText = productList[i].description;

        // Création de l'URL qui servira à product.js
        linkElement.href = "product.html" + "?_id=" + productList[i]._id;
        
        // Définition des attributs de l'image du produit
        imageElement.src = productList[i].imageUrl;
        imageElement.setAttribute("alt", productList[i].altTxt);

        // Attachement des éléments enfants
        sectionFiches.appendChild(linkElement);
        linkElement.appendChild(productElement);
        productElement.appendChild(imageElement);
        productElement.appendChild(nomElement);
        productElement.appendChild(descriptionElement);
    };
};