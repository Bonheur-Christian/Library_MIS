const mongoose = require('mongoose');

// Define the schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Create the model
const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    // Save new user
    saveUser: async (username, email, hashedPassword) => {
        try {
            console.log("Checking if email exists:", email);
            const existingUser = await UserModel.findOne({ email });

            if (existingUser) {
                console.warn("Email already in use:", email);
                return { error: "Email already used!" };
            }

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
            });

            console.log("Saving new user:", newUser);
            const savedUser = await newUser.save();

            return savedUser;
        } catch (err) {
            console.error("Error saving user:", err);
            return { error: "Failed to save user", details: err.message || err };
        }
    },

    // Get all users (excluding passwords)
    getAllUsers: async () => {
        try {
            return await UserModel.find({}, { password: 0 });
        } catch (err) {
            console.error("Error fetching all users:", err);
            throw err;
        }
    },

    // Get user by ID (excluding password)
    getUser: async (id) => {
        try {
            return await UserModel.findById(id, { password: 0 });
        } catch (err) {
            console.error("Error fetching user by ID:", err);
            throw err;
        }
    },

    // Get user by email (includes password for login use)
    getuserByEmail: async (email) => {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            console.error("Error fetching user by email:", err);
            throw err;
        }
    },

    // Update user (excluding password)
    updateUser: async (username, email, id) => {
        try {
            const emailExists = await UserModel.findOne({ email, _id: { $ne: id } });

            if (emailExists) {
                console.warn("Email conflict on update:", email);
                return { error: "Email already used!" };
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                { username, email },
                { new: true, select: "-password" }
            );

            return updatedUser;
        } catch (err) {
            console.error("Error updating user:", err);
            throw err;
        }
    },

    // Delete user by ID
    deleteUser: async (id) => {
        try {
            return await UserModel.findByIdAndDelete(id);
        } catch (err) {
            console.error("Error deleting user:", err);
            throw err;
        }
    }
};
