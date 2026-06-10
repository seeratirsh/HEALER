const express = require('express');
const multer = require('multer');
const { assess } = require('../controllers/assessController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store image in memory (not disk)

// Text input:  POST /api/assess  { message, language }
// Image input: POST /api/assess  multipart/form-data with 'image' field
router.post('/', upload.single('image'), assess);

module.exports = router;
