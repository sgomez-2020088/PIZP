import { Router } from 'express'
import { register,login, verifyCode, resendCode  } from './auth.controller.js'
import { loginValidator, registerValidator,codeValidator } from '../../helpers/validators.js'
import { cuiIsValid } from '../../middlewares/validCui.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

//PUBLIC ROUTES
api.post('/register',[registerValidator, cuiIsValid], register)

api.post('/login', [loginValidator], login)

api.post('/verifyCode',[codeValidator], verifyCode)

api.post('/resendCode',resendCode )

export default api

//borra este - Se actualiza ruta auth