import express from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import * as privateController from '../controllers/private'
import { verifyJWT } from '../libs/jwt'
import { verifyEmail } from '../middlewares/verifyEmail'

const mainRouter = express.Router() 

mainRouter.get('/ping', pingController.ping) 
mainRouter.get('/private', verifyJWT, verifyEmail, privateController.test)


mainRouter.post('/auth/signup', authController.signup)
mainRouter.post('/auth/signin', authController.signin)

mainRouter.post('/auth/verification', authController.verifyEmail)
mainRouter.post('/auth/useotp', authController.useOTP)

mainRouter.put('/auth/password', verifyJWT, verifyEmail, authController.editPassword)


export default mainRouter