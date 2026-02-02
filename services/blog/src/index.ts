import "./env";
import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Blog service running on http://localhost:${PORT}`);
});
