import mongoose from "mongoose";
export type t_category = {
  name: string;
  posts: Array<mongoose.Types.ObjectId> | [];
};
