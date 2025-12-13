import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectionDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      timeoutMS: 1000,
    });

    console.log(
      `✅ Connected to MongoDB: ${conn.connection.host}:${conn.connection.port}`
        .bgMagenta.bgWhite
    );
  } catch (error) {
    process.exit(1);
  }
};

export default connectionDB;
