"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
exports.default = [
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        // do something here in the future
        next();
    },
];
