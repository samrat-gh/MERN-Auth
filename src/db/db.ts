import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const { MONGODB_URI } = process.env;

const ConnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    console.log("DB Connected on HOST :", connectionInstance.connection.host);
  } catch (err: any) {
    console.log("DB Connection failed ! :", err.message);
    process.exit(1);
  }
};

export { ConnectDB };
