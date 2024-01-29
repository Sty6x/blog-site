import MarkdownIt from "markdown-it";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const markdown = new MarkdownIt("commonmark");

module.exports = {
  getReadTime: (blogContent: string): number => {
    const parseMarkdown = markdown.render(blogContent);
    const { document } = new JSDOM(parseMarkdown).window;
    const paragraphs = Array.from(document.querySelectorAll("p"));
    const averageWPM = 200;
    let unifiedText: string = "";
    let totalTextCount: number = 0;
    paragraphs.forEach((p: any) => {
      unifiedText += ` ${p.textContent}`;
    });
    for (let i = 0; i < unifiedText.length; i++) {
      if (unifiedText[i] === " ") {
        totalTextCount++;
      }
    }

    return Math.ceil(totalTextCount++ / averageWPM);
  },
  isArrayEmpty: (array: any) => {
    return array.length == 0 ? true : false;
  },
  interpolateURLString: (category: string, endpoint?: string): string => {
    if (!endpoint) {
      return `/${category}`;
    }
    return `/${category}/${endpoint}`;
  },
  extractElement: (blogContent: string): string => {
    const parseMarkdown = markdown.render(blogContent);
    const toDom = new JSDOM(parseMarkdown);
    const para = Array.from(toDom.window.document.querySelectorAll("p"));
    const [filteredPara]: any = para.filter((p: any) => {
      if (p.textContent.length > 200) return p;
    });
    return filteredPara.textContent;
  },
  checkEmptyString: (title: string) => {
    return title !== "" ? true : false;
  },
  interpolateTitle: (postTitle: string): string => {
    let newTitle: string = "";
    for (let i = 0; i < postTitle.length; i++) {
      if (postTitle[i] == "-") {
        newTitle += " ";
      } else {
        if (i === 0) {
          newTitle += postTitle[i].toLocaleUpperCase();
        } else {
          newTitle += postTitle[i];
        }
      }
    }
    return newTitle;
  },
  parseMarkdown: (blogContent: string): any => {
    const parseMarkdown = markdown.render(blogContent);
    const toDom = new JSDOM(parseMarkdown);
    return parseMarkdown;
  },
};
