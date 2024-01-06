import expressAsyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";
import { Post } from "../model/postModel";
import { Category } from "../model/categoryModel";
import { checkExistingData } from "../utils/checkExistingDoc";
import { t_post } from "../types/t_post";
import { t_category } from "../types/t_category";
import { t_jsonPayload } from "../types/t_jsonPayload";
// middlewares to query the data provided by the parameter
// after querying the requested data got to the next middleware next()
const getPost = expressAsyncHandler(async (req: Request, res: Response) => {
  console.log(req.params);
  res.render("post", { param: req.params.postId });
});

// API Controllers
const getAPIPost = [
  expressAsyncHandler(async (req: Request, res: Response<t_jsonPayload>) => {
    const query = await Post.findOne({ title: req.params.postId }).exec();
    await checkExistingData(
      query,
      (query) => {
        res.json({
          message: "READ request on post",
          statusCode: 200,
          data: {
            title: query?.title,
            content: query?.content,
            author: query?.author,
            category: query?.category,
          },
        });
      },
      () => {
        console.log(`Error 404`);
        res.json({
          message: "Unable to Retrieve data",
          statusCode: 404,
        });
      }
    );
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
    const newPost = new Post(userData);
    await newPost.save();
    await Category.updateOne(
      { name: req.params.category },
      { $push: { posts: [newPost._id] } }
    ).exec();
    res.json({
      message: "POST request on post",
      data: { _id: newPost._id, ...userData },
    });
  }),
];

const putAPIPost = [
  expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userData = {
      ...req.body,
    };
    const queryPost = await Post.findOne({ title: req.params.postId }).exec();
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

    res.json({ message: "PUT request on post" });
  }),
];

// refer the current blogpost's id

const deleteAPIPost = [
  expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const queryPost = await Post.findOne({
      title: req.params.postId,
    }).exec();
    if (!queryPost) return res.json({ message: "Does not exist" });
    const queryCategory = await Category.findByIdAndUpdate(
      queryPost?.category.categoryId,
      { $pull: { posts: queryPost?._id } }
    ).exec();
    queryPost?.deleteOne().exec();
    res.json({
      message: "DELETE request on post",
      data: { _id: queryPost?._id, category: queryPost?.category },
    });
  }),
];

export { getPost, getAPIPost, deleteAPIPost, putAPIPost, postAPIPost };
