const express = require('express')
const router = express.Router()
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware.js')
const { registerController, loginController } = require('../controllers/authController.js');

router.post('/register', registerController);
router.post('/login', loginController);


module.exports = router;