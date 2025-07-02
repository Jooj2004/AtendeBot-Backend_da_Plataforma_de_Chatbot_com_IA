import express from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'

const mainRouter = express.Router() 

mainRouter.get('/ping', pingController.ping)
mainRouter.post('/auth/signin', authController.signin)


export default mainRouter