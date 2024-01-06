import expressAsyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";
import { Post } from "../model/postModel";
import { Category } from "../model/categoryModel";
// middlewares to query the data provided by the parameter
// after querying the requested data got to the next middleware next()
const getPost = expressAsyncHandler(async (req: Request, res: Response) => {
  console.log(req.params);
  res.render("post", { param: req.params.postId });
});

// API Controllers
const getAPIPost = [
  expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = await Post.findOne({ title: req.params.postId }).exec();
    if (!query) {
      res.json({
        message: "Post not found",
        statusCode: 404,
      });
      return;
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
  }),
];

const postAPIPost = [
  expressAsyncHandler(async (req: Request, res: Response) => {
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
      res.json({
        message: "Unable to POST a new blog post to a non-existing category",
        statusCode: 404,
      });
      return;
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
  expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userData = {
      ...req.body,
    };
    const queryPost = await Post.findOne({ title: req.params.postId }).exec();
    if (!queryPost) {
      res.json({
        message: "Unable to Update a non-existing blog post",
        statusCode: 404,
      });
      return;
    }

    // checks whether if the category needs to be updated or not.
    if (userData.category !== null) {
      const checkExistingCategory = await Category.findOne({
        name: userData.category,
      }).exec();

      if (!checkExistingCategory)
        return res.json({ message: "Error Category does not exist" });

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
  expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const queryPost = await Post.findOne({
      title: req.params.postId,
    }).exec();
    const queryCurrentCategory = await Category.findOne({
      posts: { $in: [queryPost?._id] },
    });

    // instead of checking query post if it exist alone
    // check if it exists on the current category, if it exists
    // on the current category then that means it really does exist

    if (!queryCurrentCategory)
      return res.json({
        message: `The post ${req.params.postId} does not exist`,
        statusCode: 404,
      });
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
