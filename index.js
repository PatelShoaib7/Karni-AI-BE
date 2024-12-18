const express = require("express");
const { connection } = require("./DB/db-connection");
const auditLogger = require("./Middlewares/auditLogger");
const rateLimit = require("express-rate-limit");
const { Encode_JWT_TokenMiddleware, Decode_JWT_TokenMiddleware } = require("./Middlewares/auth-decode");
const { UserRouter } = require("./Routes/usersRouter");
const REQ_LIMIT = process.env.REQ_LIMIT

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());


const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: REQ_LIMIT,
    message: {
        error: true,
        message: "Too many login attempts. Please try again later.",
    },
});


app.use(auditLogger)
app.get("/login", loginRateLimiter, Encode_JWT_TokenMiddleware);


app.use(Decode_JWT_TokenMiddleware)
app.use("/user",UserRouter)


app.use("/",  async (req, res) => {
    if (req.url === "/") {
        return res.status(200).json({ errCode: -1, error: false, message: "Hello World" });
    }
    res.status(404).json({ error: true, message: "Route not found" });
});

// Start the server
app.listen(PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB successfully.");
        console.log(`Server is running on port ${PORT}.`);
    } catch (error) {
        console.error("Error during DB connection:", error.message);
    }
});
