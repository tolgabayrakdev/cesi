import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth-routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(1234, () => {
    console.log("Server is running on port 1234");
});