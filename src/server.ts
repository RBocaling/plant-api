import "dotenv/config";
import app from "./app";

const PORT = 7007;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
