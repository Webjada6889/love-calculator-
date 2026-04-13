const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/loveApp");

// ================= USER MODEL =================
const User = mongoose.model("User", {
    username: String,
    password: String,
    history: Array
});

const SECRET = "love_secret_key";

// ================= REGISTER =================
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashed,
        history: []
    });

    await user.save();

    res.json({ message: "Account created ❤️" });
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({ token });
});

// ================= LOVE CALCULATOR =================
function calculateLove(n1, n2) {
    let sum = 0;
    const str = (n1 + n2).toLowerCase();

    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }

    return (sum % 60) + 40;
}

// ================= SAVE RESULT =================
app.post("/calculate", async (req, res) => {
    const { name1, name2, token } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findById(decoded.id);

        const score = calculateLove(name1, name2);

        const result = {
            name1,
            name2,
            score,
            date: new Date()
        };

        user.history.push(result);
        await user.save();

        res.json(result);

    } catch (err) {
        res.json({ error: "Invalid token" });
    }
});

// ================= HISTORY =================
app.post("/history", async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findById(decoded.id);

        res.json(user.history);

    } catch {
        res.json([]);
    }
});

app.listen(3000, () => console.log("Server running on 3000"));