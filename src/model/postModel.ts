import mongoose, { Schema, model } from "mongoose";
import { t_post } from "../types/t_post";
export const postSchema = new Schema<t_post>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  dateAdded: Date,
  lastUpdated: Date,
  category: {
    categoryId: { type: Schema.ObjectId, ref: "category" },
    name: { type: String, required: true },
  },
});

export const Post = model("post", postSchema);
