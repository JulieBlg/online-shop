"use strict";


//fonction qui permet de récupérer l'id dans l'url
$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

var i;
var idProduit = $.urlParam('id');
var produit = null;
var html ="";
var quantity = 0;
var beforeQuantity;

$(document).ready(function(){

	//on met à jour le badge du panier
	majCountPanier();


	//on récupère le produit grâce à son id en url et la fonction getProduct
	getProduct(idProduit).then(function(produit) {

		//si l'id donné est faux, la page affiche "non trouvé"
		if(produit==null){
			$("main").empty();
			$("main").html("<h1>Page non trouvée!</h1>");
		}
		//sinon, on affiche la page de produit
		else{
			//on remplit les "cases" avec les informations du produit
			$("#product-name").html(produit.name);
			$("#product-desc").html(produit.description);
			$("#product-image").attr("alt",produit.name);
			$("#product-image").attr("src","./assets/img/"+produit.image);
			$("#product-price strong").text(produit.price.toFixed(2).replace(".", ",") + "$");
			for(i=0;i<produit.features.length;i++){
				html = html + "<li>" + produit.features[i] + "</li>";
			}
			$("#product-features").html(html);
		}


		//lorsqu'on clique sur ajouter au panier
		$("form").submit(function(event){
			event.preventDefault();
			//on récupère la quantité de produit choisie
			quantity = Number($("#product-quantity").val());
			//on augmente le badge du panier
			incrementerPanier(quantity);
			majCountPanier();
			//si le produit n'est pas encore dans le panier
			if(getInLocalStorage("panier"+produit.id)==undefined){
				setInLocalStorage("panier"+produit.id, JSON.stringify({id:produit.id,name:produit.name,price:produit.price,quantity:quantity}));
			}
			//si le produit est déjà dans le panier, pour qu'on n'ait pas 2 fois le même produit en stockage
			else{
				beforeQuantity = JSON.parse(localStorage["panier"+produit.id]).quantity;
				setInLocalStorage("panier"+produit.id, JSON.stringify({id:produit.id,name:produit.name,price:produit.price,quantity: beforeQuantity + quantity}));
			}
			//on affiche un message de confirmation
			$("#dialog").css("visibility","visible").fadeIn().delay(4000).fadeOut(1000);
		});



	})

});
