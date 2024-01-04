import express, { Response, Request } from "express";

import {
  deleteAPIPost,
  getAPIPost,
  postAPIPost,
  putAPIPost,
} from "../controller/postController";

const router = express.Router();
const postAPI = require("./post");
const categoryApi = require("./category");

router.get("/", (req, res): void => {
  res.json({ message: "Welcome to my api" });
});
router.get("/all", (req, res): void => {
  res.json({ message: "All Contents" });
});
router.use("/", categoryApi);
// router.use("/:category", postAPI);

router.get("/:category/:postId", getAPIPost);
router.post("/:category/create", postAPIPost);
router.delete("/:category/:postId/delete", deleteAPIPost);
router.put("/:category/:postId/update", putAPIPost);

module.exports = router;
