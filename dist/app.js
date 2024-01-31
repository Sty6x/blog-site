"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const express_handlebars_1 = require("express-handlebars");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const postModel_1 = require("./model/postModel");
const asyncHandler_1 = __importDefault(require("./utils/asyncHandler"));
const CustomError_1 = __importDefault(require("./utils/CustomError"));
const categoryModel_1 = require("./model/categoryModel");
const compression = require("compression");
const cors = require("cors");
const app = (0, express_1.default)();
const port = 3000;
const posts = require("./routes/post");
const searchQueryMiddlewares = require("./middleware/searchQuery");
const category = require("./routes/category");
const apiIndex = require("./api/index");
const handlebarsHelpers = require("./utils/handlebarsHelpers");
const uri = process.env.MONGODB_URI;
mongoose_1.default.set("strictQuery", false);
async function startMongooseServer(uri) {
    await mongoose_1.default.connect(uri);
}
startMongooseServer(uri).catch((err) => console.log(err));
// handlebars helpers
const handlebars = (0, express_handlebars_1.create)({
    runtimeOptions: { allowProtoPropertiesByDefault: true },
    helpers: handlebarsHelpers,
});
app.use(compression());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
app.listen(port, () => {
    console.log("Listening at port: " + port);
});
// API Endpoints
app.use("/api", apiIndex);
// Page Route Resources
app.get("/", (0, asyncHandler_1.default)(async (req, res, next) => {
    const queryFeaturedPosts = await postModel_1.Post.find({ isFeatured: true }).exec();
    const queryCategories = await categoryModel_1.Category.find({
        name: { $ne: "uncategorized" },
    }).exec();
    if (!queryCategories) {
        const err = new CustomError_1.default("Unable to fetch categories", 404);
        throw err;
    }
    if (!queryFeaturedPosts) {
        const err = new CustomError_1.default("Unable to fetch posts", 404);
        throw err;
    }
    // fetch isFeatured and recent blog posts
    res.render("index", {
        isPost: false,
        pageTitle: "FEATURED POSTS",
        data: { posts: queryFeaturedPosts, categories: queryCategories },
    });
}));
app.get("/search", searchQueryMiddlewares);
app.use("/", category);
app.use("/:category", posts);
// API Error handling middleware
app.use((err, req, res, next) => {
    res.json({
        message: err.message,
        statusCode: err ? err.statusCode : res.statusCode,
    });
});
