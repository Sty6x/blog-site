"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controller/postController");
const categoryController_1 = require("../controller/categoryController");
const userModel_1 = require("../model/userModel");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const auth_1 = __importDefault(require("../middleware/auth"));
const jwt = require("jsonwebtoken");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const router = express_1.default.Router();
const opt = {
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
passport.use(new JwtStrategy(opt, function (jwt_payload, done) {
    const queryUser = userModel_1.User.findOne({
        email: jwt_payload.email,
        password: jwt_payload.password,
    });
    if (!queryUser)
        done(null, false);
    done(null, queryUser);
}));
router.get("/", (req, res) => {
    res.json({ message: "Welcome to my api" });
});
router.post("/login", (0, asyncHandler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const queryUser = await userModel_1.User.findOne({ email: req.body.email }).exec();
    if (!queryUser) {
        const err = new CustomError_1.default("User does not exist", 401);
        throw err;
    }
    const newToken = jwt.sign({ email: queryUser?.email, password: queryUser?.password }, process.env.SECRET_KEY);
    res.json({ message: "logged in", token: newToken });
}));
// THESE ARE FOR AUTHENTICATING USERS
router.all("*", auth_1.default);
// THESE ARE FOR AUTHENTICATING USERS ^^
router.get("/:category", categoryController_1.getAPICategory);
router.post("/category/create", categoryController_1.postAPICategory);
router.delete("/:category", categoryController_1.deleteAPICategory);
router.put("/:category/update", categoryController_1.putAPICategory);
router.get("/:category/:postId", postController_1.getAPIPost);
// protect these routes
router.post("/:category/create", postController_1.postAPIPost);
router.delete("/:category/:postId", postController_1.deleteAPIPost);
router.put("/:category/:postId/update", postController_1.putAPIPost);
module.exports = router;
