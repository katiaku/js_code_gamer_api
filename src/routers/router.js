const { Router } = require('express');
const router = Router();
const {express} = require('express');
const controladorUser = require('../controllers/user.controller');
const controladorThemes = require('../controllers/themes.controller');

router.get('/themes', controladorThemes.getThemes);

router.post('/register', controladorUser.userRegister);

router.post('/login', controladorUser.userLogin);
//http://localhost:3000/login
// router.post('/actualizarPorcentaje/:iduserTheme/:id_levelTheme/:iduserChallenges/:id_levelChallenges/:idlevelsLevels/:iduserUserLevel/:idlevelUserLevel', controladorUser.avancePorcentaje);
router.post('/actualizarPorcentaje', controladorUser.avancePorcentaje);

//http://localhost:3000/actualizarPorcentaje/24/1/24/1/1/24/1
module.exports = router;



