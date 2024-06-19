import express from "express";

const app = express();

app.get("/", (req, res, next) => {
  res.send("Here We Go!");
  console.log(`Server running at http://localhost::${process.env.PORT}`);
});

export { app };
