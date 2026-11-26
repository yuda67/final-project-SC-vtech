import connectDB from "./config/database.js";
import app from "./app.js";

import dotenv from "dotenv";
dotenv.config({
    path: ".env"
});

const startServer = async () => {
    try {
        await connectDB();
        app.on("error", (error) => {
            console.error("Express app error:", error);
            throw error;
        });
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

startServer();