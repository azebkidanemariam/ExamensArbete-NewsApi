import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRouter from "./routes/userRoutes";
import contentRouter from "./routes/contentroutes";
import ErrorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/content", contentRouter);
app.use(ErrorHandler);

const port = 3000;

app.listen(port, () => {
  console.log(`Application running on port ${port}.`);
});
