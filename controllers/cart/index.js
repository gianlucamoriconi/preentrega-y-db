const fs = require("fs");

class Cart {
    constructor(){
        this.db = "./cart.json";
    }

    async createCart(req, res) {
        try {
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
}

const cartController = new Cart();
module.exports = cartController;

//! para el metodo post('/:id/products')
// async addToCart(req, res) {
//     try {
//         if (fs.existsSync("./cart.json")) {
//             const products = await JSON.parse(fs.readFileSync("./products.json", "utf-8"));
//             const cart = await JSON.parse(fs.readFileSync("./cart.json", "utf-8"));
//             const selectedProduct = products.find( item => item.id === req.body.id);
//             const productIndex = products.findIndex( item => item.id === req.body.id);
//             delete selectedProduct.stock;
//             selectedProduct.quantity = req.body.quantity;
//             products[productIndex].stock -= req.body.quantity;
//             cart.push(selectedProduct);
//             fs.writeFileSync("./products.json", JSON.stringify(products));
//             fs.writeFileSync("./cart.json", JSON.stringify(cart));
//             res.status(201).send(`✔ New product added to cart successfully!\nProduct ID is ${req.body.id}`)
//         } else {
//             const getData = [];
//             const newProduct = req.body;
//             newProduct.id = 1;
//             getData.push(newProduct);
//             await fs.writeFileSync("./cart.json", JSON.stringify(getData));
//         }
//     }

//     catch (err) {
//         console.log(`METHOD addToCart ERR! ${err}`);
//     }
// }