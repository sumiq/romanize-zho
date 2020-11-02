const express = require("express");
const sassMiddleware = require("node-sass-middleware");

const { emc, yue, cmn, yueAsciify, } = require("./convert.js");

const app = express();
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(sassMiddleware({
  src: "sass",
  dest: "public",
  indentedSyntax: true,
  outputStyle: "compressed",
  debug: true,
  force: true,
}));

app.get("/", (req, res) => {
  res.render("index", {
    title: "romanize chinese",
    text: req.query.text,
  });
});

app.get("/result", (req, res) => {
  const text = req.query.text;
  res.render("result", {
    title: "romanize chinese: result",
    emc: emc(text),
    cmn: cmn(text),
    yue: yue(text),
    yueAscii: yueAsciify(yue(text)),
  });
});

app.get("/json", (req, res) => {
  const text = req.query.text;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    emc: emc(text),
    cmn: cmn(text),
    yue: yue(text),
    yueAscii: yueAsciify(yue(text)),
  }));
});

const port = process.env.PORT || 8080;
console.log(`listen http://localhost:${port}.`);
app.listen(port);
