import { NextFunction, Response, Request } from "express";
import asyncHandler from "../utils/asyncHandler";
import interpolateString from "../utils/interpolateString";
import { Post } from "../model/postModel";
import CustomError from "../utils/CustomError";

module.exports = [
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const queryPosts = await Post.find({
      title: interpolateString(req.query.searchQuery as string),
    }).exec();
    if (!queryPosts) {
      const err = new CustomError("Unable to fetch posts", 404);
      throw err;
    }
    // fetch isFeatured and recente blog posts
    res.render("index", {
      isPost: false,
      pageTitle: `Results for ${req.query.searchQuery}`,
      data: { posts: Array.isArray(queryPosts) ? queryPosts : [queryPosts] },
    });
  }),
];
