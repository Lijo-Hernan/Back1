import { Router } from "express";
import UsersModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import CartManager from "../dao/db/cartManagerDb.js";
import userService from "../services/userService.js";
import UserDTO from "../dto/user.dto.js";

const router = Router()
const cartManager = new CartManager();

router.post("/register", async(req,res)=> {
    const {usuario, nombre, apellido, email, edad, rol, password}= req.body

    
    try {
        const userExist= await UsersModel.findOne({usuario});
        const mailExist= await UsersModel.findOne({email});
        
        if(userExist || mailExist){
            return res.status(400).send("El nombre de usuario o email ya estan en uso")
        }
        
        const newCartId = await cartManager.createCart();
        const newUSer = new UsersModel({
        // const newUSer = await userService.newUser({
            usuario,
            nombre,
            apellido,
            email,
            edad,
            rol,
            password: createHash(password), 
            // password, 
            cartId: newCartId,
        })
        await newUSer.save()

        const token= jwt.sign({usuario: newUSer.nombre, rol: newUSer.rol, email: newUSer.email, cartId: newUSer.cartId  }, "elAbuelo", {expiresIn: "2h"});

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
        // const userFinded= await userService.loginUser(usuario, password);

        if (!userFinded) {
            return res.status(401).send("Credenciales invalidas");
        }

        if (!isValidPassword(password, userFinded)) {
            return res.status(401).send("Credenciales invalidas");
        }
        
        const token = jwt.sign({ usuario: userFinded.usuario, rol: userFinded.rol, email: userFinded.email, nombre: userFinded.nombre, cartId: userFinded.cartId }, "elAbuelo", { expiresIn: "2h" });

        res.cookie("abueloToken", token, {
            maxAge: 10800000,
            httpOnly: true 
        })

        res.redirect("/api/sessions/current");


    } catch (error) {
        res.status(500).send("Error de login", error);
    }
})


router.get("/current", passport.authenticate("jwt",{ session:false }), (req,res)=>{
    
    if(req.user){
        const user=req.user;
        const userDTO= new UserDTO(user)
        res.render("bienv", {usuario: userDTO});
    }else {
        res.status(401).send("No autorizado")
    }

})

router.post("/logout", (req, res) => {
    res.clearCookie("abueloToken");
    res.redirect("/"); 
})

export default router 