"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const interpolateString_1 = __importDefault(require("../utils/interpolateString"));
const postModel_1 = require("../model/postModel");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const express_validator_1 = require("express-validator");
module.exports = [
    (0, express_validator_1.query)("searchQuery").notEmpty().escape(),
    (0, asyncHandler_1.default)(async (req, res, next) => {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            next(result.array());
        }
        const queryPosts = await postModel_1.Post.find({
            title: (0, interpolateString_1.default)(req.query.searchQuery, "-"),
        }).exec();
        if (!queryPosts) {
            const err = new CustomError_1.default("Unable to fetch posts", 404);
            throw err;
        }
        res.render("index", {
            isPost: false,
            pageTitle: `Results for ${req.query.searchQuery}`,
            data: { posts: Array.isArray(queryPosts) ? queryPosts : [queryPosts] },
        });
    }),
    (err, req, res, next) => {
        const errResult = [...err];
        console.log(errResult[0].msg);
        res.redirect("/");
    },
];
