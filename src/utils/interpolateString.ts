export default function interpolateString(
  postTitle: string,
  to: string
): string {
  let newTitle: string = "";
  for (let i = 0; i < postTitle.length; i++) {
    if (postTitle[i] == " ") {
      newTitle += to;
    } else {
      newTitle += postTitle[i];
    }
  }
  return newTitle;
}
