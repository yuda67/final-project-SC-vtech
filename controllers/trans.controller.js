import transactionLog from "../services/trans.log.js";

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
            saldoTabungan: user.saldoTabungan,
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

export const tambahSaldo = prosesSaldo("tambah-saldo", "Saldo added successfully");
export const tarikSaldo = prosesSaldo("tarik-saldo", "Withdraw success");