const fs = require("fs");

class Cart {
    constructor(){
        this.db = "./cart.json";
    }


    async createCart(req, res) {
        const dataCart = req.body;
       
        try {
            if (fs.existsSync("./cart.json")) {

                const cart = JSON.parse(fs.readFileSync("./cart.json", 'utf-8'));

                if (cart.length === 0) {
                    const newCart = {
                        id: 1,
                        timestamp: `${new Date().toLocaleString()}`,
                        products: [dataCart],
                    };
                    cart.push(newCart);
                    fs.writeFileSync("./cart.json", JSON.stringify(cart, null, 2));
                    res.send(`Nuevo carrito creado. ID:${newCart.id}`);
                } else {
                    const lastCartId = cart[cart.length - 1].id;
                    const newCartId = lastCartId + 1;
                    const newCart = {
                        id: newCartId,
                        timestamp: `${new Date().toLocaleString()}`,
                        products: [dataCart],
                    };
                    cart.push(newCart);
                    fs.writeFileSync("./cart.json", JSON.stringify(cart, null, 2));
                    console.log(dataCart);
                    res.send(`Nuevo carrito creado. ID:${newCart.id}. 
                    Producto: ${JSON.stringify(newCart, null, 2)}`);
                }
            } else {
                const cart = [];
                const newCartId = 1;
                const newCart = {
                    id: newCartId,
                    timestamp: `${new Date().toLocaleString()}`,
                    products: [dataCart],
                };
                cart.push(newCart);
                fs.writeFileSync("./cart.json", JSON.stringify(cart, null, 2));
                res.send(`Nuevo carrito creado. ID:${newCart.id}`);
            }
        }

        catch (err) {
            console.log(`An error ocurred in create cart method: ${err}`);
            res.send(`An error ocurred in create cart method: ${err}`);
        }
    }


    async getCart(req, res) {
        try {
            let admin = true;
            if (fs.existsSync("./cart.json")) {
                const idCart = req.params.id;
                const getCartProducts = await JSON.parse(fs.readFileSync('./cart.json', 'utf-8'));
                const findIdCart = getCartProducts.find( item => item.id === Number(idCart));
                findIdCart !== undefined ? res.send(findIdCart) : res.status(404).send(`No cart with ID:${idCart}`);
            } else {
                const cart = [];
                res.send(cart);
            }
        }
        catch (err) {
            console.log(`Error al intentar obtener el carrito ${err}`);
        }
    }

    async deleteById(req, res) {
        try {
            let admin = true;
            if (fs.existsSync('./cart.json')) {
                const idParams = req.params.id;
                const getCart = await JSON.parse(fs.readFileSync('./cart.json', 'utf-8'));
                const filterProducts = getCart.filter( item => item.id !== Number(idParams));
                fs.writeFileSync('./cart.json', JSON.stringify(filterProducts, null, 4));
                filterProducts.length == getCart.length ? res.send(`No cart matches ID:${idParams}`) : res.send(filterProducts);
            }
        }
        catch (err) {
            res.send(`METHOD deleteById ERR! ${err}`);
        }
    }

    async deleteCartById(req, res){
        const id = Number(req.params.id);
        let carts = await JSON.parse(fs.readFileSync('./cart.json', 'utf-8'));


        if (carts.length > 0){

            if (carts.some((item) => item.id === id)){

                carts = carts.filter((item) => item.id !== id);

                try{
                    fs.writeFileSync('./cart.json', JSON.stringify(carts, null, 2))
                    console.log(`El carrito con ID ${id} fue borrado`);
                    res.send(`El carrito con ID ${id} fue borrado`);
                }

                catch (err){
                    console.log(`El carrito con ID ${id} no pudo ser borrado: ${err}`);
                    res.send(`El carrito con ID ${id} no pudo ser borrado: ${err}`);
                }

            }
            
            else {
                console.log(`El carrito con id ${id} no existe`);
                res.send(`El carrito con id ${id} no existe`)
            } 
        }
        
        else {
            console.log("No se puede eliminar por ID porque la lista de carritos está vacía.");
            res.send("No se puede eliminar por ID porque la lista de carritos está vacía.");
        }
    }

    async addToCartById(req, res) {
        let id = req.params.id;
        let dataProduct = req.body;

        try {
            if (fs.existsSync('./cart.json')) {
                id = Number(id);
                var carts = await JSON.parse(fs.readFileSync('./cart.json', 'utf-8'));

                var result = [];

                if (typeof dataProduct !== 'object'){
                    res.send('El contenido que enviaste no es un objeto. Por favor, envía el producto a agregar como un objeto, ya que se incorporará en un arreglo.');
                }

                else if (carts.some( (cart) => cart.id === id)) {
                    console.log("Existe el carrito con ese ID");

                    carts.map((cart) => {
                        console.log("Maping carts");
                        if (cart.id === id){
                            if (carts.some( (cart) => cart.id === id)) {
                                cart.products.map((product) => {
                                    if (product.id === dataProduct.id) {
                                        let productsInCart = cart.products.filter((prod) => prod.id !== dataProduct.id);
                                        productsInCart.push(dataProduct);
                                        fs.writeFileSync('./cart.json', JSON.stringify(carts, null, 2));
                                        console.log("El producto en el carrito existe");
                                        res.send(`El producto que agregaste ya existía y fue actualizado.`);
                                    }
                                });
                            }

                            else{
                                console.log("El producto en el carrito no existe");
                                cart.products.push(dataProduct);
                                fs.writeFileSync('./cart.json', JSON.stringify(carts, null, 2));
                                res.send(`La información del carrito ${id} fue actualizada.`)
                            }
                        }
                    });
                }
        
                else{
                    res.send(`No existe ningún carrito con el id ${id}. Antes de actualizar o editar un carrito, es necesario que lo crees.`);
                }

                return result;

            } else {
                res.send(`No hay carritos en la base de datos, cree uno.`);
            }
        }
        catch (err) {
            console.log(`Ocurrió un error al intentar agregar el producto en el carrito: ${err}`);
            res.send(`Ocurrió un error al intentar agregar el producto en el carrito: ${err}`);
        }
    }

    async deleteFromCartById(req, res) {
        try {
            let admin = true;
            if (fs.existsSync("./cart.json")) {
                const idCartParams = Number(req.params.id);
                const idProductParams = Number(req.params.id_product);
                const getCart = await JSON.parse(fs.readFileSync('./cart.json', 'utf-8'));
                const getProducts = await JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
                const filterProduct = getProducts.filter( product => product.id !== idProductParams);
                const filterCart = getCart.filter( cart => cart.id !== idCartParams);

                filterProduct.length == getProducts.length ? 
                    console.log(`No product matches ID:${idProductParams}`) :
                    console.log(`Product with ID:${idProductParams} deleted successfully!`);
                fs.writeFileSync('./products.json', JSON.stringify(filterProduct, null, 4));

                filterCart.length == getCart.length ? 
                    console.log(`No cart matches ID:${idCartParams}`) :
                    console.log(`Cart with ID:${idCartParams} deleted successfully!`);
                fs.writeFileSync('./cart.json', JSON.stringify(filterCart, null, 4));

                res.send(`Some changes may have occured. Please checkout products and cart arrays.`);

            } else {
                res.send(`No cart file provided. Please add a new one.`);
            }
        }
        catch (err) {
            res.send(`METHOD deleteFromCartById ERR! ${err}`);
        }
    }
}

const cartController = new Cart();
module.exports = cartController;