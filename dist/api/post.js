"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controller/postController");
const router = express_1.default.Router();
router.get("/:postId", postController_1.getAPIPost);
router.post("/create", postController_1.postAPIPost);
router.delete("/:postId/delete", postController_1.deleteAPIPost);
router.put("/:postId/update", postController_1.putAPIPost);
module.exports = router;
