import expressAsyncHandler from "express-async-handler";
import { Response, Request, NextFunction } from "express";
import { Category } from "../model/categoryModel";
import { Post } from "../model/postModel";
import mongoose, { Query, Schema } from "mongoose";

// middlewares to query the data provided by the parameter
// after querying the requested data got to the next middleware next()

const getCategory = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const queryCategory = await Category.findOne({
      name: req.params.category,
    }).exec();
    if (!queryCategory)
      return res.json({ message: "Category does not exist", statusCode: 404 });
    res.json({
      message: `Retrieved ${req.params.category} category`,
      statusCode: 200,
      data: {
        name: queryCategory?.name,
        _id: queryCategory?._id,
        posts: queryCategory?.posts,
      },
    });
  }
);

// API Controllers
const getAPICategory = [
  expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userQuery = req.params.category;
    const query = await Category.findOne({ name: userQuery })
      .populate("posts")
      .exec();
    if (!query)
      return res.json({
        message: "Unable to retrieve your requested category",
        statusCode: 404,
      });
    res.json({
      message: `Successfully Retrieved ${req.params.category}`,
      statusCode: res.statusCode,
      data: { name: query?.name, posts: query?.posts },
    });
  }),
];

const postAPICategory = [
  expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userData = req.body;
    const parseUserPosts = JSON.parse(userData.posts);
    const checkExistingCategory = await Category.exists({
      name: userData.name,
    }).exec();
    if (checkExistingCategory)
      return res.json({
        message: `The ${userData.name} category already exists`,
        statusCode: 409,
      });
    const newCategory = new Category({
      name: userData.name,
      posts: parseUserPosts,
    });
    await newCategory.save();
    res.json({
      message: `Successfully Created ${userData.name}`,
      statusCode: res.statusCode,
      data: {
        name: userData.name,
        posts: parseUserPosts,
      },
    });
  }),
];

const putAPICategory = [
  expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    const categoryName = req.params.category;
    const categoryData = req.body;
    const queryCategory = await Category.findOne({ name: categoryName }).exec();
    if (!queryCategory)
      return res.json({
        message: `Unable to update a category that does not exist`,
        statusCode: 404,
      });

    await queryCategory.updateOne(categoryData).exec();
    res.json({
      message: `Successfully Updated ${req.params.category}`,
      statusCode: res.statusCode,
    });
  }),
];

const deleteAPICategory = [
  expressAsyncHandler(async (req: Request, res: Response): Promise<any> => {
    if (req.params.category === "uncategorized")
      return res.json({
        message: "Current category is protected",
        statusCode: 405,
      });

    const [queryUncategorized, queryCurrentCategory] = await Promise.all([
      Category.findOne({
        name: "uncategorized",
      }).exec(),
      Category.findOne({
        name: req.params.category,
      }).exec(),
    ]);

    if (!queryCurrentCategory)
      return res.json({ message: "Category does not exist", statusCode: 404 });

    await Category.findByIdAndUpdate(queryUncategorized?._id, {
      $push: {
        posts: [...(queryCurrentCategory?.posts as mongoose.Types.ObjectId[])],
      },
    }).exec();

    await Post.updateMany(
      { "category.categoryId": queryCurrentCategory?._id },
      {
        $set: {
          "category.name": "uncategorized",
          "category.categoryId": queryUncategorized?._id,
        },
      }
    ).exec();

    await queryCurrentCategory.deleteOne();
    res.json({
      message: `Successfully Deleted ${req.params.category}`,
      statusCode: res.statusCode,
    });
  }),
];

export {
  getCategory,
  getAPICategory,
  postAPICategory,
  deleteAPICategory,
  putAPICategory,
};
