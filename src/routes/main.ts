import express from 'express'
import * as pingController from '../controllers/ping'
import * as authController from '../controllers/auth'
import * as privateController from '../controllers/private'
import * as faqsController from '../controllers/faqs'
import * as companyController from '../controllers/company'
import * as interectionController from '../controllers/interection'
import { verifyJWT } from '../libs/jwt'
import { verifyEmail } from '../middlewares/verifyEmail'

const mainRouter = express.Router() 

mainRouter.get('/ping', pingController.ping) 
mainRouter.get('/private', verifyJWT, privateController.test)


mainRouter.post('/auth/signup', authController.signup)
mainRouter.post('/auth/signin', authController.signin)

mainRouter.post('/auth/verification', authController.verifyEmail)
mainRouter.post('/auth/useotp', authController.useOTP)

mainRouter.put('/auth/password', verifyJWT, verifyEmail, authController.editPassword)

mainRouter.post('/faq/create', verifyJWT, verifyEmail, faqsController.create)
mainRouter.get('/faq/list', verifyJWT, verifyEmail, faqsController.list)
mainRouter.get('/faq/list/public/:id', faqsController.listPublic)
mainRouter.get('/faq/list/:id', verifyJWT, verifyEmail, faqsController.faq)
mainRouter.put('/faq/edit', verifyJWT, verifyEmail, faqsController.edit)
mainRouter.delete('/faq/delete/:id', verifyJWT, verifyEmail, faqsController.deleteFaqCon)
mainRouter.delete('/faq/deleteall', verifyJWT, verifyEmail, faqsController.deleteAllFaqs)

mainRouter.put('/company/edit', verifyJWT, verifyEmail, companyController.edit)
mainRouter.put('/company/email', verifyJWT, verifyEmail, companyController.updateEmailCon)
mainRouter.delete('/company/delete', verifyJWT, verifyEmail, companyController.deleteAll)

mainRouter.get('/company/interaction', verifyJWT, verifyEmail, interectionController.getInterections)


export default mainRouter