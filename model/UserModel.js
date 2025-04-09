const connection = require("./config");

const UserModel = {

    saveUser: async (username, email, password) => {

        const query = "INSERT INTO users(username, email, password) VALUES (?, ?, ?)";

        try {

            const [existingUser] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

            if (existingUser.length > 0) {
                return { error: "Email already used!" }
            }

            const [results] = await connection.execute(query, [username, email, password]);

            return results;

        } catch (err) {
            if (err) throw err;

        }

    },

    getAllUsers: async () => {
        const query = "SELECT * FROM users";

        try {
            
            const [results] = await connection.execute(query);

            return results;

        } catch (err) {            
            throw err;

        }

    },

    getUser: async (id) => {
        const query = "SELECT username , email FROM users WHERE userID =?";
        try {

            const [results] = await connection.execute(query, [id]);

            return results;

        } catch (err) {
            
            throw err;

        }
    },

    getuserByEmail: async (email) => {
        const retrieveQuery = "SELECT * FROM users WHERE email = ?";

        try {

            const [userByEmail] = await connection.execute(retrieveQuery, [email]);            

            return (userByEmail.length > 0 )? userByEmail[0] : null



        } catch (err) {
            throw err;

        }
    },


    updateUser: async (username, email, id) => {

        const query = "UPDATE users SET username =?, email =? WHERE userID =?";
        try {

            const [results] = await connection.execute(query, [username, email, id])

            return results;

        } catch (err) {
            throw err;

        }
    },

    deleteUser: async (id) => {
        const deleteQuery = "DELETE FROM users WHERE userID = ?";

        try {

            const checkQuery = "SELECT * FROM users WHERE userID = ?"

            const [user] = await connection.execute(checkQuery, [id]);
            if (user.length === 0) {
                throw new Error("User not found");
            }

            const [results] = await connection.execute(deleteQuery, [id]);

            return results;

        } catch (err) {
            throw err;

        }
    }



}


module.exports = UserModel;