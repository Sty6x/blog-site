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

// /api/:category && /:category <- displays the list of blog posts of a specific category.
// /api/:category/:post && /:category/post <- requesting specific blog post.The API can Delete, Update and Get a specific blog post.
// /api/:category/create  <- requesting to POST (create) a new blog post.

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

const putAPIPost = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // this wont change the category object property
    // if it wasn't defined in the first place, include
    // only the fields except the categories
    const userData = {
      ...req.body,
    };

    // ** TO BE CHANGED**

    const queryPost = await Post.findOne({ title: req.params.postId }).exec();

    // I Need the current post's ObjectId so that I can remove it from the old category
    // and store it to the new category.
    // Will be changed in the future since we wont need to query the post just
    // to fetch the ID, the content editor will handle the inclusion of the
    // post ID.

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
        _id: newCategory?._id,
      };
    }
    const updatePost = await Post.updateOne(
      { title: req.params.postId },
      { ...userData }
    ).exec();

    res.json({ message: "PUT request on post" });
  }
);

const deleteAPIPost = expressAsyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.params);
    res.json({ message: "DELETE request on post" });
  }
);

export { getPost, getAPIPost, deleteAPIPost, putAPIPost, postAPIPost };
