import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import TransLog from "../models/transLog.model.js";

const registerUser = async(req, res) => {
    try {
        const{ username, password, targetTabungan } = req.body;
        if(!username || !password || !targetTabungan){
            return res.status(400).json({
                message: "username, password, and targetTabungan are required"
            })
        };
        const existing = await User.findOne({username});
        if(existing){
            return res.status(400).json({
                message: "username already exists"
            })
        }

        const user = await User.create({
            username,
            password,
            targetTabungan
        });
        res.status(201).json({
            message: "User registered",
            user: {id: user._id,
                username: user.username, 
                saldoTabungan: user.saldoTabungan, 
                targetTabungan: user.targetTabungan, 
                percentageTarget: user.percentageTarget }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
            return res.status(400).json({
                message: "username and password are required"
            });
        }
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }
        const tokenPayload = { id: user._id.toString(), username: user.username };
        const token = jwt.sign({ ...tokenPayload, type: "access" }, process.env.JWT_SECRET, { expiresIn: "15m" });
        return res.status(200).json({
            message: "Login successful",
            user: {id: user._id,
                username: user.username, 
                saldoTabungan: user.saldoTabungan, 
                targetTabungan: user.targetTabungan, 
                percentageTarget: user.percentageTarget },
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const seeProfile = async (req, res) => {
    try {
        const user = await User.findById(req.auth.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.percentageTarget = user.targetTabungan > 0 ? `${((user.saldoTabungan / user.targetTabungan) * 100).toFixed(2)}%` : "0%";

        return res.status(200).json({
            message: "User profile retrieved",
            user: { id: user._id,
                username: user.username, 
                saldoTabungan: user.saldoTabungan, 
                targetTabungan: user.targetTabungan, 
                percentageTarget: user.percentageTarget }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateTargetTabungan = async (req, res) => {
    try {
        const { targetTabungan } = req.body;
        if (typeof targetTabungan !== "number" || targetTabungan < 0) {
            return res.status(400).json({ message: "Invalid targetTabungan" });
        }
        const user = await User.findByIdAndUpdate(
            req.auth.id,
            { targetTabungan },
            { returnDocument: 'after' }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.percentageTarget = user.targetTabungan > 0 ? `${((user.saldoTabungan / user.targetTabungan) * 100).toFixed(2)}%` : "0%";
        return res.status(200).json({
            message: "Target tabungan updated",
            user: { id: user._id,
                username: user.username, 
                saldoTabungan: user.saldoTabungan, 
                targetTabungan: user.targetTabungan, 
                percentageTarget: user.percentageTarget }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.auth.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.saldoTabungan > 0) {
            return res.status(400).json({ message: "masih terdapat saldo tabungan" });
        }
        await TransLog.deleteMany({ userId: req.auth.id });
        const deletedUser = await User.findOneAndDelete({ _id: req.auth.id, saldoTabungan: 0 });
        if (!deletedUser) {
            return res.status(400).json({ message: "akun gagal dihapus" });
        }
        return res.status(200).json({ message: "akun berhasil dihapus" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {registerUser, loginUser, seeProfile, updateTargetTabungan, deleteUser};
