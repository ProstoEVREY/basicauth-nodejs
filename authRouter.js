const Router = require('express')
const authController = require('./authController')
const router = new Router()
const {check} = require('express-validator')
const authMiddleware = require('./Middleware/authMiddleware')
const roleMiddleware = require('./Middleware/roleMiddleware')

router.post('/registration',[
    check('username', "Username cannot be empty").notEmpty(),
    check('password', "Password cannot be less than 4 or more than 10 symbols").isLength({min:4, max:10})],
    authController.registration)
router.post('/login', authController.login)
router.get('/users',roleMiddleware(['admin','user']),  authController.getUsers)
router.post('/roles', authController.roles)

module.exports = router