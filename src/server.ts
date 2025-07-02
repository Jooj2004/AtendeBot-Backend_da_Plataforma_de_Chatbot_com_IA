import express from 'express'
import helmet from 'helmet'
import path from 'path'
import router from '../routes'

const port = process.env.PORT as string | 4000
const server = express()

server.use(helmet())
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(express.static(path.join(__dirname,'.../public')))
server.use('/', router)

server.listen(port, () => {
    console.log("Rodando em http://localhost:"+port)
})