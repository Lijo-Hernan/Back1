import express from "express"
import displayRoutes from "express-routemap"

const PUERTO = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(PUERTO, ()=>{
    displayRoutes(app)
    console.log(`listeneando el puerto ${PUERTO}`)
})

