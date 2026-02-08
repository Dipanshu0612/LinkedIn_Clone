import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = process.env.MONGO_DB_URL as string;

if (!connection) {
  throw new Error("Please provide a valid connection!");
}

const connectDB = async () => {
  if (mongoose.connection?.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(connection);
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
  }
};
export default connectDB;
