import asyncHandler from "../utils/asyncHandler";
import { Response, Request, NextFunction } from "express";
import { Category } from "../model/categoryModel";
import { Post } from "../model/postModel";
import mongoose, { Query, Schema } from "mongoose";
import CustomError from "../utils/CustomError";

// middlewares to query the data provided by the parameter
// after querying the requested data got to the next middleware next()

const getCategory = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const queryCategory = await Category.findOne({
      name: req.params.category,
    })
      .populate("posts")
      .exec();
    if (!queryCategory)
      return res.json({ message: "Category does not exist", statusCode: 404 });
    res.render("category", {
      message: `Retrieved ${req.params.category} category`,
      statusCode: 200,
      data: {
        isPost: false,
        pageTitle: queryCategory?.name,
        name: queryCategory?.name,
        _id: queryCategory?._id,
        posts: queryCategory?.posts,
      },
    });
  }
);

// API Controllers
const getAPICategory = [
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userQuery = req.params.category;
    const query = await Category.findOne({ name: userQuery })
      .populate("posts")
      .exec();
    if (!query) {
      const err = new CustomError("Category Not found", 404);
      throw err;
    }
    res.json({
      message: `Successfully Retrieved ${req.params.category}`,
      statusCode: res.statusCode,
      data: { name: query?.name, posts: query?.posts },
    });
  }),
];

const postAPICategory = [
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const userData = req.body;
    const parseUserPosts = JSON.parse(userData.posts);
    const checkExistingCategory = await Category.exists({
      name: userData.name,
    }).exec();
    //check inputs needed
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
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const categoryName = req.params.category;
    const categoryData = req.body;
    const queryCategory = await Category.findOne({ name: categoryName }).exec();
    if (!queryCategory) {
      const err = new CustomError(
        "Unable to update a category that does not exist.",
        404
      );
      throw err;
    }
    await queryCategory.updateOne(categoryData).exec();
    res.json({
      message: `Successfully Updated ${req.params.category}`,
      statusCode: res.statusCode,
    });
  }),
];

const deleteAPICategory = [
  asyncHandler(async (req: Request, res: Response): Promise<any> => {
    if (req.params.category === "uncategorized")
      return res.json({
        message: "You are not authorized to invoke this action.",
        statusCode: 403,
      });

    const [queryUncategorized, queryCurrentCategory] = await Promise.all([
      Category.findOne({
        name: "uncategorized",
      }).exec(),
      Category.findOne({
        name: req.params.category,
      }).exec(),
    ]);

    if (!queryCurrentCategory) {
      const err = new CustomError("Category does not exist.", 404);
      throw err;
    }

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
