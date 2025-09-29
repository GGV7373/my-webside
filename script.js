// script.js

// Wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".search-bar");
    const searchInput = searchForm.querySelector("input");

    // Example: items we want to search through
    const searchableItems = document.querySelectorAll("h2, h3, p");

    searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
      // If empty, reset all items
      searchableItems.forEach(item => {
        item.parentElement.style.display = "block";
      });
      return;
    }

    // Loop through items and show/hide based on match
    searchableItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.parentElement.style.display = "block";
      } else {
        item.parentElement.style.display = "none";
      }
    });
  });
});
