document.addEventListener("DOMContentLoaded", function () {
    const cacheBuster = `?v=${new Date().getTime()}`;
  
    function loadComponent(selector, file, isHead = false) {
      fetch(`/components/${file}${cacheBuster}`)
        .then(response => response.text())
        .then(data => {
          if (isHead) {
            document.head.innerHTML += data;
          } else {
            document.querySelector(selector).innerHTML = data;
          }
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
    }
  
    loadComponent("head", "head.html", true);
    loadComponent("#header", "header.html");
    loadComponent("#footer", "footer.html");
  });
  