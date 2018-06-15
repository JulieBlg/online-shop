"use strict";

var i;
var numero;
var nom;
var prenom;


$(document).ready(function(){

  //on récupère les noms et prénoms de l'utilisateur qu'on a stockés précédemment
  nom = getInLocalStorage("nom");
  prenom = getInLocalStorage("prenom");

  //si il n'y a pas eu de commandes avant, on créé la variable dans le local storage
  if(getInLocalStorage("nbCommandes")==undefined){
    setInLocalStorage("nbCommandes",1);
  }
  //si il y a déjà eu des commandes, on incrémente la variable
  else{
    setInLocalStorage("nbCommandes",Number(localStorage["nbCommandes"])+1);
  }

  //on supprime tous les items du panier
  for (i=0;i<localStorage.length;i++){
    if(getInLocalStorage("panier"+i)!=undefined){
      deleteInLocalStorage("panier"+i);
    }
  }

  //on met à jour les variables
  setInLocalStorage("totalPanier",0);
  setInLocalStorage("nbElementsPanier",0);
  majCountPanier();

  //on récupère le numéro de la commande
  numero = Number(getInLocalStorage("nbCommandes"));

  //on garde en mémoire la commande
  setInLocalStorage("commande"+numero,JSON.stringify({id:numero,nom:nom,prenom:prenom}));

  //on affiche les informations client et le numéro de commande
  $("#name").html("Votre commande est confirmée "+prenom+" "+nom+"!");
  $("#confirmation-number").html(getInLocalStorage("nbCommandes"));




});
