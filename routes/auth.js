const {Router} = require('express');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controlers/auth.controller');
const { check, body } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El email es obligatorio.').isEmail(),
    check('password', 'Password es obligatorio.').isLength({min:6}),
    validarCampos 
], crearUsuario);

router.post('/', [
    check('email', 'El email es obligatorio.').isEmail(),
    check('password', 'Password es obligatorio.').isLength({min:6}),
    validarCampos
], loginUsuario);

// renovar token

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;