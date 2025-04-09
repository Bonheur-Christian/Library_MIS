const express = require('express');
const courseBookController = require('../controller/BookController');
const router = express.Router();


router.post('/add-book', courseBookController.insertBook);
router.post('/lend-book', courseBookController.lendBook);
router.get('/all-books', courseBookController.getCourseBooks);
router.get('/course-book/:id', courseBookController.getCourseBookById);
router.put('/update-course-book/:id', courseBookController.updateBook);
router.delete('/delete-course-book/:id', courseBookController.deleteBook);



module.exports = router;