// Récupération de la liste des produits
 fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(productList => {
        generateProductsCard(productList);
    })
    .catch(err => console.log("error", err));

// Fonction pour la création des fiches produits
function generateProductsCard(productList) {
    for (let i = 0; i < productList.length; i++) {
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".items");

        // Creation d'un élément lien
        const linkElement = document.createElement("a");
        // Recuperation de l'id du produit et ajout dans l'url pour utilisation par product.js
        const id = productList[i]._id;
        linkElement.href = "product.html" + "?_id=" + id;
        // Lien relié à items
        sectionFiches.appendChild(linkElement);

        // Création d’une balise dédiée à un canapé
        const productElement = document.createElement("article");

        // Création de l’élément img.
        const imageElement = document.createElement("img");
        // Accès à l’indice i de la liste produit pour configurer la source de l’image
        imageElement.src = productList[i].imageUrl;
        imageElement.setAttribute("alt", productList[i].altTxt);
        // Rattachement de l’image à productElement (la balise article)
        productElement.appendChild(imageElement);

        // Idem pour le lien, le nom et la description
        const nomElement = document.createElement("h3");
        nomElement.innerText = productList[i].name;
        productElement.appendChild(nomElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = productList[i].description;
        productElement.appendChild(descriptionElement);

        // Rattachement de la balise article à la section fiches
        linkElement.appendChild(productElement);
    }
};
