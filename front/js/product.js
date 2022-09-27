// Recuperation de l'URL pour isolé l'id du produit
let params = (new URL(document.location)).searchParams;
let id = params.get("_id");

