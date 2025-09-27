import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors()); //i need to change this before deployment !!!
app.use(express.json());

app.post("/api/admin/login", (req, res) => {
  console.log(req.body);
  res.status(200).json({ trialOnly: "okay" });
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
