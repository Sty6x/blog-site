"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putAPICategory = exports.deleteAPICategory = exports.postAPICategory = exports.getAPICategory = exports.getCategory = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const categoryModel_1 = require("../model/categoryModel");
const postModel_1 = require("../model/postModel");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
// middlewares to query the data provided by the parameter
// after querying the requested data got to the next middleware next()
const getCategory = (0, asyncHandler_1.default)(async (req, res) => {
    const queryCategory = await categoryModel_1.Category.findOne({
        name: req.params.category,
    })
        .populate("posts")
        .exec();
    const queryCategories = await categoryModel_1.Category.find({
        name: { $ne: "uncategorized" },
    }).exec();
    if (!queryCategories) {
        const err = new CustomError_1.default("Unable to fetch categories", 404);
        throw err;
    }
    if (!queryCategory)
        return res.json({ message: "Category does not exist", statusCode: 404 });
    res.render("category", {
        message: `Retrieved ${req.params.category} category`,
        statusCode: 200,
        pageTitle: queryCategory?.name.toUpperCase(),
        data: {
            isPost: false,
            name: queryCategory?.name,
            _id: queryCategory?._id,
            posts: queryCategory?.posts,
            categories: queryCategories,
        },
    });
});
exports.getCategory = getCategory;
// API Controllers
const getAPICategory = [
    (0, asyncHandler_1.default)(async (req, res) => {
        const userQuery = req.params.category;
        const query = await categoryModel_1.Category.findOne({ name: userQuery })
            .populate("posts")
            .exec();
        if (!query) {
            const err = new CustomError_1.default("Category Not found", 404);
            throw err;
        }
        res.json({
            message: `Successfully Retrieved ${req.params.category}`,
            statusCode: res.statusCode,
            data: { name: query?.name, posts: query?.posts },
        });
    }),
];
exports.getAPICategory = getAPICategory;
const postAPICategory = [
    (0, asyncHandler_1.default)(async (req, res) => {
        const userData = req.body;
        const parseUserPosts = JSON.parse(userData.posts);
        const checkExistingCategory = await categoryModel_1.Category.exists({
            name: userData.name,
        }).exec();
        //check inputs needed
        if (checkExistingCategory)
            return res.json({
                message: `The ${userData.name} category already exists`,
                statusCode: 409,
            });
        const newCategory = new categoryModel_1.Category({
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
exports.postAPICategory = postAPICategory;
const putAPICategory = [
    (0, asyncHandler_1.default)(async (req, res) => {
        const categoryName = req.params.category;
        const categoryData = req.body;
        const queryCategory = await categoryModel_1.Category.findOne({ name: categoryName }).exec();
        if (!queryCategory) {
            const err = new CustomError_1.default("Unable to update a category that does not exist.", 404);
            throw err;
        }
        await queryCategory.updateOne(categoryData).exec();
        res.json({
            message: `Successfully Updated ${req.params.category}`,
            statusCode: res.statusCode,
        });
    }),
];
exports.putAPICategory = putAPICategory;
const deleteAPICategory = [
    (0, asyncHandler_1.default)(async (req, res) => {
        if (req.params.category === "uncategorized")
            return res.json({
                message: "You are not authorized to invoke this action.",
                statusCode: 403,
            });
        const [queryUncategorized, queryCurrentCategory] = await Promise.all([
            categoryModel_1.Category.findOne({
                name: "uncategorized",
            }).exec(),
            categoryModel_1.Category.findOne({
                name: req.params.category,
            }).exec(),
        ]);
        if (!queryCurrentCategory) {
            const err = new CustomError_1.default("Category does not exist.", 404);
            throw err;
        }
        await categoryModel_1.Category.findByIdAndUpdate(queryUncategorized?._id, {
            $push: {
                posts: [...queryCurrentCategory?.posts],
            },
        }).exec();
        await postModel_1.Post.updateMany({ "category.categoryId": queryCurrentCategory?._id }, {
            $set: {
                "category.name": "uncategorized",
                "category.categoryId": queryUncategorized?._id,
            },
        }).exec();
        await queryCurrentCategory.deleteOne();
        res.json({
            message: `Successfully Deleted ${req.params.category}`,
            statusCode: res.statusCode,
        });
    }),
];
exports.deleteAPICategory = deleteAPICategory;
