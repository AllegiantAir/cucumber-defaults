document.addEventListener('DOMContentLoaded', function() {
  setTimeout(
    function() {
      element = document.getElementById('divToBeDisplayed');
      element.style.display = 'block';
    },
    1500
  );
});