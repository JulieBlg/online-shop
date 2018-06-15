"use strict";

var i;
var r;
var nbProduitsPanier;
var produit;
var price;
var quantity;
var totalProductPrice;
var name;
var html;
var total = 0;
var liste = new Array();
var nom;
var quantite;
var id;
var prix;
var txt;
var prixTotalProduit;

$(document).ready(function(){

    nbProduitsPanier = getInLocalStorage("nbElementsPanier"); 

    //on met à jour le badge du panier
    majCountPanier();

    //initialisation du panier
    //si on n'a rien dans le panier, on affiche "aucun produit"
    if (getInLocalStorage("nbElementsPanier")==undefined){
      viderPanier();
    }
    else if(getInLocalStorage("nbElementsPanier")==0){
      $("article").empty();
      $("article").html("<h1>Panier</h1><p>Aucun produit dans le panier.</p>");
    }
    //sinon, on créé la variable pour le prix total
    else{
      if (getInLocalStorage("nbElementsPanier")==undefined){
        setInLocalStorage("totalPanier", 0);
      }
      //on regarde pour tous les produits
      for(i=0;i<=13;i++){
        //si le produit est présent dans le local storage, on l'ajoute à la liste des produits choisis
        if(getInLocalStorage("panier"+i)!=undefined){
          liste[i] = JSON.parse(getInLocalStorage("panier"+i));
        }
      }
      //on trie la liste dans l'ordre alphabétique
      liste = triAZ(liste);
      //on crée les lignes du tableau
      creationTableauPanier(liste);
      //on calcule le prix total puis on l'affiche
      majTotalPanier(liste);
    }


    //quand on clique sur le bouton de suppression d'un article
    $(".remove-item-button").on("click", function(){
      //une boite de dialogue s'affiche pour vérifier qu'on veut supprimer
      r = confirm("Voulez-vous supprimer le produit du panier ?");
      if (r == true) {
        txt = "oui";
      } else {
        txt = "non";
      }
      if (txt=="oui"){
        //on récupère les infos du produit en les cherchant dans la ligne dans laquelle il y a le bouton
        nom = $(this).parent().next().children().contents().text();
        quantite = $(this).parent().next().next().next().children().children(2).text();
        prix= $(this).parent().next().next().next().next().text();
        //on met à jour le badge du panier
        decrementerPanier(Number(quantite));
        majCountPanier();
        //on met à jour la base de données et la variable liste en supprimant le produit
        for (i=0;i<liste.length;i++){
          if(liste[i]!=undefined){
            if(nom==liste[i].name){
              id = liste[i].id;
              deleteInLocalStorage("panier"+id);
              liste.splice($.inArray(liste[i], liste),1);
              $(this).parent().parent().remove();
              setInLocalStorage("totalPanier", Number(localStorage["totalPanier"]) - Number(produit.price));
            }
          }
        }
        //si on n'a plus rien dans le panier, on affiche panier vide
        if(getInLocalStorage("nbElementsPanier")==0){
          $("article").empty();
          $("article").html("<h1>Panier</h1><p>Aucun produit dans le panier.</p>");
          setInLocalStorage("totalPanier",0);
        }
        //sinon, on met à jour le prix total du panier
        else{
          majTotalPanier(liste);
        }
      }
    });


    //lorsqu'on appuie sur le bouton de diminution de quantité
    $(".remove-quantity-button").click(function(){
      //on récupère les information du produit
      quantite = Number($(this).parent().next().text());
      nom = $(this).parent().parent().parent().prev().prev().text();
      quantite = quantite - 1;
      $(this).parent().next().text(Number(quantite));
      //on met à jour le badge du panier
      decrementerPanier(1);
      majCountPanier();
      //on met à jour les informations du produit dans la base de données
      for (i=0;i<liste.length;i++){
        if(liste[i]!=undefined){
          if(nom==liste[i].name){
            liste[i].quantity = quantite;
            setInLocalStorage("panier"+liste[i].id, JSON.stringify({id:liste[i].id,name:liste[i].name,price:liste[i].price,quantity:quantite}));
            setInLocalStorage("totalPanier", Number(localStorage["totalPanier"]) - Number(liste[i].price));
            prixTotalProduit = Number(quantite*liste[i].price).toFixed(2).replace(".", ",");
          }
        }
      }
      //on met à jour le prix total du panier
      $(this).parent().parent().parent().next().text(prixTotalProduit);
      majTotalPanier(liste);
      //si on n'a plus qu'un exemplaire du produit, on empèche le clic sur le bouton
      if (quantite==1){
        $(this).prop("disabled", true);
      }
    });



    //même fonction que précédemment pour l'augmentation de quantité d'un produit
    $(".add-quantity-button").click(function(){
      quantite = Number($(this).parent().prev().text());
      nom= $(this).parent().parent().parent().prev().prev().text();
      quantite = quantite + 1;
      $(this).parent().prev().text(Number(quantite));
      incrementerPanier(1);
      majCountPanier();
      for (i=0;i<liste.length;i++){
        if(liste[i]!=undefined){
          if(nom==liste[i].name){
            liste[i].quantity = quantite;
            setInLocalStorage("panier"+liste[i].id, JSON.stringify({id:liste[i].id,name:liste[i].name,price:liste[i].price,quantity:quantite}));
            setInLocalStorage("totalPanier", Number(localStorage["totalPanier"]) + Number(liste[i].price));
            prixTotalProduit = Number(quantite*liste[i].price).toFixed(2).replace(".", ",");
          }
        }
      }
      $(this).parent().parent().parent().next().text(prixTotalProduit);
      majTotalPanier(liste);

      $(this).parent().prev().prev().children().prop("disabled", false);
    });



    //quand on clique sur le bouton de suppression de tout le panier
    $("#remove-all-items-button").on("click", function(){
      //on affiche une boite de dialogue
      var r = confirm("Voulez-vous supprimer tous les produits du panier ?");
      if (r == true) {
        txt = "oui";
      } else {
        txt = "non";
      }
      if (txt=="oui"){
        //on supprime tous les produits de la base de données
        for (i=0;i<liste.length;i++){
          if(liste[i]!=undefined){
            id = liste[i].id;
            localStorage.removeItem("panier"+id);
            liste.splice($.inArray(liste[i], liste),1);
          }
        }
        //on affiche la page de panier vide
        $("article").empty();
        $("article").html("<h1>Panier</h1><p>Aucun produit dans le panier.</p>");
        setInLocalStorage("totalPanier", 0);
        viderPanier();
        majCountPanier();

      }


    });


});


