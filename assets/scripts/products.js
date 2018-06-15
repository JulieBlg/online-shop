"use strict";

var i;
var produit;
var html;
var category = "";
var produit = null;
var html = "";
var value = "";
var nbPdts = 0;

//fonction qui cache/montre les produits quand on clique sur une catégorie
function triParCategorie(category){
  if (category == "Tous les produits"){
    $(".product[category!='"+category+"']").show();
  }
  else{
    if (category=="Appareils photo"){
      category = "cameras";
    }
    else if (category=="Consoles"){
      category = "consoles";
    }
    else if (category=="Écrans"){
      category = "screens";
    }
    else if (category=="Ordinateurs"){
      category = "computers";
    }
    $(".product[category!='"+category+"']").hide();
    $(".product[category='"+category+"']").show();
  }
  return category;
}

//cette fonction permet de créer et afficher la liste de produits à partir du json
function creationHTML(data){
  for (i=0; i<data.length; i++){
    setInLocalStorage("produit"+ i, JSON.stringify(data[i]));
    produit = JSON.parse(localStorage["produit"+i]);
    html = "<div class='product' category='"+ produit.category+"'><a href='./product.html?id="+produit.id+"' title='En savoir plus...'><h2>" + produit.name + "</h2><img alt='" + produit.name + "' src='./assets/img/" + produit.image + "'><p><small>Prix</small> " + produit.price.toFixed(2).replace(".",",") + "&thinsp;$</p></a></div>";
    $("#products-list").append(html);
  }
}



$(document).ready(function(){

  //le badge du panier est mis à jour
  majCountPanier();


  //on récupère la liste de produits dans le json qui est stockée dans data
  $.getJSON("./data/products.json", function (data) {

    //on initialise à l'affichage de tous les produits dans l'ordre croissant
    setInLocalStorage("nbProduitsTotal",data.length);
    data = triPrixCroissant(data);
    creationHTML(data);
    $("#products-count").append(getInLocalStorage("nbProduitsTotal").toString() + " produits");


    //fonction de clic sur un bouton de catégorie
    $("#product-categories button").click(function(){
        //on enleve le selected au bouton qui était selectionné précédemment
        $("#product-categories button").removeClass("selected");
        //le bouton sur lequel on a cliqué passe en selected
        $(this).addClass("selected");
        category = $(this).text();
        //on affiche seulement les produits de la catégorie sélectionnée
        category = triParCategorie(category);
        $("#products-count").empty();
        if (category == "Tous les produits"){
          nbPdts = getInLocalStorage("nbProduitsTotal");
        }
        else{
          nbPdts = $(".product[category='"+category+"']").length;
        }
        //on met à jour le compteur de produits
        $("#products-count").append(nbPdts.toString() + " produits");
    });


    //fonction de clic sur un bouton de critère
    $("#product-criteria button").click(function(){
        $("#product-criteria button").removeClass("selected");
        $(this).addClass("selected");
        value = $(this).text();
        $("#products-list").empty();
        if (value=="Prix (bas-haut)"){
            data = triPrixCroissant(data);
            creationHTML(data);
        }
        else if (value=="Prix (haut-bas)"){
            data = triPrixDecroissant(data);
            creationHTML(data);
        }
        else if (value=="Nom (A-Z)"){
            data = triAZ(data);
            creationHTML(data);
        }
        else if (value=="Nom (Z-A)"){
            data = triZA(data);
            creationHTML(data);
        }
        triParCategorie($("#product-categories button[class='selected']").text());
    });

  });

});
