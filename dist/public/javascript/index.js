import {
  setActiveContentTableLink,
  createContentTableLinks,
  setActiveSidebarNavLink,
} from "./navLinks.js";

const locationEvent = new CustomEvent("updateActiveLink", {
  detail: location.pathname,
});

window.addEventListener("load", async () => {
  window.dispatchEvent(locationEvent);
});

window.addEventListener("updateActiveLink", (e) => {
  const navLinksContainer = document.querySelector("#nav-links-container > ul");
  if (!navLinksContainer) {
    const tableContentsContainer = document.querySelector(
      "#table-contents-container > ul"
    );
    createContentTableLinks(tableContentsContainer);
    return;
  }
  setActiveSidebarNavLink(navLinksContainer);
});

window.addEventListener("hashchange", () => setActiveContentTableLink());
