import { Router } from 'express'
import { verifyRegisterCode, preRegister } from './auth.controller.js'
import { registerValidator } from '../../helpers/validators.js'
import { cuiIsValid } from '../../middlewares/validCui.js'

const api = Router()

//PUBLIC ROUTES
api.post('/register',[ cuiIsValid], preRegister)


api.post('/verifyRegisterCode', verifyRegisterCode)

export default api