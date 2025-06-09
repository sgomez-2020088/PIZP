import { Router } from 'express'
import { verifyRegisterCode, preRegister } from './auth.controller.js'
import { registerValidator } from '../../helpers/validators.js'
import { cuiIsValid } from '../../middlewares/validCui.js'

const api = Router()

//PUBLIC ROUTES
api.post('/register',[ cuiIsValid], preRegister)


<<<<<<< HEAD
api.post('/verifyRegisterCode', verifyRegisterCode)
=======
api.post('/verifyCode', verifyCode)
>>>>>>> 1e72736a9cde8503069cdae877080b648203d045

export default api