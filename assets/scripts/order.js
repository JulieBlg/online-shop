"use strict";

//cette fonction permet d'ajouter une méthode de validation pour la date d'expiration
jQuery.validator.addMethod("expiry", function(value, element) {
  return this.optional( element ) || /^(((0[123456789]|10|11|12)([/])([0-9][0-9])))$/.test( value );
}, "La date d'expiration de votre carte de crédit est invalide.");

$(document).ready(function(){

  //on met à jour le badge du panier
  majCountPanier();

  //on valide le formulaire avec les différentes contraintes
  $("#order-form").validate({
    rules: {
      phone: {
        required: true,
        phoneUS: true
      },
      firstname: {
        required:true,
        minlength:2
      },
      lastname: {
        required:true,
        minlength:2
      },
      email: {
        required:true,
        email:true
      },
      creditcard: {
        required:true,
        creditcard:true
      },
      creditcardexpiry: {
        required:true,
        expiry:true
      }
    }

  });


  //on garde en mémoire les informations du formulaire dont on a besoin
  $("#first-name").on('input',function(){
    setInLocalStorage("prenom",$("input[name='firstname']").val());
  });

  $("#last-name").on('input',function(){
    setInLocalStorage("nom",$("input[name='lastname']").val());
  });




});
