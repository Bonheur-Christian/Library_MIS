const UserModel = require('../model/UserModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const saltRound = parseInt(process.env.SALT_ROUND || "10", 10);

module.exports = {
    saveNewUser: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            if (!username || !email || !password)
                return res.status(400).json({ messageError: "Missing required fields" });

            const hashedPassword = await bcrypt.hash(password, saltRound);

            const user = await UserModel.saveUser(username, email, hashedPassword);

            if (user.error) {
                return res.status(400).json({ messageError: user.error });
            }

            return res.status(201).json({ message: "User saved in database", user });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in saving user", error: err });
        }
    },

    getAllUsersFromDB: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();

            if (!users.length)
                return res.status(404).json({ messageError: "No users found" });

            return res.status(200).json({ message: "Users retrieved successfully", users });
        } catch (err) {
            return res.status(500).json({ messageError: "Error in getting users", error: err });
        }
    },

    getUserByID: async (req, res) => {
        const { id } = req.params;

        try {
            const user = await UserModel.getUser(id);

            if (!user)
                return res.status(404).json({ messageError: "User not found" });

            return res.status(200).json({ message: "User retrieved successfully", user });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in getting user", error: err });
        }
    },

    updateUserByID: async (req, res) => {
        const { username, email } = req.body;
        const { id } = req.params;

        try {
            if (!username || !email)
                return res.status(400).json({ messageError: "Missing required fields" });

            const updatedUser = await UserModel.updateUser(username, email, id);

            if (updatedUser.error) {
                return res.status(400).json({ messageError: updatedUser.error });
            }

            return res.status(200).json({ message: "User updated", user: updatedUser });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in updating user", error: err });
        }
    },

    deleteUserFromDB: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedUser = await UserModel.deleteUser(id);

            if (!deletedUser)
                return res.status(404).json({ messageError: "User not found" });

            return res.status(200).json({ message: "User deleted" });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in deleting user", error: err });
        }
    }
};
