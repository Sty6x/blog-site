import express, { Response, Request } from "express";
import {
  deleteAPICategory,
  putAPICategory,
  postAPICategory,
  getAPICategory,
} from "../controller/categoryController";

const router = express.Router();

router.get("/:category", getAPICategory);
router.post("/category/create", postAPICategory);
router.delete("/:category", deleteAPICategory);
router.put("/:category", putAPICategory);

module.exports = router;
