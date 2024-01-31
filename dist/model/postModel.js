"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
exports.postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    isFeatured: Boolean,
    dateAdded: Date,
    lastUpdated: Date,
    category: {
        categoryId: { type: mongoose_1.Schema.ObjectId, ref: "category" },
        name: { type: String, required: true },
    },
});
exports.Post = (0, mongoose_1.model)("post", exports.postSchema);
