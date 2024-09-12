import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router(); 

const transport=nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: "lijo.hernanpablo@gmail.com",
        pass: "uglc oqbn pxzr fpal"
    }
})

router.get("/mail", async (req, res)=>{
    try {
        await transport.sendMail({
            from: "lijo.hernanpablo@gmail.com",
            to: "hernan.abuelo@gmail.com",
            subject:"Mail desde Ecomerce2024",
            html: `<h2>Mail de pueba de Ecomerce2024<h2>
                <img src="cid:logo">
            `,
            attachments:[
                {
                    filename: "logo.jpg",
                    path: "src/public/files/logo.jpg",
                    cid:"logo"
                }

            ]
        })
        res.send("correo enviado correctamente")
    } catch (error) {
        res.status(500).send("Error al enviar email")
        
    }
})


router.post ("/enviarmensaje", async (req, res)=> {
    
    const {email, mensaje}= req.body;
    
    try {
        await transport.sendMail({
            from: "Formulario Ecomerce2024",
            to: "hernan.abuelo@gmail.com",
            subject:"Mail desde Ecomerce2024",
            html: `${email} ${mensaje}`,
            attachments:[
                {
                    filename: "logo.jpg",
                    path: "src/public/files/logo.jpg",
                    cid:"logo"
                }

            ]
        })
        // res.send("mensaje enviado correctamente, responderemos a la brevedad")
        res.redirect('/home?message=success'); 

        
    } catch (error) {
        res.status(500).send("Error de servidor")
    }

})


export default router; 