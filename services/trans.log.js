import { User } from "../models/user.model.js";
import TransLog from "../models/transLog.model.js";

const transactionLog = async ({ userId, type, amount, keterangan }) => {
    const tarikSaldo = type === "tarik-saldo";
    const saldoVerif = tarikSaldo ? -amount : amount;
    const filter = { _id: userId };
    if (tarikSaldo) filter.saldoTabungan = { $gte: amount };
    const user = await User.findOneAndUpdate(
        filter,
        { $inc: { saldoTabungan: saldoVerif } },
        { returnDocument: "after" }
    );
    if (!user) {
        const exists = await User.exists({ _id: userId });
        const err = new Error(exists ? "saldo tidak cukup" : "User not found");
        err.statusCode = exists ? 400 : 404;
        throw err;
    }

    // 2. Catat log. Kalau gagal, kembalikan saldo (kompensasi)
    try {
        await TransLog.create({
        userId: user._id,
        username: user.username,
        amount,
        type,
        keterangan,
        });
        } catch (logError) {
            try {
            await User.findByIdAndUpdate(userId, { $inc: { saldoTabungan: -saldoVerif } });
            } catch (rollbackError) {
            console.error("CRITICAL: rollback saldo gagal untuk user", userId, rollbackError);
            }
            throw logError;
        }
        return user;
    };

export default transactionLog;