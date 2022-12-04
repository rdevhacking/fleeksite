if (window.ApplePaySession && ApplePaySession.supportsVersion(3) && ApplePaySession.canMakePayments()) {
    if (!window.ApplePaySession) {
        console.error('This device does not support Apple Pay');
    }

    if (!ApplePaySession.canMakePayments()) {
        console.error('This device is not capable of making Apple Pay payments');
    }

    braintree.client.create({
        authorization: 'CLIENT_AUTHORIZATION'
    }).then(function (clientInstance) {
        return braintree.applePay.create({
            client: clientInstance
        });
    }).then(function (applePayInstance) {
        const button = document.getElementById("applePayButton")
        button.onclick = function(){
            var paymentRequest = applePayInstance.createPaymentRequest({
                total: {
                  label: 'My Store',
                  amount: '19.99'
                },
              
                // We recommend collecting billing address information, at minimum
                // billing postal code, and passing that billing postal code with
                // all Apple Pay transactions as a best practice.
                requiredBillingContactFields: ["postalAddress"]
              });
              console.log(paymentRequest.countryCode);
              console.log(paymentRequest.currencyCode);
              console.log(paymentRequest.merchantCapabilities);
              console.log(paymentRequest.supportedNetworks);
              
              var session = new ApplePaySession(3, paymentRequest);

              session.onvalidatemerchant = function (event) {
                applePayInstance.performValidation({
                  validationURL: event.validationURL,
                  displayName: 'RobbersStore'
                }).then(function (merchantSession) {
                  session.completeMerchantValidation(merchantSession);
                }).catch(function (validationErr) {
                  // You should show an error to the user, e.g. 'Apple Pay failed to load.'
                  console.error('Error validating merchant:', validationErr);
                  session.abort();
                });
              };

              session.onpaymentauthorized = function (event) {
                console.log("Congratulations you was robbed :D! NOW FUCK OFF!!! BITCH XDDD");
              
                applePayInstance.tokenize({
                  token: event.payment.token
                }).then(function (payload) {
                  // Send payload.nonce to your server.
                  console.log('nonce:', payload.nonce);
              
                  // If requested, address information is accessible in event.payment
                  // and may also be sent to your server.
                  console.log('billingPostalCode:', event.payment.billingContact.postalCode);
              
                  // After you have transacted with the payload.nonce,
                  // call `completePayment` to dismiss the Apple Pay sheet.
                  session.completePayment(ApplePaySession.STATUS_SUCCESS);
                }).catch(function (tokenizeErr) {
                  console.error('Error tokenizing Apple Pay:', tokenizeErr);
                  session.completePayment(ApplePaySession.STATUS_FAILURE);
                });
              };
              session.begin();
        };
    }).catch(function (err) {
        
    });
}


function NOW_PAY_WITH_APPLE_PAY() {

}