import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import mainRouter from './routes/main' 
import chatRouter from './routes/chatbot-routes'

const port = process.env.PORT as string | 4000
const server = express()

server.use(cors())
server.use(helmet())
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(express.static(path.join(__dirname,'.../public')))
server.use(mainRouter)
server.use(chatRouter)

server.listen(port, () => {
    console.log("Rodando em http://localhost:"+port)
})