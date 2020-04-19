const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    avatar: {
        type: Buffer
    },
}, {
    timestamps: true
});

userSchema.statics.validateRegistration = async (email, username) => {
    if (await User.findOne({ email })) throw new Error("Email is already registered.");
    if (await User.findOne({ username })) throw new Error("Username is taken.");
}

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
