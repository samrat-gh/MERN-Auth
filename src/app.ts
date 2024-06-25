import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(cookieParser());

// replacement to traditional bodyparser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//routes import
import userRouter from "./routes/user.routes";

//routes declaration
app.use("/api/v1/users", userRouter);

// http://localhost:8000/api/v1/users/register

app.get("/", (req, res, next) => {
  res.send("Here We Go!");
  console.log(`Server running at http://localhost::${process.env.PORT}`);
});

export { app };
