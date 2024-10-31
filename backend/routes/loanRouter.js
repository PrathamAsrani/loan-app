const express = require('express');
const router = express.Router();
const {createLoanController} = require('../controllers/createLoanController.js')

router.post('/create-loan', createLoanController);

module.exports = router; 