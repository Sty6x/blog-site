import { NextFunction } from "express";

const passport = require("passport");

export default [
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    // do something here in the future
    next();
  },
];
