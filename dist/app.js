"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = require("express-handlebars");
const app = (0, express_1.default)();
const port = 3000;
const posts = require("./routes/post");
const category = require("./routes/category");
app.engine("handlebars", (0, express_handlebars_1.engine)());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.listen(port, () => {
    console.log("Listening at port: " + port);
});
app.use("/", category);
app.use("/:category", posts);
