import express from 'express'
import * as chatbotController from '../controllers/chatbot'

const chatRouter = express.Router()

chatRouter.post('/chat/new/:id', chatbotController.createInteraction) 

export default chatRouter