/* global $, Stripe */
//Document ready.
  $(document).on('turbolinks:load', function(){
  var proForm = $('#pro_form');
  var submitBtn = $('#form-submit-btn');
  //Set Stripe Public Key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content'));
  //When user clicks form submit button.
  submitBtn.click(function(event) {
    //Prevent the default submission behavior.
    event.preventDefault();
    
    //Collect the card fields.
    var ccNum = $('#card_number').val(), 
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
    
    //Send card info to Stripe.
    Stripe.createToken({
      number: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);
    
  });

  //Stripe will return a card token.
  //Inject card token as hidden field into form
  //Submit form to Rails app
});