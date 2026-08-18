import md5 from "md5";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import Users from "../../api/users/model";
import { jwtSecret } from "../../config";
import { removeEmpty } from "../Util/Util";

const LocalStrategy = require("passport-local").Strategy;

const validateUser = async (email, pass, done) => {
  Users.findOne({ email, password: md5(pass) }, { password: 0 })
    .then((result) => {
      if (!result) {
        return done(false);
      }

      return done(result);
    })
    .catch((err) => {
      console.log(err);

      return done(false);
    });
};

export const password = () => (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ error: true, message: "Email and passowrd are required." });
  }

  return validateUser(req.body.email, req.body.password, (user) => {
    if (user) {
      req.user = user;
    }

    next();
  });
};

export const validateToken = () => (req, res, next) =>
  passport.authenticate("token", { session: false }, (user) => {
    if (user) {
      return res.send({ success: true, message: "Valid Access", result: user }).end();
    }

    return res.status(401).send({ success: false, message: "Unauthorized access" }).end();
  })(req, res, next);

export const token =
  ({ noUserData } = {}) =>
  (req, res, next) =>
    passport.authenticate("token", { session: false }, (user) => {
      if (user || (user && noUserData)) {
        req.user = user;
      } else {
        return res.status(401).send({ error: true, responseCode: 401, message: "Unauthorized access" }).end();
      }

      req.query = removeEmpty(req.query);

      return next();
    })(req, res, next);

passport.use(
  new LocalStrategy((email, pass, done) => {
    Users.findOne({ $or: [{ email }, { email }, { phone: email }] }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }

      if (!user.validPassword(pass)) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    });
  })
);

passport.use(
  "token",
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter("access_token"),
        ExtractJwt.fromBodyField("access_token"),
        ExtractJwt.fromAuthHeaderWithScheme("Bearer")
      ])
    },
    async (tokenData, done) => {
      const userData = await Users.findOne({ _id: tokenData.id, email: tokenData.email }, { password: 0 });

      if (userData) {
        return done(userData);
      }

      return done(false);
    }
  )
);
