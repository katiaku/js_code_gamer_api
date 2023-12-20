const { Router } = require('express');
const router = Router();
const { userRegister, userStatus } = require('../controllers/user.controller');

router.post('/register', userRegister);

router.get('/profile-status', userStatus);

module.exports = router;
