const express = require('express');
const router = express.Router();
const { loginPage, getNonce, loginUser, logoutUser, checkToken } = require('../controllers/authController');

router.get('/login', loginPage);
router.post('/nonce', getNonce);
router.post('/login', loginUser);
router.get('/check-token', checkToken)
router.get('/logout', logoutUser);

module.exports = router;
