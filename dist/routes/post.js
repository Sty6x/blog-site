"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", (req, res, next) => {
    next();
});
router.get("/:postId", (req, res) => {
    console.log(req.params);
    res.render("post");
});
module.exports = router;
