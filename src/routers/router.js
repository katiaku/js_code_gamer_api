const { Router } = require('express');
const router = Router();
const { userRegister } = require('../controllers/user.controller');

router.post('/register', userRegister);

module.exports = router;
