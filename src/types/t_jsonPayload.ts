import { t_category } from "./t_category";
import { t_post } from "./t_post";

export type t_jsonPayload = {
  message: string;
  statusCode: number;
  data?: t_category | t_post | null;
};
