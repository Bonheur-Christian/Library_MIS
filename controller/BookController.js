const BookModel = require('../model/BookModel');
require('dotenv').config();

module.exports = {
    insertBook: async (req, res) => {
        const {
            book_type,
            book_name,
            published_year,
            quantity,
            subject,
            academic_year,
            book_author
        } = req.body;

        try {
            const bookSaved = await BookModel.saveNewBook(
                book_type,
                book_name,
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
            return res.status(500).json({ messageError: "Error in saving course book", error: err });
        }
    },

    getAllBooks: async (req, res) => {
        try {
            const books = await BookModel.getAllBooks();
            if (books.length > 0)
                return res.status(200).json({ Books: books });

            return res.status(204).json({ messageError: "No Books Found" });

        } catch (err) {
            return res.status(500).json({ message: "Error occured in getting all books." });
        }
    },

    getBookById: async (req, res) => {
        const { id } = req.params;
        try {
            const book = await BookModel.getBookById(id);
            if (book.length === 0)
                return res.status(404).json({ message: "Book not Found." });

            return res.status(200).json({ book: book });

        } catch (err) {
            return res.status(500).json({ message: "Error occured in getting Book with specified id." });
        }
    },

    getCourseBooks: async (req, res) => {
        try {
            const courseBooks = await BookModel.getCourseBooks();
            if (courseBooks.length > 0)
                return res.status(200).json({ courseBooks });

            return res.status(204).json({ messageError: "No Books Found" });

        } catch (err) {
            return res.status(500).json({ message: "Error occured in getting course books." });
        }
    },

    getNovelBooks: async (req, res) => {
        try {
            const Novels = await BookModel.getNovelBooks();
            if (Novels.length > 0)
                return res.status(200).json({ Novels });

            return res.status(404).json({ messageError: "No Novels are found" });

        } catch (err) {
            return res.status(500).json({ messageError: "Error occured in getting novel books." });
        }
    },

    updateBook: async (req, res) => {
        const {
            book_type,
            book_name,
            published_year,
            quantity,
            subject,
            academic_year,
            book_author
        } = req.body;

        const { id } = req.params;

        try {
            const bookToUpdate = await BookModel.getBookById(id);

            if (!bookToUpdate)
                return res.status(404).json({ message: "Book not Found." });

            const updatedBook = await BookModel.updateBook(
                book_type,
                book_name,
                published_year,
                quantity,
                subject,
                academic_year,
                book_author,
                id
            );

            if (updatedBook)
                return res.status(200).json({
                    message: "Book updated successfully",
                    book: updatedBook
                });

            return res.status(400).json({ messageError: "Book not updated" });

        } catch (err) {
            console.error("Error in updateBook controller:", err);
            return res.status(500).json({ messageError: "Error in updating course book" });
        }
    },


    deleteBook: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedBook = await BookModel.deleteBook(id);

            if (!deletedBook) {
                return res.status(404).json({ message: "Book not found" });
            }

            return res.status(200).json({ message: "Book deleted successfully" });

        } catch (err) {
            console.log(err);

            if (err.message === 'Book Is Currently Lent') {
                return res.status(400).json({ messageError: err.message });
            }

            return res.status(500).json({ messageError: "Error in deleting course book" });
        }
    }

    ,


    lendBook: async (req, res) => {
        const { book_id, borrower_name, academic_year, book_code } = req.body;

        try {
            if (!book_id || !borrower_name || !academic_year || !book_code) {
                return res.status(400).json({ messageError: "Missing Required Fields" });
            }

            const desiredBook = await BookModel.getBookById(book_id);

            if (!desiredBook) {
                return res.status(404).json({ messageError: "Desired book not found." });
            }

            if (desiredBook.quantity <= 0) {
                return res.status(400).json({ messageError: "No copies left to lend." });
            }

            // Decrement book quantity
            const updatedBook = await BookModel.updateBook(
                desiredBook.book_type,
                desiredBook.book_name,
                desiredBook.published_year,
                desiredBook.quantity - 1,
                desiredBook.subject,
                desiredBook.academic_year,
                desiredBook.book_author,
                desiredBook._id // <-- This is the MongoDB ObjectId
            );

            // Generate today's date
            const lend_date = new Date(); // Date object works fine with Mongoose

            // Create the lending record
            const lendedBook = await BookModel.lendBook(book_id, borrower_name, academic_year, book_code, lend_date);

            return res.status(200).json({
                message: "Book Lent Successfully",
                book: {
                    lend_id: lendedBook._id,
                    book_id: book_id,
                    author: desiredBook.book_author,
                    borrower: borrower_name,
                    lend_date: lend_date.toISOString().split('T')[0] // format as yyyy-mm-dd
                }
            });

        } catch (err) {
            console.error("Lending Error:", err);
            return res.status(500).json({ messageError: "Error in lending book", error: err.message });
        }
    }
    ,

    getLendedBooks: async (req, res) => {
        try {
            const lendedBooks = await BookModel.getLendedBooks();
            if (lendedBooks.length > 0)
                return res.status(200).json({ lendedBooks });

            return res.status(204).json({ messageError: "No Lended Books Found" });

        } catch (err) {
            return res.status(500).json({ message: "Error occured in getting lended books." });
        }
    },

    returnBook: async (req, res) => {
        const { id } = req.params;

        try {
            const lendedBook = await BookModel.getLendedBookById(id);

            if (!lendedBook) {
                return res.status(404).json({ messageError: "Lended Book Not Found" });
            }

            const book_id = lendedBook.book_id;

            const bookInStock = await BookModel.getBookById(book_id);

            if (!bookInStock) {
                return res.status(404).json({ messageError: "Book not Found" });
            }

            const updatedQuantity = bookInStock.quantity + 1;

            await BookModel.updateBook(
                bookInStock.book_type,
                bookInStock.book_name,
                bookInStock.published_year,
                updatedQuantity,
                bookInStock.subject,
                bookInStock.academic_year,
                bookInStock.book_author,
                book_id
            );

            const deletedLend = await BookModel.deleteLendedBook(id);

            if (deletedLend) {
                return res.status(200).json({
                    message: "Book Returned Successfully",
                    book: {
                        lend_id: id,
                        book_id: book_id,
                        borrower: lendedBook.borrower_name,
                        lend_date: lendedBook.lend_date
                    }
                });
            } else {
                return res.status(400).json({ messageError: "Failed to delete lended book record" });
            }

        } catch (err) {
            console.error("Error in returnBook controller:", err);
            return res.status(500).json({ messageError: "Error in returning Book" });
        }
    }, 

    getLendingSummary: async (req, res) => {
        try {
            const summary = await BookModel.getLendingSummary();
            if (summary.length > 0) {
                return res.status(200).json({ lendingSummary: summary });
            }
            return res.status(204).json({ message: "No Lending Records Found" });
        } catch (err) {
            console.error("Error in getLendingSummary controller:", err);
            return res.status(500).json({ messageError: "Failed to get lending summary" });
        }
    }
    

};
