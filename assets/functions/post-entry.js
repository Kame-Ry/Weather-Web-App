import postFiles from "/assets/functions/Project-Links.js";

console.log("post-entry.js loaded!");
console.log("Loaded post files:", postFiles);

document.addEventListener("DOMContentLoaded", function () {
    const cacheBuster = `?v=${new Date().getTime()}`;
    const postsPerPage = 5;
    let currentPage = 1;

    function loadAllPosts(callback) {
        console.log("Loading ALL posts into the DOM first...");
        const container = document.querySelector(".widget-container");
        if (!container) {
            console.error("Widget container not found!");
            return;
        }
        container.innerHTML = "";

        postFiles.forEach(post => {
            const filePath = `/components/article-links/${post.file}${cacheBuster}`;
            console.log(`Fetching: ${filePath}`);

            fetch(filePath)
                .then(response => response.ok ? response.text() : Promise.reject(`Failed to load ${post.file} (Status: ${response.status})`))
                .then(data => {
                    container.insertAdjacentHTML("beforeend", data);
                })
                .catch(error => console.error(error));
        });

        setTimeout(() => {
            console.log("All posts are now in the DOM. Running callback...");
            if (typeof callback === "function") {
                callback();
            }
        }, 500);
    }

    function updatePagination() {
        const paginationContainer = document.querySelector(".pagination");
        if (!paginationContainer) {
            console.error("Pagination container not found!");
            return;
        }
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(postFiles.length / postsPerPage);
        if (totalPages <= 1) {
            paginationContainer.style.display = "none";
            return;
        } else {
            paginationContainer.style.display = "flex";
        }

        if (currentPage > 1) {
            const prevBtn = document.createElement("button");
            prevBtn.textContent = "← Previous";
            prevBtn.classList.add("pagination-btn");
            prevBtn.onclick = () => {
                currentPage--;
                paginatePosts();
            };
            paginationContainer.appendChild(prevBtn);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.classList.add("pagination-btn");
            if (i === currentPage) {
                pageBtn.classList.add("active");
            }
            pageBtn.onclick = () => {
                currentPage = i;
                paginatePosts();
            };
            paginationContainer.appendChild(pageBtn);
        }

        if (currentPage < totalPages) {
            const nextBtn = document.createElement("button");
            nextBtn.textContent = "Next →";
            nextBtn.classList.add("pagination-btn");
            nextBtn.onclick = () => {
                currentPage++;
                paginatePosts();
            };
            paginationContainer.appendChild(nextBtn);
        }
    }

    function paginatePosts() {
        console.log(`Paginating posts - Showing page ${currentPage}`);
        const allPosts = document.querySelectorAll(".post-entry");
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;

        allPosts.forEach((post, index) => {
            if (index >= startIndex && index < endIndex) {
                post.style.display = "block";
            } else {
                post.style.display = "none";
            }
        });

        updatePagination();
    }

    loadAllPosts(() => {
        paginatePosts();
    });
});
