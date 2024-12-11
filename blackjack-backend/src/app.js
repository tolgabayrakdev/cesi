import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth-routes.js";
import http from "http";
import { Server } from "socket.io";
import initializeSocket from "./socket/socket-handler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true
    },
})

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// Socket.io initialization
//initializeSocket(io);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(1234, () => {
    console.log("Server is running on port 1234");
});