import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import "express-async-errors";

import userRouter from "./routes/user.routes";
import movieRouter from "./routes/movie.routes";
import ratingRouter from "./routes/rating.routes";
import handleErrors from "./middleware/handleErrors";
import authRouter from "./routes/auth.routes";

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());

app.use(authRouter);
app.use("/users", userRouter);
app.use("/movies", movieRouter);
app.use("/ratings", ratingRouter);

app.use(handleErrors);

export default app;
