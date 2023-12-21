const { Router } = require('express');
const router = Router();
const {express} = require('express');
const controladorUser = require('../controllers/user.controller');
const controladorThemes = require('../controllers/themes.controller');

router.get('/themes', controladorThemes.getThemes);

router.post('/register', controladorUser.userRegister);

router.post('/login', controladorUser.userLogin);

router.get('/retos', controladorUser.userRetos);
router.post('/actualizarPorcentaje/:iduserTheme/:id_levelTheme/:iduserChallenges/:id_levelChallenges/:idlevelsLevels/:iduserUserLevel/:idlevelUserLevel', controladorUser.avancePorcentaje);

module.exports = router;
