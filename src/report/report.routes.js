import { Router } from "express"
import { addReport, getReports, deleteReport } from "./report.controller.js"
import { isAdmin, validateJwt } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post('/add',[validateJwt], addReport)
api.get('/get',[validateJwt], getReports)
api.delete('/delete/:reportId',[validateJwt, isAdmin], deleteReport)

export default api