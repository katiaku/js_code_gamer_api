const { Router } = require('express');
const router = Router();
const constrolador= require('../controllers/user.controller');

router.post('/register', constrolador.userRegister);
router.post('/login', constrolador.userLogin);

router.get('/profile-status', constrolador.userStatus);

module.exports = router;
