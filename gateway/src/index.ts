import 'dotenv/config';
import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp();
app.listen(config.port, () =>
  console.log(`Gateway listening on port :${config.port}`),
);
