const locationEvent = new CustomEvent("updateActiveLink", {
  detail: location.pathname,
});

function interpolateLinkTitle(linkTitle) {
  let newTitle = "";
  for (let i = 0; i < linkTitle.length; i++) {
    if (linkTitle[i] == "%20") {
      newTitle += " ";
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
  console.log(location.hash);
  links.forEach((link) => {
    const anchor = link.children[0].href.substr(-location.pathname.length);
    if (anchor === location.pathname) {
      console.log(location.pathname);
      link.setAttribute("class", "selected-link");
      return;
    }
    if (location.hash[0] === "#") {
      console.log("is hashed");
      console.log(interpolateLinkTitle(location.hash));
    }
  });
}
function setActiveSideNavLink(navLinksContainer) {
  if (!navLinksContainer) return;
  const navLinks = Array.from(navLinksContainer.children);
  const links = resetLinks(navLinks);
  setLinkActive(links);
}

function createContentTableLinks(tableContentsContainer) {
  const h1List = Array.from(document.querySelectorAll("h1"));
  const tableContentsLinks = Array.from(tableContentsContainer);

  const newH1List = h1List.filter((header, i) => {
    if (i !== 0) {
      const content = header.textContent;
      header.setAttribute("id", content);
      return header;
    }
  });
  const newLinks = newH1List.map((header) => {
    const newLink = document.createElement("a");
    const liContainer = document.createElement("li");
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
  setActiveSideNavLink(navLinksContainer);
});
window.addEventListener("load", () => window.dispatchEvent(locationEvent));
window.addEventListener("hashchange", () => {
  const tableContentsContainer = document.querySelector(
    "#table-contents-container > ul"
  );
  const tableContentLinks = Array.from(tableContentsContainer.children);
  setLinkActive(tableContentLinks);
});
