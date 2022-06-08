require("dotenv").config();
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const express = require("express");
const PORT = process.env.PORT || 3009;
const app = express();
app.use(express.json());
app.use("/api", jsonServer.defaults(), jsonServer.router("db.json"));

const users = [
  {
    username: "evondev",
    fullname: "Tran Anh Tuan",
  },
  {
    username: "thangtkt",
    fullname: "Phan Tan Thang",
  },
];

app.get("/users", authenticateToken, (req, res) => {
  res.json(users.filter((user) => user.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
