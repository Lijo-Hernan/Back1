import { Router } from "express";
import UsersModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import CartManager from "../dao/db/cartManagerDb.js";

const router = Router()
const cartManager = new CartManager();

router.post("/register", async(req,res)=> {
    const {usuario, nombre, apellido, email, edad, rol, password}= req.body

    const newCartId = await cartManager.createCart();

    try {
        const userExist= await UsersModel.findOne({usuario});
        const mailExist= await UsersModel.findOne({email});

        if(userExist || mailExist){
            return res.status(400).send("El nombre de usuario o email ya estan en uso")
        }

        const newUSer = new UsersModel({
            usuario,
            nombre,
            apellido,
            email,
            edad,
            rol,
            password: createHash(password), 
            cartId: newCartId,
        })
        await newUSer.save()

        const token= jwt.sign({usuario: newUSer.nombre, rol: newUSer.rol }, "elAbuelo", {expiresIn: "2h"});

        res.cookie("abueloToken", token, {
            maxAge: 10800000,
            httpOnly: true
        })
        
        res.redirect("/api/sessions/current")

    } catch (error) {
        res.status(500).send("error de registro del servidor")
        console.log(error)
    }
})


router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const userFinded = await UsersModel.findOne({ usuario });

        if (!userFinded) {
            return res.status(401).send("Credenciales invalidas");
        }

        if (!isValidPassword(password, userFinded)) {
            return res.status(401).send("Credenciales invalidas");
        }
        
        const token = jwt.sign({ usuario: userFinded.usuario, rol: userFinded.rol }, "elAbuelo", { expiresIn: "2h" });

        res.cookie("abueloToken", token, {
            maxAge: 10800000,
            httpOnly: true 
        })

        res.redirect("/api/sessions/current");


    } catch (error) {
        res.status(500).send("Error de login");
    }
})


router.get("/current", passport.authenticate("jwt",{ session:false }), (req,res)=>{
    
    if(req.user){
        res.render("bienv", {usuario: req.user.usuario});
    }else {
        res.status(401).send("No autorizado")
    }

})

router.post("/logout", (req, res) => {
    res.clearCookie("abueloToken");
    res.redirect("/"); 
})


router.get("/admin", passport.authenticate("jwt", {session:false}), (req, res) => {
    
    if(req.user.rol !== "admin") {
        return res.status(403).render("sinPermisos"); 
    } 
    res.render("realtimeproducts"); 
})




export default router 