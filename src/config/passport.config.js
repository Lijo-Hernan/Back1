import passport from "passport";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt; 

const initializePassport = () => {
    //Creamos el cookie extractor: 

    const cookieExtractor = req => {
        let token = null; 
        //Corroboramos que hay alguna cookie que tomar: 
        if(req && req.cookies) {
            token = req.cookies["abueloToken"];
            //Tomamos nuestra cookie
        }
        return token;
    }
    
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "elAbuelo"
        //Misma palabrita que metimos en la ruta! ojo!
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport; 