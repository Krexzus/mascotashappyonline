import express from 'express'
import heroController from './controllers/heroController.js'
import petController from './controllers/petController.js'

const app = express()

app.use(express.json())
app.use('/api', heroController)
app.use('/api', petController)

const PORT = 3001
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

