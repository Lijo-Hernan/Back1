import { Router } from "express";
import { esAdmin, esUser } from "../middleware/auth.js";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";


const router = Router();

router.get("/realtimecarts", async (req, res)=>{
    res.render("realtimecarts")
})

router.get("/cart/:cid", passport.authenticate('jwt', {session: false}), esUser, async (req, res)=>{
    
    if(req.user){
        const user=req.user;
        const userDTO= new UserDTO(user)
        res.render("cart", {usuario: userDTO});
    }else {
        res.status(401).send("No autorizado")
    }

    // res.render("cart")
})


router.get("/realtimeproducts", passport.authenticate('jwt', {session: false}), esAdmin, async (req, res)=>{
    res.render("realtimeproducts")
})

router.get("/", async (req, res)=>{
    res.render("login")
})
router.get("/register", async (req, res)=>{
    res.render("register")
})

router.get("/home", passport.authenticate('jwt', {session: false}), esUser, async (req, res)=>{
    
    if(req.user){
        const user=req.user;
        const userDTO= new UserDTO(user)
        res.render("home", {usuario: userDTO});
    }else {
        res.status(401).send("No autorizado")
    }
})

router.get("/contacto", async (req, res)=>{
    res.render("contacto")
})


export default router

