import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

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
