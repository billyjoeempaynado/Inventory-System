// Auto-hide the alert after 5 seconds
setTimeout(function() {
 var loginSuccessAlert = document.getElementById('loginSuccessAlert');
 if (loginSuccessAlert) {
   loginSuccessAlert.style.display = 'none';
 }
}, 3000);


 // Auto-hide error alert after 3 seconds
 setTimeout(function() {
   var loginErrorAlert = document.getElementById('loginErrorAlert');
   if (loginErrorAlert) {
     loginErrorAlert.style.display = 'none';
   }
 }, 3000);


  // Auto-hide error alert after 3 seconds
  setTimeout(function() {
   var registerErrorAlert = document.getElementById('registerErrorAlert');
   if (registerErrorAlert) {
     registerErrorAlert.style.display = 'none';
   }
 }, 10000);


