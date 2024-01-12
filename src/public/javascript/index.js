console.log("Hello World");

const locationEvent = new CustomEvent("updateActiveLink", {
  detail: location.pathname,
});

const navLinksContainer = document.querySelector("#nav-links-container > ul");

function resetLinks(links) {
  return links.map((link) => {
    if (link.classList.contains("selected-link")) {
      link.classList.remove("selected-link");
      return link;
    }
    return link;
  });
}
function setActiveLink() {
  const navLinks = Array.from(navLinksContainer.children);
  const links = resetLinks(navLinks);
  links.forEach((link) => {
    const anchor = link.children[0].href.substr(-location.pathname.length);
    if (anchor === location.pathname) {
      console.log(location.pathname);
      link.setAttribute("class", "selected-link");
      return;
    }
  });
}

window.addEventListener("updateActiveLink", (e) => {
  setActiveLink();
});
window.dispatchEvent(locationEvent);
