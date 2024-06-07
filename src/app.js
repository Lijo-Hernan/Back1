import express from "express"
import displayRoutes from "express-routemap"
import productsRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"

const PUERTO = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(PUERTO, ()=>{
    displayRoutes(app)
})

app.get("/", (req, res) => {
    res.send(`Bienvenido a mi primer servidor!`)
})

app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
