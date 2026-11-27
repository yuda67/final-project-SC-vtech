import transactionLog from "../services/trans.log.js";
import TransLog from "../models/transLog.model.js";

const prosesSaldo = (type, successMessage) => async (req, res) => {
    try {
        const { amount, keterangan } = req.body;
        if (!Number.isInteger(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
        }

        const user = await transactionLog({
        userId: req.auth.id,
        type,
        amount,
        keterangan,
        });

        return res.status(200).json({
        message: successMessage,
        user: {
            id: user._id,
            username: user.username,
            saldoBerhasil: amount,
        },
        });
    } catch (error) {
        if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
        }
        console.error(`${type} error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTransLog = async (req, res) => {
    try {
        const {type} = req.query;
        const filter = { userId: req.auth.id };
        if (type) {
            if (!["tambah-saldo", "tarik-saldo", "semua"].includes(type)) {
                return res.status(400).json({ message: "Invalid type" });
            }
            if (type !== "semua") {
                filter.type = type;
            }
        }
        const logs = await TransLog.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({ logs });
    } catch (error) {
        console.error("Get transaction log error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const tambahSaldo = prosesSaldo("tambah-saldo", "Saldo added successfully");
const tarikSaldo = prosesSaldo("tarik-saldo", "Withdraw success");

export { tambahSaldo, tarikSaldo, getTransLog };