"use strict";

/******************************************** EN-TETE **************************************************/

//fonction d'incrément du nb d'elts de notre panier, plutot que d'intervenir directement sur la variable au besoin
function incrementerPanier(increment) {
  if(Number.isInteger(increment)) {
    localStorage['nbElementsPanier'] = Number(localStorage['nbElementsPanier']) + increment;
  } else {
    alert("Erreur dans l'incrément");
  }
}

//pareil, en décrément
function decrementerPanier(increment) {
  if(Number.isInteger(increment)) {
    if(Number(localStorage['nbElementsPanier']) - increment < 0) {
      localStorage['nbElementsPanier'] = 0;
    } else {
      localStorage['nbElementsPanier'] = Number(localStorage['nbElementsPanier']) - increment;
    }
  } else {
    alert("Erreur dans l'incrément");
  }
}

//fonction de mise à jour du compteur de produits du panier
function majCountPanier(){
  var cercleEltsPanier = document.getElementsByClassName('count')[0];
  var nbEltsPanier = getInLocalStorage("nbElementsPanier");
  if(nbEltsPanier > 0) {
    //met à jour la bulle rouge du nb d'elements dans le paniers
    cercleEltsPanier.innerText = nbEltsPanier;
    $( ".shopping-cart .count" ).css({ visibility : 'visible' });
  } else if (nbEltsPanier == 0) {
    //enlève la bulle rouge si 0 elt
    $( ".shopping-cart .count" ).css({ visibility : 'hidden' });
  } else {
    //renvoi d'Erreur
    alert("Erreur : Panier négatif");
    $( ".shopping-cart .count" ).css({ visibility : 'hidden' });
  }
}


/********************************************* PANIER *********************************************/
//fonction pour vider le panier (que le nb d'elts pour l'instant)
function viderPanier() {
  localStorage['nbElementsPanier'] = 0;
}

//on créé automatiquement cette variable pour qu'elle soit toujours présente
if (getInLocalStorage("nbElementsPanier")==undefined){
  localStorage["nbElementsPanier"]=0;
}


/********************************************* LISTE DES PRODUITS *********************************************/
function triAZ(tab){
  tab.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  return tab;
}

function triPrixCroissant(tab){
  tab.sort(function(a, b) {
    return parseFloat(a.price) - parseFloat(b.price);
  });
  return tab;
}

function triPrixDecroissant(tab){
  tab.sort(function(a, b) {
    return parseFloat(a.price) - parseFloat(b.price);
  });
  return tab.reverse();
}

function triAZ(tab){
  tab.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  return tab;
}

function triZA(tab){
  tab.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  return tab.reverse();
}

var products;
function getProducts() {
  if (!products) {
    products = $.get("./data/products.json");
  }
  return products;
}

function getProduct(productId) {
  return getProducts().then(function(products) {
    return products.find(function(product) {
      return product.id == productId;
    })
  })
}


/**************************************** SHARED ********************************************/

function getInLocalStorage(key){
  return localStorage[key];
}

function setInLocalStorage(key, value){
  localStorage[key] = value;
}

function deleteInLocalStorage(key){
  localStorage.removeItem(key);
}
