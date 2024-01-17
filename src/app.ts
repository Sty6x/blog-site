import express, { NextFunction } from "express";
import { ExpressHandlebars, engine, create } from "express-handlebars";
import { Application, Request, Response } from "express-serve-static-core";
import mongoose from "mongoose";
import path from "path";
import { Post } from "./model/postModel";
import asyncHandler from "./utils/asyncHandler";
import CustomError from "./utils/CustomError";
import MarkdownIt from "markdown-it";
import interpolateString from "./utils/interpolateString";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const markdown = new MarkdownIt("commonmark");
const cors = require("cors");
const app: Application = express();
const port = 3000;
const posts = require("./routes/post");
const category = require("./routes/category");
const apiIndex = require("./api/index");
const uri = `mongodb+srv://franzdiaz460:blog-site460@cluster0.jcvqazt.mongodb.net/blog-data?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
async function startMongooseServer(uri: string): Promise<void> {
  await mongoose.connect(uri);
}
startMongooseServer(uri).catch((err) => console.log(err));

const handlebars = create({
  runtimeOptions: { allowProtoPropertiesByDefault: true },
  helpers: {
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
        console.log(p.textContent.length);
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
          newTitle += postTitle[i];
        }
      }
      return newTitle;
    },
    parseMarkdown: (blogContent: string): any => {
      const parseMarkdown = markdown.render(blogContent);
      const toDom = new JSDOM(parseMarkdown);
      return parseMarkdown;
    },
  },
});
app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.urlencoded());
app.use(express.json());

app.listen(port, () => {
  console.log("Listening at port: " + port);
});

// API Endpoints
app.use("/api", apiIndex);

// Page Route Resources
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const queryFeaturedPosts = await Post.find({ isFeatured: true }).exec();
    if (!queryFeaturedPosts) {
      const err = new CustomError("Unable to fetch posts", 404);
      throw err;
    }
    // fetch isFeatured and recente blog posts
    res.render("index", {
      isPost: false,
      pageTitle: "FEATURED POSTS",
      data: { posts: queryFeaturedPosts },
    });
  })
);

// sanitize this route handler middleware
app.get(
  "/search",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log(interpolateString(req.query.search as string));
    const queryPosts = await Post.find({
      title: interpolateString(req.query.search as string),
    }).exec();
    if (!queryPosts) {
      const err = new CustomError("Unable to fetch posts", 404);
      throw err;
    }
    // fetch isFeatured and recente blog posts
    res.render("index", {
      isPost: false,
      pageTitle: `Results for ${req.query.search}`,
      data: { posts: Array.isArray(queryPosts) ? queryPosts : [queryPosts] },
    });
  })
);
app.use("/", category);
app.use("/:category", posts);

// API Error handling middleware
app.use((err: any, req: any, res: Response, next: any) => {
  // res.json({ message: err.message, statusCode: err.errorData.statusCode });
  res.json({
    message: err.message,
    statusCode: err ? err.statusCode : res.statusCode,
  });
});
