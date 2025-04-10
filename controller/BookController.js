const BookModel = require('../model/BookModel');

require('dotenv').config();

module.exports = {
    insertBook: async (req, res) => {
        const {
            book_type,
            book_name,
            isbn,
            published_year,
            quantity,
            subject,
            academic_year,
            book_author
        } = req.body

        try {

            const bookSaved = await BookModel.saveNewBook(
                book_type,
                book_name,
                isbn,
                published_year,
                quantity,
                subject || null,
                academic_year || null,
                book_author || null
            );

            if (bookSaved.error)
                return res.status(400).json({ messageError: bookSaved.error });

            return res.status(201).json({ message: "Book successfully added.", book: bookSaved });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in saving course book", error: err })
        }
    },

    getAllBooks: async (req, res) => {
        try {
            const books = await BookModel.getAllBooks();

            if (books.length > 0) {
                return res.status(200).json({ Books: books });
            }

            return res.status(204).json({ messageError: "No Books Found" })

        } catch (err) {
            return res.status(500).json({ message: "Error occured in getting all books." })
        }
    },

    getBookById: async (req, res) => {
        const { id } = req.params;

        try {
            const book = await BookModel.getBookById(id);
            if (book.length === 0)
                return res.status(404).json({ message: "Book not Found." })

            return res.status(200).json(book);


        } catch (err) {
            return res.status(500).json({ message: "Errot occured in getting Book with specified id." })

        }
    },

    getCourseBooks: async (req, res) => {
        try {

            const courseBooks = await BookModel.getCourseBooks();

            if (courseBooks.length > 0)
                return res.status(200).json({ courseBooks: courseBooks });

            return res.status(204).json({ messageError: "No Books Found" })

        } catch (err) {
            return res.status(500).json({ message: "Error occured in getting course books." })
        }
    },

    getNovelBooks: async (req, res) => {
        try {

            const Novels = await BookModel.getNovelBooks();

            if (Novels.length > 0)
                return res.status(200).json({ Novels: Novels })

            return res.status(404).json({ messageError: "No Novels are found" })

        } catch (err) {
            return res.status(500).json({ messageError: "Error occured in getting novel books." });
        }
    },

    //later

    updateBook: async (req, res) => {
        const {
            book_type,
            book_name,
            isbn,
            published_year,
            quantity,
            subject,
            academic_year,
            book_author
        } = req.body;
        const { id } = req.params;

        try {

            const bookToUpdate = await BookModel.getBookById(id);

            if (bookToUpdate.length === 0)
                return res.status(404).json({ message: "Book not Found." });

            const updatedBook = await BookModel.updateCourseBook(
                book_type,
                book_name,
                isbn,
                published_year,
                quantity,
                subject,
                academic_year,
                book_author, 
                id
            );

            if (updatedBook.affectedRows > 0)
                return res.status(200).json({ message: "Book Updated successfully", book: updatedBook });

            return res.status(400).json({ messageError: "Book not updated" });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in updating course book" })
        }
    },



    deleteBook: async (req, res) => {
        const { id } = req.params;

        try {

            const bookToDelete = await BookModel.getBookById(id);

            if (bookToDelete.length === 0)
                return res.status(404).json({ message: "Book not Found." });

            const deletedBook = await BookModel.deleteBook(id);

            if (deletedBook.affectedRows > 0)
                return res.status(200).json({ message: "Book deleted successfully" });

            return res.status(400).json({ messageError: "Book not deleted" });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in deleting course book" })
        }
    },

    lendBook: async (req, res) => {
        const { book_id, borrower_name, academic_year } = req.body;

        try {
            if (!book_id || !borrower_name || !academic_year)
                return res.status(404).json({ messageError: "Missing Required Fields" });


            const desiredBook = await BookModel.getBookById(book_id);

            if (desiredBook.length === 0)
                return res.status(404).json({ messageError: "Desired book(s) Not Found." });

            const bookToLend = desiredBook[0];

            const availableQuantity = bookToLend.quantity;

            if (availableQuantity <= 0)
                return res.status(404).json({ messageError: "No Copies left to lend" });

            const updatedQuantity = availableQuantity - 1;

            await BookModel.updateBook(
                bookToLend.book_type,
                bookToLend.book_name,
                bookToLend.isbn,
                bookToLend.published_year,
                updatedQuantity,
                bookToLend.subject,
                bookToLend.academic_year,
                bookToLend.book_author,
                bookToLend.book_id
            );

            const date = new Date();

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            const lend_date = `${year}-${month}-${day}`;

            const lendedBook = await BookModel.lendBook(bookToLend.book_id, borrower_name, academic_year, lend_date);

            if (lendedBook.affectedRows > 0)
                return res.status(200).json(
                    {
                        message: "Book Lent Successfully",
                        book: {
                            book_id: bookToLend.book_id,
                            author: bookToLend.book_author,
                            borrower: borrower_name,
                            lend_date: lend_date
                        }

                    }
                )


        } catch (err) {
            return res.status(500).json({ messageError: "Error in lending  Book", err: err });
        }

    }, 


    getLendedBooks: async (req, res) => {
        try {
            const lendedBooks = await BookModel.getLendedBooks();

            if (lendedBooks.length > 0)
                return res.status(200).json({ lendedBooks: lendedBooks });

            return res.status(204).json({ messageError: "No Lended Books Found" })

        } catch (err) {
            return res.status(500).json({ message: "Error occured in getting lended books." })
        }
    },



}