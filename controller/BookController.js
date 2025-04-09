const CourseBooksModel = require('../model/BookModel');

require('dotenv').config();

module.exports = {
    insertBook: async (req, res) => {
        const { bookname, subject, academic_year, isbn, published_year, quantity } = req.body

        try {
            if (!bookname || !subject || !academic_year || !isbn || !published_year || !quantity)
                return res.status(400).json({ messageError: "Please fill all the fields." })

            const bookSaved = await CourseBooksModel.saveNewBook(bookname, subject, academic_year, isbn, published_year, quantity);

            if (bookSaved.error)
                return res.status(400).json({ messageError: bookSaved.error });

            return res.status(201).json({ message: "Book successfully added.", book: bookSaved });

        } catch (err) {
            return res.status(500).json({ messageError: "Error in saving course book", error: err })
        }
    },

    getCourseBooks: async (req, res) => {
        try {
            const books = await CourseBooksModel.getAllCourseBooks();

            if (books.length > 0) {
                return res.status(200).json({ Books: books });
            }

            return res.status(204).json({ messageError: "No Books Found" })

        } catch (err) {
            return res.status(500).json({ message: "Error occured in getting all books." })
        }
    },

    getCourseBookById: async (req, res) => {
        const { id } = req.params;

        try {
            const book = await CourseBooksModel.getCourseBookById(id);
            if (book.length === 0)
                return res.status(404).json({ message: "Book not Found." })

            return res.status(200).json(book);


        } catch (err) {
            return res.status(500).json({ message: "Errot occured in getting Book with specified id." })

        }
    },

    updateBook: async (req, res) => {
        const { bookname, subject, academic_year, isbn, published_year, quantity } = req.body;
        const { id } = req.params;

        try {

            const bookToUpdate = await CourseBooksModel.getCourseBookById(id);

            if (bookToUpdate.length === 0)
                return res.status(404).json({ message: "Book not Found." });

            const updatedBook = await CourseBooksModel.updateCourseBook(bookname, subject, academic_year, isbn, published_year, quantity, id);

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

            const bookToDelete = await CourseBooksModel.getCourseBookById(id);

            if (bookToDelete.length === 0)
                return res.status(404).json({ message: "Book not Found." });

            const deletedBook = await CourseBooksModel.deleteCourseBook(id);

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

            
            const desiredBook = await CourseBooksModel.getCourseBookById(book_id);            
            
            if (desiredBook.length === 0)
                return res.status(404).json({ messageError: "Desired book(s) Not Found." });

            const bookToLend = desiredBook[0];
            console.log(bookToLend);
            
            const availableQuantity = bookToLend.quantity;

            if (availableQuantity <= 0)
                return res.status(404).json({ messageError: "No Copies left to lend" });

            const updatedQuantity = availableQuantity - 1;

            await CourseBooksModel.updateCourseBook(
                bookToLend.bookname,
                bookToLend.subject,
                bookToLend.academic_year,
                bookToLend.isbn,
                bookToLend.published_year,
                updatedQuantity,
                bookToLend.book_id
            );

            const date = new Date();

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            const lend_date = `${year}-${month}-${day}`;

            const lendedBook = await CourseBooksModel.lendCourseBook(bookToLend.book_id, borrower_name, academic_year, lend_date);

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
            return res.status(500).json({ messageError: "Error in lending  Book" ,err:err});
        }

    }



}