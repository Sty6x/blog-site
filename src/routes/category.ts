import express from "express";
import { Response, Request, NextFunction } from "express";
import { getCategory } from "../controller/categoryController";
const router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  res.render("index");
});

router.get("/:category", getCategory);

module.exports = router;
