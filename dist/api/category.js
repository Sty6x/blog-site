"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controller/categoryController");
const router = express_1.default.Router();
router.get("/:category", categoryController_1.getAPICategory);
router.post("/category/create", categoryController_1.postAPICategory);
router.delete("/:category", categoryController_1.deleteAPICategory);
router.put("/:category/update", categoryController_1.putAPICategory);
module.exports = router;
