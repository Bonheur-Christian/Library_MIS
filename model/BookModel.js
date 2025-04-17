const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
  book_type: String,
  book_name: String,
  published_year: Number,
  quantity: Number,
  subject: String,
  academic_year: String,
  book_author: String
}, { timestamps: true });

const LendedBookSchema = new Schema({
  book_id: { type: Schema.Types.ObjectId, ref: 'Book' },
  borrower_name: String,
  academic_year: String,
  book_code: String,
  lend_date: Date
}, { timestamps: true });

const Book = mongoose.model('Book', BookSchema);
const Lended_Book = mongoose.model('LendedBook', LendedBookSchema);

const BookModel = {

  saveNewBook: async (book_type, book_name, published_year, quantity, subject, academic_year, book_author) => {
    const book = new Book({ book_type, book_name, published_year, quantity, subject, academic_year, book_author });
    return await book.save();
  },

  lendBook: async (book_id, borrower_name, academic_year, book_code, lend_date) => {
    const lend = new Lended_Book({ book_id, borrower_name, academic_year, book_code, lend_date });
    return await lend.save();
  },

  getBookById: async (id) => await Book.findById(id),

  getAllBooks: async () => await Book.find(),

  getCourseBooks: async () =>
    await Book.find({ book_type: 'course' }).select('book_name subject academic_year published_year quantity'),

  getNovelBooks: async () =>
    await Book.find({ book_type: 'novel' }).select('book_name published_year quantity book_author'),

  getLendedBooks: async () => {
    return await Lended_Book.find().populate({
      path: 'book_id',
      select: 'book_name'
    }).select('borrower_name academic_year book_code lend_date').lean().then(lends =>
      lends.map(l => ({
        lended_id: l._id,
        book_name: l.book_id?.book_name || 'Unknown',
        borrower_name: l.borrower_name,
        academic_year: l.academic_year,
        book_code: l.book_code,
        lend_date: l.lend_date
      }))
    );
  },

  updateBook: async (book_type, book_name, published_year, quantity, subject, academic_year, book_author, id) => {
    return await Book.findByIdAndUpdate(id, {
      book_type,
      book_name,
      published_year,
      quantity,
      subject,
      academic_year,
      book_author
    }, { new: true });
  },

  deleteBook: async (id) => {
    const isLended = await Lended_Book.exists({ book_id: id });
    if (isLended) {
      throw new Error('Book Is Currently Lent');
    }
    return await Book.findByIdAndDelete(id);
  },

  getLendedBookById: async (id) => await Lended_Book.findById(id),

  deleteLendedBook: async (id) => await Lended_Book.findByIdAndDelete(id),

  returnLendedBook: async (book_id, borrower_name, academic_year, book_code, lend_date, lend_id) => {
    return await Lended_Book.findByIdAndUpdate(lend_id, {
      book_id,
      borrower_name,
      academic_year,
      book_code,
      lend_date
    }, { new: true });
  }

};

module.exports = BookModel;
