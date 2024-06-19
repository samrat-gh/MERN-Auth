import "dotenv/config";

import { app } from "./app.js";
import { ConnectDB } from "./db/db.js";

const { PORT } = process.env;

ConnectDB().then(() =>
  app.listen(PORT || 8000, () => {
    console.log("Server running at http://localhost:", PORT);
  })
);
