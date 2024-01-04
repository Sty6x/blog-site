import mongoose, { Schema, SchemaType, model } from "mongoose";
import { t_category } from "../types/t_category";

const categorySchema = new Schema<t_category>({
  name: { type: String, required: true },
  posts: { type: [{ type: Schema.ObjectId, ref: "post", required: true }] },
});

export const Category = model("category", categorySchema);
