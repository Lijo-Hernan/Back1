import { Router } from "express";
const router = Router();

router.get("/realtimeproducts", async (req, res)=>{
    res.render("realtimeproducts")
})

export default router

