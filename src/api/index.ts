import express, { Response, Request, NextFunction } from "express";

import {
  deleteAPIPost,
  getAPIPost,
  postAPIPost,
  putAPIPost,
} from "../controller/postController";
import {
  deleteAPICategory,
  getAPICategory,
  postAPICategory,
  putAPICategory,
} from "../controller/categoryController";

const router = express.Router();
const postAPI = require("./post");
const categoryAPI = require("./category");

// verify jwt token on all requests
// app.all( middleware to authenticate authorization to access api endpoints )
// using JWT strategy use bearer token to authenticate user request to
// every api endpoints
// create cookie header from server to the client when a request is invoked.
// cookie header contains the jwt-token property.
// for every request of the client, a jwt token will be sent with the cookie everytime.
// router.all("*", (req: Request, res: Response, next: NextFunction) => {});

router.get("/", (req, res): void => {
  res.json({ message: "Welcome to my api" });
});

router.get("/:category", getAPICategory);
router.post("/category/create", postAPICategory);
router.delete("/:category", deleteAPICategory);
router.put("/:category/update", putAPICategory);

router.get("/:category/:postId", getAPIPost);
// protect these routes
router.post("/:category/create", postAPIPost);
router.delete("/:category/:postId", deleteAPIPost);
router.put("/:category/:postId/update", putAPIPost);

module.exports = router;
