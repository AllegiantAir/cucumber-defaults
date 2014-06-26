document.addEventListener('DOMContentLoaded', function() {
  setTimeout(
    function() {
      var elementDivToBeDisplayed = document.getElementById('divToBeDisplayed');
      elementDivToBeDisplayed.style.display = 'block';
    },
    1000
  );

  setTimeout(
    function() {
      var elementSplash = document.getElementById('splash-destroy');
      elementSplash.style.display="none";
    },
    500
  );
});