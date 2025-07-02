import express from 'express'
import * as pingController from '../controllers/ping'

const mainRouter = express.Router() 

mainRouter.get('/ping', pingController.ping)


export default mainRouter