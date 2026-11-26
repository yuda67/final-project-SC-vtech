import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access token is required" });
    }

    try {
        const payload = jwt.verify(authorization.slice(7), process.env.JWT_SECRET);
        if (payload.type !== "access" || !payload.id || !payload.username) {
            return res.status(401).json({ message: "Invalid access token" });
        }
        req.auth = { id: payload.id, username: payload.username };
        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired access token" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default requireAuth;