function creationTableauPanier(liste){
  console.log("creation tableau panier");
  for(i=0;i<liste.length;i++){
    if(liste[i]!=undefined){
      produit = liste[i];
      price = produit.price;
      quantity = produit.quantity;
      name = produit.name;
      totalProductPrice = Number(price)*Number(quantity);
      if (quantity==1){
        html = "<tr><td><button title='Supprimer' class='remove-item-button'><i class='fa fa-times'></i></button></td><td><a href='./product?id="+produit.id+".html'>"+name+"</a></td><td>"+price.toFixed(2).replace(".", ",")+"&thinsp;$</td><td><div class='row'><div class='col'><button title='Retirer' class='remove-quantity-button' disabled=''><i class='fa fa-minus'></i></button></div><div class='quantity'>"+quantity+"</div><div class='col'><button title='Ajouter' class='add-quantity-button'><i class='fa fa-plus'></i></button></div></div></td><td class='price'>"+totalProductPrice.toFixed(2).replace(".", ",")+"&thinsp;$</td></tr>"
        $("tbody").append(html);
      }
      else{
        html = "<tr><td><button title='Supprimer' class='remove-item-button'><i class='fa fa-times'></i></button></td><td><a href='./product?id="+produit.id+".html'>"+name+"</a></td><td>"+price.toFixed(2).replace(".", ",")+"&thinsp;$</td><td><div class='row'><div class='col'><button title='Retirer' class='remove-quantity-button'><i class='fa fa-minus'></i></button></div><div class='quantity'>"+quantity+"</div><div class='col'><button title='Ajouter'class='add-quantity-button'><i class='fa fa-plus'></i></button></div></div></td><td class='price'>"+totalProductPrice.toFixed(2).replace(".", ",")+"&thinsp;$</td></tr>"
        $("tbody").append(html);
      }


    }
  }
}


//cette fonction permet de mettre à jour le prix total du panier
function majTotalPanier(liste){
  setInLocalStorage("totalPanier", 0);
  for(i=0;i<liste.length;i++){
    if(liste[i]!=undefined){
      setInLocalStorage("totalPanier", Number(localStorage["totalPanier"])+(Number(liste[i].price)*Number(liste[i].quantity)));
      $("#total-amount").html(Number(localStorage["totalPanier"]).toFixed(2).replace(".", ","));
    }
  }
}
