const UserModel = require('../model/UserModel');
const bcrypt = require('bcrypt')
require('dotenv').config();

const saltRound = parseInt(process.env.SALT_ROUND, 10)

module.exports = {

    saveNewUser: async (req, res) => {

        const { username, email, password } = req.body;
        try {

            if (!username || !email || !password)
                return res.status(404).json({ messageError: "Missing required fields" });


            const hashedPassword = await bcrypt.hash(password, saltRound);

            const user = await UserModel.saveUser(username, email, hashedPassword);

            if (user.error) {
                return res.status(400).json({ messageError: user.error })
            }

            return res.status(200).json({ message: "User saved In database", user: user });

        } catch (err) {
            if (err) throw err;

            return res.status(500).json({ messageError: "Error in saving user" })

        }
    },

    getAllUsersFromDB: async (req, res) => {

        try {
            const users = await UserModel.getAllUsers();            

            if (users.length > 0)
                return res.status(200).json({ message: "Users retrived successfully", users: users })


            return res.status(404).json({ messageError: "No users found" });
        } catch (err) {
            return res.status(500).json({ messageError: "Error in getting users." })
        }

    },

    getUserByID: async (req, res) => {
        const { id } = req.params;

        try {

            const user = await UserModel.getUser(id);
            console.log(user);
            

            if (user.length > 0)
                return res.status(200).json({ message: "User retrieved successfully.", user: user })


            return res.status(404).json({ messageError: "User not found." })


        } catch (err) {
            console.log(err);
            
            return res.status(500).json({ messageError: "Error in getting user." })
        }
    },

    updateUserByID: async (req, res) => {
        const { username, email } = req.body;
        const { id } = req.params;

        try {

            if (!username || !email)
                return res.status(400).json({ messageError: "Missing required fields" });

            const userToUpdate = await UserModel.getUser(id);


            if (userToUpdate.length > 0) {

                const updatedUser = await UserModel.updateUser(username, email, id);

                if (updatedUser.error) {
                    return res.status(400).json({ messageError: "User email already exists" });
                }
                return res.status(200).json({ message: "User Updated", user: updatedUser })

            }


        } catch (err) {
            return res.status(500).json({ messageError: "Error in updating user" })

        }
    },

    deleteUserFromDB: async (req, res) => {
        const { id } = req.params;

        try {

            const deletedUser = await UserModel.deleteUser(id);
            

            if (deletedUser.affectedRows > 0)
                return res.status(200).json({ message: "User deleted." })

            return res.statu(400).json({ messageError: "No user deleted" })

        } catch (err) {
            return res.status(500).json({ messageError: "Error in deleting user" , error:err});
        }
    }
}