import express, { Response, Request, NextFunction } from "express";
import {
  deleteAPIPost,
  getAPIPost,
  postAPIPost,
  putAPIPost,
} from "../controller/postController";
import {
  deleteAPICategory,
  getAPICategory,
  postAPICategory,
  putAPICategory,
} from "../controller/categoryController";
import { User } from "../model/userModel";
import asyncHandler from "../utils/asyncHandler";
import CustomError from "../utils/CustomError";
import auth from "../middleware/auth";

const jwt = require("jsonwebtoken");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const router = express.Router();

const opt = {
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JwtStrategy(opt, function (
    jwt_payload: any,
    done: (arg0: any, arg1: any) => any
  ) {
    console.log("ha");
    const queryUser = User.findOne({
      email: jwt_payload.email,
      password: jwt_payload.password,
    });
    if (!queryUser) done(null, false);
    done(null, queryUser);
  })
);

router.get("/", (req, res): void => {
  res.json({ message: "Welcome to my api" });
});

router.post(
  "/login",
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { email, password } = req.body;
      const queryUser = await User.findOne({ email: req.body.email }).exec();
      console.log(queryUser);
      if (!queryUser) {
        const err = new CustomError("User does not exist", 401);
        throw err;
      }
      const newToken = jwt.sign(
        { email: queryUser?.email, password: queryUser?.password },
        process.env.SECRET_KEY
      );

      res.json({ message: "logged in", token: newToken });
    }
  )
);

// THESE ARE FOR AUTHENTICATING USERS
router.all("*", auth);
// THESE ARE FOR AUTHENTICATING USERS ^^

router.get("/:category", getAPICategory);
router.post("/category/create", postAPICategory);
router.delete("/:category", deleteAPICategory);
router.put("/:category/update", putAPICategory);

router.get("/:category/:postId", getAPIPost);
// protect these routes
router.post("/:category/create", postAPIPost);
router.delete("/:category/:postId", deleteAPIPost);
router.put("/:category/:postId/update", putAPIPost);

module.exports = router;
