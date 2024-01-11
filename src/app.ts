import express, { NextFunction } from "express";
import { engine } from "express-handlebars";
import { Application, Request, Response } from "express-serve-static-core";
import mongoose from "mongoose";
import path from "path";
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

app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", engine());
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
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  // fetch isFeatured and recente blog posts
  res.render("index", {
    isPost: false,
    headerContent:
      "A place where I talk about programming, Computer systems, tutorials for various things in programming and reviews on my favorite books.",
  });
});
app.use("/", category);
app.use("/:category", posts);

// Error handling middleware
app.use((err: any, req: any, res: Response, next: any) => {
  // res.json({ message: err.message, statusCode: err.errorData.statusCode });
  res.json({
    message: err.message,
    statusCode: err ? err.statusCode : res.statusCode,
  });
});
