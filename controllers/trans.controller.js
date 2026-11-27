import {User} from "../models/user.model.js";


const tambahSaldo = async (req, res) => {
    try {
        const { amount } = req.body;
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }
        const user = await User.findByIdAndUpdate(req.auth.id,
            {$inc: { saldoTabungan: amount }},
            { returnDocument: 'after' }// mengembalikan dokumen yang diperbarui setelah operasi pembaruan
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Saldo added successfully",
            user: { id: user._id, username: user.username, saldoTabungan: user.saldoTabungan }
        });
    } catch (error) {
        console.error("Tambah saldo error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { tambahSaldo };