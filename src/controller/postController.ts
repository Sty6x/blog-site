import expressAsyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";
import { Post } from "../model/postModel";
import { Category } from "../model/categoryModel";
import asyncHandler from "../utils/asyncHandler";
import CustomError from "../utils/CustomError";
// middlewares to query the data provided by the parameter
// after querying the requested data got to the next middleware next()
const getPost = expressAsyncHandler(async (req: Request, res: Response) => {
  console.log(req.params);
  res.render("post", { param: req.params.postId });
});

// API Controllers
const getAPIPost = [
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const query = await Post.findOne({ title: req.params.postId }).exec();
      if (!query) {
        const err = new CustomError("Post Not found", 404);
        throw err;
      }
      res.json({
        message: "Successfully retrieved post",
        statusCode: 200,
        data: {
          title: query?.title,
          content: query?.content,
          author: query?.author,
          category: query?.category,
        },
      });
    }
  ),
];

const postAPIPost = [
  asyncHandler(async (req: Request, res: Response) => {
    const queryCategory = await Category.findOne({
      name: req.params.category,
    }).exec();
    const userData = {
      ...req.body,
      category: {
        name: queryCategory?.name,
        categoryId: queryCategory?.id,
      },
    };
    if (!queryCategory) {
      const err = new CustomError(
        "Unable to create a new blog post to a non-existing category",
        404
      );
      throw err;
    }
    const newPost = new Post(userData);
    await newPost.save();
    await Category.updateOne(
      { name: req.params.category },
      { $push: { posts: [newPost._id] } }
    ).exec();
    res.json({
      message: "Successfully created a new post",
      statusCode: 200,
      data: {
        title: newPost?.title,
        content: newPost?.content,
        author: newPost?.author,
        category: newPost?.category,
      },
    });
  }),
];

const putAPIPost = [
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userData = {
      ...req.body,
    };
    const queryPost = await Post.findOne({ title: req.params.postId }).exec();
    if (!queryPost) {
      const err = new CustomError(
        "Unable to Update a non-existing blog post",
        404
      );
      throw err;
    }

    // checks whether if the category needs to be updated or not.
    if (userData.category !== undefined) {
      const checkExistingCategory = await Category.findOne({
        name: userData.category,
      }).exec();

      if (!checkExistingCategory) {
        const err = new CustomError("Category does not exist", 404);
        throw err;
      }

      const [oldCategory, newCategory] = await Promise.all([
        Category.findOneAndUpdate(
          { name: req.params.category },
          { $pull: { posts: queryPost?._id } }
        ),
        Category.findOneAndUpdate(
          { name: userData.category },
          { $push: { posts: [queryPost?._id] } }
        ),
      ]);
      userData.category = {
        name: newCategory?.name,
        categoryId: newCategory?._id,
      };
    }
    const updatePost = await Post.updateOne(
      { title: req.params.postId },
      { ...userData }
    ).exec();

    res.json({
      message: `Successfully updated ${req.params.postId}`,
      statusCode: 200,
      data: {
        title: userData?.title,
        content: userData?.content,
        author: userData?.author,
        category: userData?.category,
      },
    });
  }),
];

const deleteAPIPost = [
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const queryPost = await Post.findOne({
      title: req.params.postId,
    }).exec();
    const queryCurrentCategory = await Category.findOne({
      posts: { $in: [queryPost?._id] },
    }).exec();

    // instead of checking query post if it exist alone
    // check if it exists on the current category, if it exists
    // on the current category then that means it really does exist

    if (!queryCurrentCategory) {
      const err = new CustomError(
        `The Post ${req.params.postId} does not exist`,
        404
      );
      throw err;
    }

    await queryCurrentCategory
      .updateOne({
        $pull: { posts: queryPost?._id },
      })
      .exec();
    await queryPost?.deleteOne().exec();
    res.json({
      message: `Successfully deleted ${req.params.postId}`,
      statusCode: 200,
      data: { _id: queryPost?._id, category: queryPost?.category },
    });
  }),
];

export { getPost, getAPIPost, deleteAPIPost, putAPIPost, postAPIPost };
