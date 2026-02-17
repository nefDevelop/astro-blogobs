console.log("footer-dropdown.js file loaded and parsed.");
function setupFooterDropdown() {
  console.log("setupFooterDropdown called.");
  // If listeners are already attached by a previous run, do nothing.
  const existingButton = document.querySelector("#stats-dropdown-button[data-footer-dropdown-initialized]");
  if (existingButton) {
    console.log("Footer dropdown already initialized. Exiting.");
    return;
  }

  const button = document.getElementById("stats-dropdown-button");
  const menu = document.getElementById("stats-dropdown-panel");

  if (!button || !menu) {
    console.error("Footer dropdown button or menu not found. Button:", button, "Menu:", menu);
    return;
  }

  console.log("Button and menu found. Initializing.");
  // Mark as initialized
  button.dataset.footerDropdownInitialized = "true";

  const toggleDropdown = (e) => {
    console.log("toggleDropdown called");
    e.stopPropagation();
    const isCurrentlyClosed = menu.classList.contains("float-panel-closed");

    if (isCurrentlyClosed) {
      // Si está cerrado, ábrelo
      menu.classList.remove("float-panel-closed");
      menu.classList.add("float-panel-open");
      button.setAttribute("aria-expanded", "true");
    } else {
      // Si está abierto, ciérralo
      menu.classList.add("float-panel-closed");
      menu.classList.remove("float-panel-open");
      button.setAttribute("aria-expanded", "false");
    }
  };

  const closeDropdown = (e) => {
    // Solo cierra si está abierto (tiene float-panel-open) y el clic está fuera
    if (menu.classList.contains("float-panel-open") && !menu.contains(e.target) && !button.contains(e.target)) {
      console.log("closeDropdown called");
      menu.classList.add("float-panel-closed");
      menu.classList.remove("float-panel-open");
      button.setAttribute("aria-expanded", "false");
    }
  };
  console.log("Attaching event listeners to button:", button, "and document.");
  button.addEventListener("click", toggleDropdown);
  document.addEventListener("click", closeDropdown);

  // Astro's SPA navigation cleanup
  document.addEventListener(
    "astro:before-swap",
    () => {
      console.log("Cleaning up footer dropdown listeners before Astro swap.");
      if (button) {
        button.removeEventListener("click", toggleDropdown);
        delete button.dataset.footerDropdownInitialized;
      }
      document.removeEventListener("click", closeDropdown);
    },
    { once: true },
  );
}

// Run on initial load
console.log("Running initial setupFooterDropdown.");
setupFooterDropdown();

// Run after Astro's page swaps
console.log("Adding astro:after-swap listener for footer dropdown.");
document.addEventListener("astro:after-swap", setupFooterDropdown);
