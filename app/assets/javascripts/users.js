/* global $, Stripe */
//Document ready.
  $(document).on('turbolinks:load', function(){
  var proForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');
  //Set Stripe Public Key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content'));
  //When user clicks form submit button.
  submitBtn.click(function(event) {
    //Prevent the default submission behavior.
    event.preventDefault();
    //Disable the buttom while processing
    submitBtn.val("Processing").prop('disabled', true);
    
    //Collect the card fields.
    var ccNum = $('#card_number').val(), 
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
    
    //Use Stripe JS Library to validate card fields
    var error = false;
    
    //Check card number
    if(!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The Credit Card Number is invalid');
    }
    
    //Check cvc number
    if(!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The CVC Number is invalid');
    }
    
    //Check expiration date
    if(!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('This card has expired.');
    }
    
    if(error) {
      //If there are card errors, don't send to Stripe and change the button back
      submitBtn.prop('disabled', false).val("Sign Up");
    }
    else {
      //Send card info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }

    
    return false;
  });

  //Stripe will return a card token.
  function stripeResponseHandler(status, response) {
    //Get token from response.
    var token = response.id;
    
    //Inject the card token into a hidden field in the pro form.
    proForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    
    //Submit form to Rails app.
    proForm.get(0).submit();
  }
});