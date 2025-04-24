const express = require('express');
const BookController = require('../controller/BookController');
const router = express.Router();


router.post('/add-book', BookController.insertBook);
router.post('/lend-book', BookController.lendBook);
router.get('/all-books', BookController.getAllBooks);
router.get('/course-books', BookController.getCourseBooks);
router.get('/novel-books', BookController.getNovelBooks);
router.get('/lended-books', BookController.getLendedBooks)
router.get('/lending-summary', BookController.getLendingSummary);
router.get('/:id', BookController.getBookById);
router.get('/return-book/:id', BookController.returnBook);
router.put('/update-book/:id', BookController.updateBook);
router.delete('/delete-book/:id', BookController.deleteBook);



module.exports = router;