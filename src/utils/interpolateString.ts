export default function interpolateString(postTitle: string): string {
  let newTitle: string = "";
  for (let i = 0; i < postTitle.length; i++) {
    if (postTitle[i] == " ") {
      newTitle += "-";
    } else {
      newTitle += postTitle[i];
    }
  }
  return newTitle;
}
