class UserDTO{
    constructor(user){
        this.nombre = user.nombre;
        this.email = user.email;
        this.rol= user.rol;
    }
}
export default UserDTO