import "dotenv/config";

import { app } from "./app";
import { ConnectDB } from "./db/db";

ConnectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log("🚀🚀");
  });
});
