"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_1 = __importDefault(require("markdown-it"));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const markdown = new markdown_it_1.default("commonmark");
module.exports = {
    getReadTime: (blogContent) => {
        const parseMarkdown = markdown.render(blogContent);
        const { document } = new JSDOM(parseMarkdown).window;
        const paragraphs = Array.from(document.querySelectorAll("p"));
        const averageWPM = 200;
        let unifiedText = "";
        let totalTextCount = 0;
        paragraphs.forEach((p) => {
            unifiedText += ` ${p.textContent}`;
        });
        for (let i = 0; i < unifiedText.length; i++) {
            if (unifiedText[i] === " ") {
                totalTextCount++;
            }
        }
        return Math.ceil(totalTextCount++ / averageWPM);
    },
    isArrayEmpty: (array) => {
        return array.length == 0 ? true : false;
    },
    interpolateURLString: (category, endpoint) => {
        if (!endpoint) {
            return `/${category}`;
        }
        return `/${category}/${endpoint}`;
    },
    extractElement: (blogContent) => {
        const parseMarkdown = markdown.render(blogContent);
        const toDom = new JSDOM(parseMarkdown);
        const para = Array.from(toDom.window.document.querySelectorAll("p"));
        const [filteredPara] = para.filter((p) => {
            if (p.textContent.length > 200)
                return p;
        });
        return filteredPara.textContent;
    },
    checkEmptyString: (title) => {
        return title !== "" ? true : false;
    },
    interpolateTitle: (postTitle) => {
        let newTitle = "";
        for (let i = 0; i < postTitle.length; i++) {
            if (postTitle[i] == "-") {
                newTitle += " ";
            }
            else {
                if (i === 0) {
                    newTitle += postTitle[i].toLocaleUpperCase();
                }
                else {
                    newTitle += postTitle[i];
                }
            }
        }
        return newTitle;
    },
    parseMarkdown: (blogContent) => {
        const parseMarkdown = markdown.render(blogContent);
        const toDom = new JSDOM(parseMarkdown);
        return parseMarkdown;
    },
};
