import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import mainRouter from './routes/main' 
import chatRouter from './routes/chatbot-public-routes'

const app = express()

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://atendebot-frontend.netlify.app"
    ],
    credentials: true,
}))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'../public')))
app.use(mainRouter)
app.use(chatRouter)

export default app