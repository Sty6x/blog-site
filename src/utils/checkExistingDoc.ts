import mongoose, {
  Document,
  Model,
  Models,
  MongooseQueryAndDocumentMiddleware,
  Query,
} from "mongoose";
import { t_post } from "../types/t_post";
import { t_category } from "../types/t_category";

export async function checkExistingData(
  queryObject: any,
  exists: (queryObject: any) => void,
  not: () => void
): Promise<void> {
  queryObject ? exists(queryObject) : not();
}
