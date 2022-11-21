const fs = require("fs");

class Cart {
    constructor(){
        this.db = "./cart.json";
    }

    async createCart(req, res) {
        try {
            let admin = true;
            if (fs.existsSync("./cart.json")) {
                let t = new Date();
                const cart = await JSON.parse(fs.readFileSync('./cart.json', 'utf-8'));
                const products = await JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
                if (cart.length == 0) {
                    const newCart = {
                        id: 1,
                        timestamp: `${t.getDate()}/${t.getMonth()+1}/${t.getFullYear()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`,
                        products: products,
                    };
                    cart.push(newCart);
                    fs.writeFileSync('./cart.json', JSON.stringify(cart, null, 4), 'utf-8')
                    res.status(201).send(`✔ New cart created! - ID:${newCart.id}`);
                } else {
                    const lastCartId = cart[cart.length - 1].id;
                    const newCartId = lastCartId + 1;
                    const newCart = {
                        id: newCartId,
                        timestamp: `${t.getDate()}/${t.getMonth()+1}/${t.getFullYear()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`,
                        products: products,
                    };
                    cart.push(newCart);
                    fs.writeFileSync('./cart.json', JSON.stringify(cart, null, 4), 'utf-8')
                    res.status(201).send(`✔ New cart created! - ID:${newCart.id}`);
                }
            } else {
                const cart = [];
                const newProduct = req.body;
                newProduct.id = 1;
                cart.push(newProduct);
                fs.writeFileSync("./cart.json", JSON.stringify(cart, null, 4), 'utf-8');
            }
        }

        catch (err) {
            console.log(`METHOD createCart ERR! ${err}`);
        }
    }

    async getCart(req, res) {
        try {
            let admin = true;
            if (fs.existsSync("./cart.json")) {
                const idCart = req.params.id;
                const getCartProducts = await JSON.parse(fs.readFileSync('./cart.json', 'utf-8'));
                const findIdCart = getCartProducts.find( item => item.id === Number(idCart));
                findIdCart !== undefined ? res.send(findIdCart) : res.send(`No cart with ID:${idCart}`);
            } else {
                const cart = [];
                res.send(cart);
            }
        }
        catch (err) {
            console.log(`METHOD getCart ERR! ${err}`);
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

    async addToCartById(req, res) {
        try {
            let admin = true;
            if (fs.existsSync("./cart.json")) {
                const idParams = req.params.id;
                const getProducts = await JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
                const getCart = await JSON.parse(fs.readFileSync('./cart.json', 'utf-8'));
                const findCart = getCart.find( item => item.id === Number(idParams));
                if (findCart !== undefined) {
                    const arrayFromFindProducts = findCart.products;
                    const arrayForPush = arrayFromFindProducts.concat(getProducts);
                    findCart.products = arrayForPush;
                    fs.writeFileSync('./cart.json', JSON.stringify(getCart, null, 4));
                    res.send(`Product added to cart with ID:${idParams} successfully!`);
                } else {
                    res.send(`No cart with ID:${idParams}`);
                };
            } else {
                res.send(`No cart file provided. Please add one.`);
            }
        }
        catch (err) {
            res.send(`METHOD addToCartById ERR! ${err}`);
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