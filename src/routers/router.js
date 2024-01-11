const { Router } = require('express');
const router = Router();
const {express} = require('express');
const controladorUser = require('../controllers/user.controller');
const controladorThemes = require('../controllers/themes.controller');

router.get('/themes', controladorThemes.getThemes);

router.put('/themes/mark_themes_completed', controladorThemes.markThemesCompleted);

router.post('/register', controladorUser.userRegister);

router.post('/login', controladorUser.userLogin);

router.post('/logout', controladorUser.userLogout);

router.get('/retos', controladorUser.userRetos);

router.get('/retos/completed', controladorThemes.getCompletedRetos);

router.get('/retos/active', controladorThemes.getActiveRetos);

router.post('/retos/mark_retos_completed', controladorThemes.markRetosCompleted);

router.post('/retos/mark_reto_tema_completed', controladorThemes.markRetosTemaCompletos);

router.post('/retos/mark_tema_completed', controladorThemes.markTemaCompleted)

router.put('/usuario', controladorUser.updateUser);

router.post('/actualizarPorcentaje', controladorUser.avancePorcentaje);

router.get('/obtenerDatosNiveles/:iduser', controladorUser.obtenerDatosNiveles);

router.get('/:iduser', controladorUser.getAll);

router.get('/', (req, res) => {
    res.send('Api desplegada');
});

module.exports = router;



