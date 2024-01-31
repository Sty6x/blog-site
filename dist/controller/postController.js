"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAPIPost = exports.putAPIPost = exports.deleteAPIPost = exports.getAPIPost = exports.getPost = void 0;
const postModel_1 = require("../model/postModel");
const categoryModel_1 = require("../model/categoryModel");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const date_fns_1 = require("date-fns");
const getPost = (0, asyncHandler_1.default)(async (req, res) => {
    const query = await postModel_1.Post.findOne({ title: req.params.postId }).exec();
    if (!query) {
        const err = new CustomError_1.default("Post Not found", 404);
        throw err;
    }
    res.render("post", {
        message: "Successfully retrieved post",
        statusCode: 200,
        isPost: true,
        data: {
            content: query.content,
            title: query.title,
            author: query.author,
            dateAdded: (0, date_fns_1.format)(query.dateAdded ? query.dateAdded : new Date(), "PP").toString(),
            category: query.category,
        },
    });
});
exports.getPost = getPost;
// API Controllers
const getAPIPost = [
    (0, asyncHandler_1.default)(async (req, res, next) => {
        const query = await postModel_1.Post.findOne({ title: req.params.postId }).exec();
        if (!query) {
            const err = new CustomError_1.default("Post Not found", 404);
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
    }),
];
exports.getAPIPost = getAPIPost;
const postAPIPost = [
    (0, asyncHandler_1.default)(async (req, res) => {
        const queryCategory = await categoryModel_1.Category.findOne({
            name: req.params.category,
        }).exec();
        const userData = {
            ...req.body,
            dateAdded: new Date(),
            category: {
                name: queryCategory?.name,
                categoryId: queryCategory?.id,
            },
        };
        if (!queryCategory) {
            const err = new CustomError_1.default("Unable to create a new blog post to a non-existing category", 404);
            throw err;
        }
        const newPost = new postModel_1.Post(userData);
        await newPost.save();
        await categoryModel_1.Category.updateOne({ name: req.params.category }, { $push: { posts: [newPost._id] } }).exec();
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
exports.postAPIPost = postAPIPost;
const putAPIPost = [
    (0, asyncHandler_1.default)(async (req, res) => {
        const userData = {
            ...req.body,
        };
        const queryPost = await postModel_1.Post.findOne({ title: req.params.postId }).exec();
        if (!queryPost) {
            const err = new CustomError_1.default("Unable to Update a non-existing blog post", 404);
            throw err;
        }
        // checks whether if the category needs to be updated or not.
        if (userData.category !== undefined) {
            const checkExistingCategory = await categoryModel_1.Category.findOne({
                name: userData.category,
            }).exec();
            if (!checkExistingCategory) {
                const err = new CustomError_1.default("Category does not exist", 404);
                throw err;
            }
            const [oldCategory, newCategory] = await Promise.all([
                categoryModel_1.Category.findOneAndUpdate({ name: req.params.category }, { $pull: { posts: queryPost?._id } }),
                categoryModel_1.Category.findOneAndUpdate({ name: userData.category }, { $push: { posts: [queryPost?._id] } }),
            ]);
            userData.category = {
                name: newCategory?.name,
                categoryId: newCategory?._id,
            };
        }
        const updatePost = await postModel_1.Post.updateOne({ title: req.params.postId }, { ...userData }).exec();
        res.json({
            message: `Successfully updated ${req.params.postId}`,
            statusCode: 200,
            data: {
                title: userData?.title,
                content: userData?.content,
                author: userData?.author,
                category: userData?.category,
                isFeatured: userData?.isFeatured,
            },
        });
    }),
];
exports.putAPIPost = putAPIPost;
const deleteAPIPost = [
    (0, asyncHandler_1.default)(async (req, res) => {
        const queryPost = await postModel_1.Post.findOne({
            title: req.params.postId,
        }).exec();
        const queryCurrentCategory = await categoryModel_1.Category.findOne({
            posts: { $in: [queryPost?._id] },
        }).exec();
        // instead of checking query post if it exist alone
        // check if it exists on the current category, if it exists
        // on the current category then that means it really does exist
        if (!queryCurrentCategory) {
            const err = new CustomError_1.default(`The Post ${req.params.postId} does not exist`, 404);
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
exports.deleteAPIPost = deleteAPIPost;
