const express = require('express')
const router = express.Router()
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware.js')
const { registerController, loginController } = require('../controllers/authController.js');

router.post('/register', registerController);
router.post('/login', loginController);

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({
        success: true
    })
})

router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({
        success: true
    })
})

module.exports = router;