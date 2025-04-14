const { getDb } = require('./config');
const { ObjectId } = require('mongodb');

const BookModel = {

  saveNewBook: async (book_type, book_name, published_year, quantity, subject, academic_year, book_author) => {
    const db = getDb();

    const result = await db.collection("books").insertOne({
      book_type,
      book_name,
      published_year,
      quantity,
      subject,
      academic_year,
      book_author
    });

    return result;
  },

  lendBook: async (book_id, borrower_name, academic_year, lend_date) => {
    const db = getDb();
    const result = await db.collection("lended_books").insertOne({
      book_id: new ObjectId(book_id),
      borrower_name,
      academic_year,
      lend_date
    });

    return result;
  },

  getBookById: async (id) => {
    const db = getDb();
    return await db.collection("books").findOne({ _id: new ObjectId(id) });
  },

  getAllBooks: async () => {
    const db = getDb();
    return await db.collection("books").find().toArray();
  },

  getCourseBooks: async () => {
    const db = getDb();
    return await db.collection("books").find({ book_type: "course" }).project({
      book_id: 1, book_name: 1, subject: 1, academic_year: 1, published_year: 1, quantity: 1
    }).toArray();
  },

  getNovelBooks: async () => {
    const db = getDb();
    return await db.collection("books").find({ book_type: "novel" }).project({
      book_id: 1, book_name: 1, published_year: 1, quantity: 1, book_author: 1
    }).toArray();
  },

  getLendedBooks: async () => {
    const db = getDb();
    const books = db.collection("books");
    const lended = db.collection("lended_books");

    return await lended.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book_id",
          foreignField: "_id",
          as: "book"
        }
      },
      { $unwind: "$book" },
      {
        $project: {
          lended_id: "$_id",
          book_name: "$book.book_name",
          borrower_name: 1,
          academic_year: 1,
          lend_date: 1
        }
      }
    ]).toArray();
  },

  updateBook: async (book_type, book_name, published_year, quantity, subject, academic_year, book_author, id) => {
    const db = getDb();
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          book_type,
          book_name,
          published_year,
          quantity,
          subject,
          academic_year,
          book_author
        }
      }
    );

    return result;
  },

  deleteBook: async (id) => {
    const db = getDb();
    return await db.collection("books").deleteOne({ _id: new ObjectId(id) });
  },

  getLendedBookById: async (id) => {
    const db = getDb();
    return await db.collection("lended_books").findOne({ _id: new ObjectId(id) });
  },

  deleteLendedBook: async (id) => {
    const db = getDb();
    return await db.collection("lended_books").deleteOne({ _id: new ObjectId(id) });
  },

  returnLendedBook: async (book_id, borrower_name, academic_year, lend_date, lend_id) => {
    const db = getDb();
    return await db.collection("lended_books").updateOne(
      { _id: new ObjectId(lend_id) },
      {
        $set: {
          book_id: new ObjectId(book_id),
          borrower_name,
          academic_year,
          lend_date
        }
      }
    );
  }

};

module.exports = BookModel;
