const UserModel = require('../model/UserModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const saltRound = parseInt(process.env.SALT_ROUND || "10", 10);

module.exports = {
    saveNewUser: async (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ messageError: "Missing required fields" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, saltRound);

            const result = await UserModel.saveUser(username, email, hashedPassword);

            if (result.error) {
                return res.status(400).json({ messageError: result.error });
            }

            return res.status(201).json({
                message: "User saved in database",
                user: {
                    _id: result._id,
                    username: result.username,
                    email: result.email,
                    createdAt: result.createdAt,
                }
            });

        } catch (err) {
            console.error("Error in saveNewUser:", err);
            return res.status(500).json({
                messageError: "Error in saving user",
                error: err.message || err,
            });
        }
    },

    getAllUsersFromDB: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();

            if (!users.length) {
                return res.status(404).json({ messageError: "No users found" });
            }

            return res.status(200).json({
                message: "Users retrieved successfully",
                users,
            });
        } catch (err) {
            console.error("Error in getAllUsersFromDB:", err);
            return res.status(500).json({ messageError: "Error in getting users", error: err.message });
        }
    },

    getUserByID: async (req, res) => {
        const { id } = req.params;

        try {
            const user = await UserModel.getUser(id);

            if (!user) {
                return res.status(404).json({ messageError: "User not found" });
            }

            return res.status(200).json({
                message: "User retrieved successfully",
                user,
            });
        } catch (err) {
            console.error("Error in getUserByID:", err);
            return res.status(500).json({ messageError: "Error in getting user", error: err.message });
        }
    },

    updateUserByID: async (req, res) => {
        const { username, email } = req.body;
        const { id } = req.params;

        if (!username || !email) {
            return res.status(400).json({ messageError: "Missing required fields" });
        }

        try {
            const updatedUser = await UserModel.updateUser(username, email, id);

            if (updatedUser.error) {
                return res.status(400).json({ messageError: updatedUser.error });
            }

            return res.status(200).json({
                message: "User updated",
                user: updatedUser,
            });
        } catch (err) {
            console.error("Error in updateUserByID:", err);
            return res.status(500).json({ messageError: "Error in updating user", error: err.message });
        }
    },

    deleteUserFromDB: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedUser = await UserModel.deleteUser(id);

            if (!deletedUser) {
                return res.status(404).json({ messageError: "User not found" });
            }

            return res.status(200).json({ message: "User deleted" });
        } catch (err) {
            console.error("Error in deleteUserFromDB:", err);
            return res.status(500).json({ messageError: "Error in deleting user", error: err.message });
        }
    }
};
