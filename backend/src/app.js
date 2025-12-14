import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectionDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

connectionDB();

app.use("/api/v1/auth", authRoutes);

app.use("/test", async (req, res) => {
  return res.status(200).send("<h1>Hello Travel Core Api 🚀</h1>");
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`"Server is running on port : ${PORT}`.bgGreen.bgWhite);
});
