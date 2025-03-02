const bcrypt = require("bcrypt");

const user = await User.findOne({ email });
if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
}

const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
}
