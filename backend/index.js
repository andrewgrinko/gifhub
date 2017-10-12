require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const requestLog = require("express-request-log");
const { resolve } = require("path");

const log = require("./providers/log");
const routes = require("./routes");
const detectMobile = require("./detect-mobile");

const port = process.env.port || 3000;
const app = express();

process.on("uncaughtException", function(e) {
  log.error("fatal", { error: e.message, stack: e.stack }, () =>
    process.exit(75)
  );
});

app.use(requestLog(log, { headers: false, request: false, response: false }));
app.use(helmet());
app.use(bodyParser.json());
app.use(detectMobile);

app.use("/", routes);
app.use(express.static(__dirname + "/../frontend/dist/"));

app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname + "/../frontend/dist/index.html"));
});

// eslint-disable-next-line
app.use((e, req, res, next) => {
  log.error("application error", { error: e.message, stack: e.stack });
  res.status(500).end();
});

const server = app.listen(port, "0.0.0.0", () =>
  log.info("gifhub started", { pid: process.pid, port: port })
);

process.on("SIGINT", () => {
  server.close(e => {
    log.info("gifhub stopped", { error: e && e.message }, () =>
      process.exit(e ? 1 : 0)
    );
  });
});
