import { body } from 'express-validator' 
import { validateErrors} from './validate.errors.js'
import { exitEmailUser,existDpi } from './db.validator.js'

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('surname', 'surname cannot be empty').notEmpty(),
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    body('DPI', 'DPI cannot be empty').notEmpty().isLength({max:13}).withMessage('DPI must be 13 char').isLength({min:13}).withMessage('DPI must be 13 char').custom(existDpi),
    body('email', 'Email cannot be empty').notEmpty().isEmail().custom(exitEmailUser),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword().withMessage('Password must be strong').isLength({min:8}),
    validateErrors
]

export const loginValidator = [
    body('DPI', 'DPI cannot be empty').notEmpty(),
    body('password', 'Password cannot be empty').notEmpty(),
    validateErrors
]

export const reportValidator = [
    body('typeCrime', 'Type Crime cannot be empty').notEmpty(),
    body('address', 'Address cannot be empty').notEmpty(),
    body('description', 'Description cannot be empty').notEmpty(),
    validateErrors
]

export const codeValidator = [
    body('verificationCode', 'Verification code cannot be empty').notEmpty().isLength({min:6, max:6}).withMessage('Verification code must be 6 characters'),
    validateErrors
]
