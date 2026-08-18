import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import customErrorHandler from "../Util/customErrorHandler";

export default (apiRoot, routes) => {
  const app = express();

  app.use(
    cors({
      exposedHeaders: ["Content-Disposition"]
    })
  );

  app.use(compression());
  app.use(morgan("dev"));
  app.use(passport.initialize());
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(express.json({ limit: "50mb" }));

  app.use(apiRoot, routes);
  app.use(`${apiRoot}/uploads`, express.static(path.resolve(__dirname, "../../../assets/media")));
  app.use(`${apiRoot}/assets`, express.static(path.resolve(__dirname, "../../../assets/default_documents")));
  app.use(`${apiRoot}/image`, express.static(path.resolve(__dirname, "../../../assets/default_documents")));
  app.use(
    `${apiRoot}/temp_documents`,
    express.static(path.resolve(__dirname, "../../../assets/temp_documents"))
  );

  app.use(customErrorHandler);

  return app;
};
