import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = 4000;

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`🟢 Potholes Server listening on http://localhost:${port}`);
});
