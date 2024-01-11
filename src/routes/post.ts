import express, { NextFunction, Request, Response } from "express";
import { getPost } from "../controller/postController";
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("posts route");
  res.json({ message: "Hello" });
  // next();
});

router.get("/:postId", getPost);

module.exports = router;
