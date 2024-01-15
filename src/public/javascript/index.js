const locationEvent = new CustomEvent("updateActiveLink", {
  detail: location.pathname,
});

function resetLinks(links) {
  return links.map((link) => {
    if (link.classList.contains("selected-link")) {
      link.classList.remove("selected-link");
      return link;
    }
    return link;
  });
}
function setActiveLink(navLinksContainer) {
  if (!navLinksContainer) return;
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

function setActiveTableContentsLink(tableContentsContainer) {
  const h1List = Array.from(document.querySelectorAll("h1"));
  const tableContentsLinks = Array.from(tableContentsContainer);

  const newH1List = h1List.filter((element, i) => {
    if (i !== 0) {
      const content = element.textContent;
      element.setAttribute("id", content);
      return element;
    }
  });
  for (let i = 0; i < newH1List.length; i++) {
    const newLink = document.createElement("a");
    const liContainer = document.createElement("li");
    newLink.href = `#${newH1List[i].textContent}`;
    newLink.textContent = newH1List[i].textContent;

    liContainer.appendChild(newLink);
    tableContentsContainer.appendChild(liContainer);
  }

  console.log(newH1List);
}

window.addEventListener("updateActiveLink", (e) => {
  const navLinksContainer = document.querySelector("#nav-links-container > ul");

  if (!navLinksContainer) {
    const tableContentsContainer = document.querySelector(
      "#table-contents-container > ul"
    );
    setActiveTableContentsLink(tableContentsContainer);

    return;
  }
  setActiveLink(navLinksContainer);
});
window.addEventListener("load", () => window.dispatchEvent(locationEvent));

// get all of the h1s and add an id that corresponds to their content
// and get all link from the navLinks
// (maybe nest h2s under h1 links)
// take their textContent
// assign their id values to that text content
// assign the href value to that text content
