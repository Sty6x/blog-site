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

const jwt = require("jsonwebtoken");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const router = express.Router();

const opt = {
  secretOrKey: "secret",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// THESE ARE FOR AUTHENTICATING USERS
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
        const err = new CustomError("User does not exist", { statusCode: 401 });
        throw err;
      }
      const newToken = jwt.sign(
        { email: queryUser?.email, password: queryUser?.password },
        "secret"
      );

      res.json({ message: "logged in", token: newToken });
    }
  )
);

router.all(
  "*",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log(req.headers);
    console.log("Do something");
    // const newToken = jwt.sign(me, "secret");
    // res.send({ name: me.name, token: newToken });
    next();
  }
);
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
