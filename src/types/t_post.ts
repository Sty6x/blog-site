import mongoose from "mongoose";

export type t_post = {
  title: string;
  author: string;
  content: string;
  isFeatured?: boolean;
  dateAdded?: number | string;
  lastUpdated?: number | string;
  category: { categoryId: mongoose.Types.ObjectId; name: string };
};
