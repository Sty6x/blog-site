import express, { Response, Request } from "express";

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

router.get("/", (req, res): void => {
  res.json({ message: "Welcome to my api" });
});
router.get("/all", (req, res): void => {
  res.json({ message: "All Contents" });
});
router.use("/", categoryAPI);

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
