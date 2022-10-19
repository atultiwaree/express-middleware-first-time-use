const exprso = require("express");
const app = exprso();
const http = require("http");
const server = http.createServer(app);

const appMid = (req, res, next) => {
  console.log(req.url);
  console.log(req.method);
  next();
};

app.use(appMid);

app.get("/", (req, res) => {
  return res.send("Yo! started..");
});

app.get("/v", (req, res) => {
  return res.send("Yo! started..V");
});

server.listen(3001, () => {
  console.log("started....");
});
