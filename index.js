const http = require("http");
const exp = require("express");
const app = exp();
const server = http.createServer(app);
app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));
const { checkPoint } = require("./middleWares/index");

//Adding multer for file upload
const multer = require("multer");

//Making multer object
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

//Defined global Array
const globalUser = [];

//Getting data inside the boyd via post request.
app.post("/reg", (req, res) => {
  const data = req.body;
  pushToArr(data);
  res.json(data);
});

const pushToArr = (data) => {
  if (globalUser.push(data)) {
    console.log("pushed");
  }
  console.log(globalUser);
};

//Showing global array user data via get request.
app.get("/", (req, res) => {
  data = globalUser;
  res.send({ allUsers: data });
});

//Checking if the user exist inside arrahy via get query request.

app.get("/auth", (req, res) => {
  const id = Number(req.query.id);
  const result = globalUser.findIndex((x) => x.id === id);
  result != -1 ? res.send({ isPresent: true }) : res.send({ isPresent: false });
});

//Delete user from array with delete methods via "Params".

app.delete("/del/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = globalUser.findIndex((x) => x.id === id);
  if (result != -1) {
    const deleted = globalUser.splice(result, 1);
    const rest = globalUser;
    res.json({ deletedUser: deleted, restUsers: rest });
  } else {
    res.json({ isPresent: false });
  }
});

//Update global array via put method after getting query details

app.put("/upd", (req, res) => {
  const id = Number(req.query.id);
  const replace = req.query.name;
  const indx = globalUser.findIndex((x) => x.id === id);
  if (indx != -1) {
    globalUser.splice(indx, 1, { id: id, name: replace });
    const rest = globalUser;
    res.send({ isUpdated: true, userNow: rest });
  } else {
    res.send({ isUserPresent: false });
  }
});

//Using custom middleware for checking user details from post body data; Date : 20Oct...

app.post("/reguser", checkPoint, (req, res) => {
  console.log(":::::::🥳::::::::");
  return res.status(200).json({
    isCorrect: true,
    data: {
      name: req.body.name,
      age: req.body.age,
      married: req.body.married,
    },
  });
});

app.post("/upload", upload.single("fldnm"), (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const married = req.body.married;
  const picurl = req.file.path;
  globalUser.push({ name: name, age: age, married: married, picurl: picurl });

  res.send({ uploaded: true, userDetails: globalUser[0] });
});

app.post("/test", (req, res) => {
  return res.json({ data: req.body });
});

const PORT = process.env.PORT || 3000;
server.listen(3000, (err) => {
  !err
    ? console.log(`server listening on https://localhost:${PORT}/`)
    : console.log(`unable to start server ${err}`);
});
