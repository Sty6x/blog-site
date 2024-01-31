"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function interpolateString(postTitle, to) {
    let newTitle = "";
    for (let i = 0; i < postTitle.length; i++) {
        if (postTitle[i] == " ") {
            newTitle += to;
        }
        else {
            newTitle += postTitle[i];
        }
    }
    return newTitle;
}
exports.default = interpolateString;
