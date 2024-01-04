import express, { Response, Request } from "express";
import {
  deleteAPIPost,
  getAPIPost,
  postAPIPost,
  putAPIPost,
} from "../controller/postController";

const router = express.Router();

router.get("/:postId", getAPIPost);
router.post("/create", postAPIPost);
router.delete("/:postId/delete", deleteAPIPost);
router.put("/:postId/update", putAPIPost);

module.exports = router;
