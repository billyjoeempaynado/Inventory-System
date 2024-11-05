import { navigateTo, router } from './index.js';

document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners for SPA navigation
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  // Call the router function for the initial load
  router();
});