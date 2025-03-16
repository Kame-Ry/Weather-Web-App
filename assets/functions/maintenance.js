document.addEventListener("DOMContentLoaded", function () {
    const cacheBuster = `?v=${new Date().getTime()}`;
  
    function loadComponent(selector, file) {
      fetch(`/components/${file}${cacheBuster}`)
        .then(response => response.text())
        .then(data => {
          document.querySelector(selector).insertAdjacentHTML("beforeend", data);
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
    }
  
    loadComponent("#maintenance", "maintenance.html");
  });
  