const { Router } = require('express');
const router = Router();
const {express} = require('express');
const constrolador= require('../controllers/user.controller');

router.post('/register', constrolador.userRegister);
router.post('/login', constrolador.userLogin);

module.exports = router;
