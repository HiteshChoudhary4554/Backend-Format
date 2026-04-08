import server from "./src/app.js";
import connectDb from "./src/common/config/db.js";
import dotenv from "dotenv";

dotenv.config("/.env");
const PORT = process.env.PORT;

async function start() {
  await connectDb();
  server.listen(PORT, () => {
    console.log(`server runing on PORT ${PORT}`);
  });
}

start().catch((err) => {
  console.log("failed to start server. ", err.message);
  process.exit(1);
});
