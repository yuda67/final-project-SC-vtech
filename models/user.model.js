import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 1,
            maxLength: 40,
        },
        password: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50,
        },
        saldoTabungan: {
            type: Number,
            default: 0,
        },
        targetTabungan: {
            type: Number,
            required: true,
            default: 0,
        },
        percentageTarget: {
            type: String,
            default: "0%",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);