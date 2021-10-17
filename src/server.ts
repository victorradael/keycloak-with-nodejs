import express from "express";
import dotenv from "dotenv";

dotenv.config();

import route from "./routes";

const app = express();

app.use(express.json());
app.use(route);

app.listen(3333, () => console.log("server running on port 3333"));
