document.addEventListener("DOMContentLoaded", function () {
    console.log("tags.js loaded successfully");

    const urlParams = new URLSearchParams(window.location.search);
    let selectedTag = urlParams.get("tag");

    waitForPosts(() => {
        generateTagList();
        if (selectedTag) {
            console.log(`Tag found in URL: ${selectedTag}`);
            filterProjects(decodeURIComponent(selectedTag));
            highlightActiveTag(selectedTag);
        }
    });

    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("tag")) {
            const clickedTag = event.target.dataset.tag;
            if (!clickedTag) return;

            if (selectedTag === clickedTag) {
                console.log(`Deselecting tag: ${clickedTag} - Showing all projects`);
                window.location.href = "/pages/projects.html";
            } else {
                console.log(`Redirecting to: /pages/projects.html?tag=${clickedTag}`);
                window.location.href = `/pages/projects.html?tag=${encodeURIComponent(clickedTag)}`;
            }
        }
    });
});

function waitForPosts(callback) {
    const checkInterval = setInterval(() => {
        const posts = document.querySelectorAll(".post-entry");
        if (posts.length > 0) {
            clearInterval(checkInterval);
            console.log("Posts loaded, applying filters...");
            callback();
        }
    }, 500);
}

function generateTagList() {
    console.log("Generating tag list...");

    const allTagsContainer = document.getElementById("all-tags-container");
    if (!allTagsContainer) {
        console.warn("No tag container found! Tags won't be dynamically generated.");
        return;
    }

    const allTags = new Set();
    document.querySelectorAll(".post-entry").forEach(post => {
        const postTags = post.dataset.tags ? post.dataset.tags.split(", ") : [];
        postTags.forEach(tag => allTags.add(tag.trim()));
    });

    if (allTags.size === 0) {
        console.warn("No tags found in posts.");
        return;
    }

    allTagsContainer.innerHTML = "";
    allTags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.classList.add("tag");
        tagElement.dataset.tag = tag;
        tagElement.textContent = tag;
        allTagsContainer.appendChild(tagElement);
    });

    console.log("Tags generated:", [...allTags]);
}

function filterProjects(selectedTag) {
    console.log(`Filtering projects for tag: ${selectedTag}`);

    const posts = document.querySelectorAll(".post-entry");
    if (posts.length === 0) {
        console.warn("No projects found on this page!");
        return;
    }

    let found = false;
    posts.forEach(post => {
        const postTags = post.dataset.tags ? post.dataset.tags.toLowerCase().split(", ") : [];
        if (postTags.includes(selectedTag.toLowerCase())) {
            post.style.display = "block";
            found = true;
        } else {
            post.style.display = "none";
        }
    });

    if (!found) {
        console.warn(`No projects matched tag: ${selectedTag}`);
    } else {
        console.log(`Showing projects with tag: ${selectedTag}`);
    }

    highlightActiveTag(selectedTag);

    const paginationContainer = document.querySelector(".pagination");
    if (paginationContainer) {
        paginationContainer.style.display = found ? "none" : "flex";
    }
}

function highlightActiveTag(selectedTag) {
    console.log(`Highlighting active tag: ${selectedTag}`);

    document.querySelectorAll(".tag").forEach(tag => {
        if (tag.dataset.tag.toLowerCase() === selectedTag.toLowerCase()) {
            tag.classList.add("active");
        } else {
            tag.classList.remove("active");
        }
    });
}
