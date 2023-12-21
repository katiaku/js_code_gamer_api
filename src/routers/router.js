const { Router } = require('express');
const router = Router();
const {express} = require('express');
const controlador= require('../controllers/user.controller');

router.post('/register', controlador.userRegister);
router.post('/login', controlador.userLogin);
router.post('/actualizarPorcentaje/:iduserTheme/:id_levelTheme/:iduserChallenges/:id_levelChallenges/:idlevelsLevels/:iduserUserLevel/:idlevelUserLevel', controlador.avancePorcentaje);

module.exports = router;
