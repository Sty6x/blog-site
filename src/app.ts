import express, { NextFunction } from "express";
import "dotenv/config";
import { create } from "express-handlebars";
import { Application, Request, Response } from "express-serve-static-core";
import mongoose from "mongoose";
import path from "path";
import { Post } from "./model/postModel";
import asyncHandler from "./utils/asyncHandler";
import CustomError from "./utils/CustomError";
import { Category } from "./model/categoryModel";
const compression = require("compression");
const cors = require("cors");
const app: Application = express();
const port = 3000;
const posts = require("./routes/post");
const searchQueryMiddlewares = require("./middleware/searchQuery");
const category = require("./routes/category");
const apiIndex = require("./api/index");
const handlebarsHelpers = require("./utils/handlebarsHelpers");
const uri: string = process.env.MONGODB_URI as string;

mongoose.set("strictQuery", false);
async function startMongooseServer(uri: string): Promise<void> {
  await mongoose.connect(uri);
}
startMongooseServer(uri).catch((err) => console.log(err));

// handlebars helpers
const handlebars = create({
  runtimeOptions: { allowProtoPropertiesByDefault: true },
  helpers: handlebarsHelpers,
});

app.use(compression());
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
    const queryCategories = await Category.find({
      name: { $ne: "uncategorized" },
    }).exec();

    if (!queryCategories) {
      const err = new CustomError("Unable to fetch categories", 404);
      throw err;
    }
    if (!queryFeaturedPosts) {
      const err = new CustomError("Unable to fetch posts", 404);
      throw err;
    }
    // fetch isFeatured and recent blog posts
    res.render("index", {
      isPost: false,
      pageTitle: "FEATURED POSTS",
      data: { posts: queryFeaturedPosts, categories: queryCategories },
    });
  })
);

app.get("/search", searchQueryMiddlewares);
app.use("/", category);
app.use("/:category", posts);

// API Error handling middleware
app.use((err: any, req: any, res: Response, next: any) => {
  res.json({
    message: err.message,
    statusCode: err ? err.statusCode : res.statusCode,
  });
});
