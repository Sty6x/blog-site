import { ErrorRequestHandler, NextFunction, Response, Request } from "express";
import asyncHandler from "../utils/asyncHandler";
import interpolateString from "../utils/interpolateString";
import { Post } from "../model/postModel";
import CustomError from "../utils/CustomError";
import { query, validationResult } from "express-validator";

module.exports = [
  query("searchQuery").notEmpty().escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      next(result.array());
    }
    const queryPosts = await Post.find({
      title: interpolateString(req.query.searchQuery as string, "-"),
    }).exec();
    if (!queryPosts) {
      const err = new CustomError("Unable to fetch posts", 404);
      throw err;
    }
    res.render("index", {
      isPost: false,
      pageTitle: `Results for ${req.query.searchQuery}`,
      data: { posts: Array.isArray(queryPosts) ? queryPosts : [queryPosts] },
    });
  }),
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errResult = [...(err as any as Array<any>)];
    console.log(errResult[0].msg);
    res.redirect("/");
  },
];
