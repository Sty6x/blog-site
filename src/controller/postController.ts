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
const getAPIPost = expressAsyncHandler(async (req: Request, res: Response) => {
  const query = await Post.findOne({ title: req.params.postId }).exec();
  res.json({
    message: "READ request on post",
    data: {
      title: query?.title,
      content: query?.content,
      author: query?.author,
      category: query?.category,
    },
  });
});

const postAPIPost = expressAsyncHandler(async (req: Request, res: Response) => {
  const query = await Category.findOne({ name: req.params.category }).exec();
  const userData = {
    ...req.body,
    category: {
      name: query?.name,
      categoryId: query?.id,
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
});

const deleteAPIPost = expressAsyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.params);
    res.json({ message: "DELETE request on post" });
  }
);

const putAPIPost = expressAsyncHandler(async (req: Request, res: Response) => {
  console.log(req.params);
  res.json({ message: "PUT request on post" });
});

export { getPost, getAPIPost, deleteAPIPost, putAPIPost, postAPIPost };
