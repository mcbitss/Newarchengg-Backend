import http from "http";
import moment from "moment";
import "regenerator-runtime/runtime";
import api from "./api";
import { mongo, port } from "./config";
import express from "./services/express";
import mongoose from "./services/mongoose";

const app = express("/api", api);
const server = http.createServer(app);

moment.updateLocale("en", {
  week: {
    dow: 1
  }
});

// moment.tz.setDefault("Etc/UTC");

global.momentData = moment;

mongoose.connect(mongo.uri);
mongoose.Promise = Promise;

setImmediate(() => {
  server.listen(port, () => {
    console.log(`Express server listening to the port ${port}`);
  });
});

server.setTimeout(10 * 60 * 1000);

export default app;
