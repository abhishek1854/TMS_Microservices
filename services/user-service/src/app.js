import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/api/v1/users", (req, res) => {
  res.send("User Service is running");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});