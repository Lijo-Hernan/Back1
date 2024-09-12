
export function esAdmin(req, res, next) { 

    if(req.user.rol == "admin") { 
    next();
    }else{
        res.status(403).render("sinPermisos");
    }

}

export function esUser(req, res, next) { 

    if(req.user.rol == "user") { 
        next();
    }else{
            res.status(403).render("sinPermisos");
    }
    
}
