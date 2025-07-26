import app from './app'

const port = process.env.PORT as string | 4000

app.listen(port, () => {
    console.log("Rodando em http://localhost:"+port)
})