import expressAsyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";
import { Category } from "../model/categoryModel";
import { Post } from "../model/postModel";

// middlewares to query the data provided by the parameter
// after querying the requested data got to the next middleware next()
const getCategory = expressAsyncHandler(async (req: Request, res: Response) => {
  console.log(req.params);
  res.send("Not implemented");
});

// API Controllers
const getAPICategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userQuery = req.params.category;
    const query = await Category.findOne({ name: userQuery })
      .populate("posts")
      .exec();
    console.log(query);
    const nullQuery =
      query === null && "The Category that you're looking for does not exist";
    res.json({
      message: "READ request on Category",
      data: nullQuery || { name: query?.name, posts: query?.posts },
    });
  }
);

const postAPICategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userData = req.body;
    const parseUserPosts = JSON.parse(userData.posts);
    const newCategory = new Category({
      name: userData.name,
      posts: parseUserPosts,
    });
    await newCategory.save();
    res.json({
      message: "POST request on Category",
      data: {
        name: userData.name,
        posts: parseUserPosts,
      },
    });
  }
);

const putAPICategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const categoryName = req.params.category;
    const categoryData = req.body;
    const updateCategory = await Category.findOneAndUpdate(
      { name: categoryName },
      categoryData
    ).exec();
    console.log(updateCategory);
    res.json({ message: "PUT request on Category" });
  }
);

const deleteAPICategory = expressAsyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.params);
    res.json({ message: "DELETE request on Category" });
  }
);

export {
  getCategory,
  getAPICategory,
  postAPICategory,
  deleteAPICategory,
  putAPICategory,
};
