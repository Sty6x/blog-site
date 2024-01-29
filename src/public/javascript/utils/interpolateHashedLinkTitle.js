export default function interpolateHashedLinkTitle(linkTitle) {
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
