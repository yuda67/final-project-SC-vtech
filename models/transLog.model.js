import mongoose, {Schema} from "mongoose";

const transLogSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        username: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ["tambah-saldo", "tarik-saldo"],
            required: true
        },
        keterangan: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("TransLog", transLogSchema);