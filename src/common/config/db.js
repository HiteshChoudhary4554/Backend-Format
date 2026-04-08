import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";

async function connectDb() {
  const conn = await mongoose.connect(
    `${process.env.MONGODB_URI}/${DB_NAME}`,
  );

  console.log("DB connected successfully...",`[ ${conn.connection.host} ]`);
}

export default connectDb;
