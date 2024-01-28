const locationEvent = new CustomEvent("updateActiveLink", {
  detail: location.pathname,
});

function interpolateHashedLinkTitle(linkTitle) {
  let newTitle = "";
  for (let i = 0; i < linkTitle.length; i++) {
    if (linkTitle[i] == "%" || linkTitle[i] == "2" || linkTitle[i] == "0") {
      newTitle += "";
      if (linkTitle[i] == "0") {
        newTitle += " ";
      }
    } else {
      newTitle += linkTitle[i];
    }
  }
  return newTitle;
}

function resetLinks(links) {
  return links.map((link) => {
    if (link.classList.contains("selected-link")) {
      link.classList.remove("selected-link");
      return link;
    }
    return link;
  });
}
function setLinkActive(links) {
  links.forEach((link) => {
    const anchorPath = link.children[0].href.substr(-location.pathname.length);
    const anchorHash = link.children[0].href.substr(-location.hash.length);
    console.log(anchorPath);
    if (anchorPath === location.pathname) {
      console.log(location.pathname);
      link.setAttribute("class", "selected-link");
      return;
    }
    if (location.hash[0] === "#") {
      if (location.hash === `${anchorHash}`) {
        link.setAttribute("class", "selected-link");
        return;
      }
    }
  });
}
function setActiveSidebarNavLink(navLinksContainer) {
  if (!navLinksContainer) return;
  const navLinks = Array.from(navLinksContainer.children);
  resetLinks(navLinks);
  setLinkActive(navLinks);
}

function setActiveContentTableLink() {
  const tableContentsContainer = document.querySelector(
    "#table-contents-container > ul"
  );
  const tableContentLinks = Array.from(tableContentsContainer.children);
  resetLinks(tableContentLinks);
  setLinkActive(tableContentLinks);
}

function createContentTableLinks(tableContentsContainer) {
  const h1List = Array.from(document.querySelectorAll("h1"));
  const newH1List = h1List.filter((header, i) => {
    if (i !== 0) {
      const content = header.textContent;
      header.setAttribute("id", content);
      return header;
    }
  });
  const newLinks = newH1List.map((header, i) => {
    const newLink = document.createElement("a");
    const liContainer = document.createElement("li");
    if (i == 0) {
      liContainer.setAttribute("class", "selected-link");
    }
    newLink.href = `#${header.textContent}`;
    newLink.textContent = header.textContent;

    liContainer.appendChild(newLink);
    tableContentsContainer.appendChild(liContainer);

    return liContainer;
  });
}

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
window.addEventListener("load", () => window.dispatchEvent(locationEvent));
window.addEventListener("hashchange", () => setActiveContentTableLink());
