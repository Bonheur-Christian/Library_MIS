const UserModel = require("../model/UserModel");
const bcrypt = require('bcryptjs');

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await UserModel.getuserByEmail(email);

            if (!user)
                return res.status(404).json({ messageError: "Invalid Credentials" });

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch)
                return res.status(400).json({ messageError: "Invalid Password" });

            req.session.user = {
                id: user._id, // <-- Changed here
                email: user.email,
                username: user.username
            };

            return res.status(200).json({ user: req.session.user });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in user login", Error: err });
        }
    },

    logout: async (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ messageError: "Failed to logout" });
                }
                res.clearCookie("connect.sid");
                return res.status(200).json({ message: "User logged out" });
            });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in logging out" });
        }
    }
};
