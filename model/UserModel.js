const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    saveUser: async (username, email, password) => {
        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return { error: "Email already used!" };
            }

            const newUser = new UserModel({ username, email, password });
            const savedUser = await newUser.save();
            return savedUser;
        } catch (err) {
            throw err;
        }
    },

    getAllUsers: async () => {
        try {
            const users = await UserModel.find({}, { password: 0 });
            return users;
        } catch (err) {
            throw err;
        }
    },

    getUser: async (id) => {
        try {
            const user = await UserModel.findById(id, { password: 0 });
            return user;
        } catch (err) {
            throw err;
        }
    },

    getuserByEmail: async (email) => {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (err) {
            throw err;
        }
    },

    updateUser: async (username, email, id) => {
        try {
            const emailExists = await UserModel.findOne({ email, _id: { $ne: id } });
            if (emailExists) {
                return { error: "Email already used!" };
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                { username, email },
                { new: true, select: "-password" }
            );

            return updatedUser;
        } catch (err) {
            throw err;
        }
    },

    deleteUser: async (id) => {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(id);
            return deletedUser;
        } catch (err) {
            throw err;
        }
    }
}
