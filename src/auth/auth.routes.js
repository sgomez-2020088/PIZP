import { Router } from 'express'
import { register,login } from './auth.controller.js'
import { loginValidator, registerValidator } from '../../helpers/validators.js'

const api = Router()

//PUBLIC ROUTES
api.post('/register',[registerValidator], register)

api.post('/login', [loginValidator], login)

export default api