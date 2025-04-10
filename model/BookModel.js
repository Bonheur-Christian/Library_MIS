const { get } = require("../routes/UserRoute");
const connection = require("./config");
require('dotenv').config();

const BookModel = {

    saveNewBook: async (book_type, book_name, isbn, published_year, quantity, subject, academic_year, book_author) => {
        const insertQuery = "INSERT INTO books( book_type,book_name, isbn, published_year, quantity, subject, academic_year, book_author) VALUES( ? , ? , ? , ? , ? , ? , ? , ? )";
        try {

            const [similarBook] = await connection.execute("SELECT * FROM books WHERE isbn = ?", [isbn]);

            if (similarBook.length > 0)
                return { error: "Book already exists" }

            const [results] = await connection.execute(insertQuery, [book_type, book_name, isbn, published_year, quantity, subject, academic_year, book_author]);

            return results;

        } catch (err) {
            console.log(err);
            throw err;

        }
    },

    lendBook: async (book_id, borrower_name, academic_year, lend_date) => {

        const insertQuery = "INSERT INTO lended_books(book_id , borrower_name, academic_year, lend_date) VALUES(?, ?, ?, ?)";

        try {

            const [results] = await connection.execute(insertQuery, [book_id, borrower_name, academic_year, lend_date]);

            return results;

        } catch (err) {
            console.log(err);
            throw new err;

        }

    },

    getBookById: async (id) => {
        const getQuery = "SELECT * FROM books WHERE book_id = ?";

        try {

            const [results] = await connection.execute(getQuery, [id]);


            return results;

        } catch (err) {
            console.log(err);
            throw err;

        }
    },

    getAllBooks: async () => {
        const getQuery = "SELECT * FROM books";

        try {
            const [results] = await connection.execute(getQuery);

            return results;
        } catch (err) {
            console.log(err);
            throw err;

        }
    },

    getCourseBooks: async () => {
        const getQuery = "SELECT book_id,  book_name, subject, academic_year, isbn, published_year, quantity FROM books WHERE book_type = 'course'";

        try {
            const [results] = await connection.execute(getQuery);

            return results;
        } catch (err) {
            console.log(err);
            throw err;

        }
    },

    getNovelBooks: async () => {
        const getQuery = "SELECT book_id, book_name, isbn, published_year, quantity, book_author FROM books WHERE book_type = 'novel'";

        try {
            const [results] = await connection.execute(getQuery);

            return results;
        } catch (err) {
            console.log(err);
            throw err;

        }
    },

    getLendedBooks: async () => {
        const getQuery = "SELECT b.book_name,le.lended_id,  le.borrower_name, le.academic_year, le.lend_date FROM lended_books as le JOIN books as b ON b.book_id  = le.book_id";

        try {
            const [results] = await connection.execute(getQuery);

            return results;
        } catch (err) {
            console.log(err);
            throw err;

        }
    },


    updateBook: async (book_type, book_name, isbn, published_year, quantity, subject, academic_year, book_author, id) => {
        const updateQuery = "UPDATE books SET book_type = ?, book_name = ?, isbn = ?, published_year = ?, quantity = ? , subject = ?, academic_year = ?, book_author = ? WHERE book_id = ?";        

        try {
            const [results] = await connection.execute(updateQuery, [book_type, book_name, isbn, published_year, quantity, subject, academic_year, book_author, id]);
            return results;
        } catch (err) {
            console.log(err);
            throw err;

        }
    },



    deleteBook: async (id) => {
        const deleteQuery = "DELETE FROM books WHERE book_id =?";

        try {
            const [results] = await connection.execute(deleteQuery, [id]);

            return results;
        } catch (err) {
            console.log(err);
            throw err;

        }
    },

    getLendedBookById: async (id) => {

        const getQuery = "SELECT * FROM lended_books WHERE lended_id = ?";
        try {

            const [results] = await connection.execute(getQuery, [id]);

            return results;

        } catch (err) {
            console.log(err);
            throw new err;

        }

    },

    deleteLendedBook: async (id) => {
        const deleteQuery = "DELETE FROM lended_books WHERE lended_id = ?";
        try {

            const [results] = await connection.execute(deleteQuery, [id]);

            return results;

        } catch (err) {
            console.log(err);
            throw new err;


        }

    },


    returnLendedBook: async (book_id, borrower_name, academic_year, lend_date, lend_id) => {
        const updateQuery = "UPDATE lended_books SET book_id = ?, borrower_name = ?, academic_year = ?, lend_date = ? WHERE lend_id = ?";
        try {

            const [results] = await connection.execute(updateQuery, [book_id, borrower_name, academic_year, lend_date, lend_id]);

            return results;

        } catch (err) {
            console.log(err);
            throw err;

        }

    }



}

module.exports = BookModel;