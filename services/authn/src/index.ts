import "./env";
import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Authn service running on http://localhost:${PORT}`);
});
