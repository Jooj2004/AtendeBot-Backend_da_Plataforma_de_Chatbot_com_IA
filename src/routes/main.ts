import express from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import * as privateController from '../controllers/private'
import { verifyJWT } from '../libs/jwt'

const mainRouter = express.Router() 

mainRouter.get('/ping', pingController.ping)
mainRouter.get('/private', verifyJWT, privateController.test)


mainRouter.post('/auth/signup', authController.signup)
mainRouter.post('/auth/signin', authController.signin) 

mainRouter.post('/auth/useotp', authController.useOTP)


export default mainRouter