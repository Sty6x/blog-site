import express, { NextFunction, Request, Response } from "express";
import { getPost } from "../controller/postController";
const router = express.Router();

router.get("/:postId", getPost);

module.exports = router;
