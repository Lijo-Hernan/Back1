import { Router } from "express";
import { esAdmin, esUser } from "../middleware/auth.js";
import passport from "passport";


const router = Router();

// router.use(passport.authenticate('jwt', {session: false}));

router.get("/realtimecarts", async (req, res)=>{
    res.render("realtimecarts")
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
    res.render("home")
})

router.get("/contacto", async (req, res)=>{
    res.render("contacto")
})


export default router

