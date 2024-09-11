class productDTO {

    constructor(name, brand, description, price, img, category, code, stock, status){
        this.name = name;
        this.brand = brand;
        this.fullname=`${name} ${brand}`;
        this.description=description;
        this.price=price;
        this.img=img;
        this.category=category;
        this.code=code;
        this.stock=stock;
        this.status=status
    }
}

export default productDTO