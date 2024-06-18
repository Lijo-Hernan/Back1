import { Router } from "express";
const router = Router();

router.get("/realtimeproducts", async (req, res)=>{
    res.render("realtimeproducts")
})


router.get("/", async (req, res)=>{
    
    res.render("home")
    
    // const {limit} = req.query;
    // const prods= "home"

    // if(limit){
    //     res.render(prods.slice(0, limit));
    // }else {
    //     res.render(prods)
    // }
})

export default router

