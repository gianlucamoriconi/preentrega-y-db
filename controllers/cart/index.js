const fs = require("fs");

class Cart {
    constructor(){
        this.db = "./cart.json";
    }

    async addToCart(req, res) {
        try {
            if (fs.existsSync("./cart.json")) {
                const getData = await JSON.parse(fs.readFileSync("./cart.json", "utf-8"));
                const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
                const cart = JSON.parse(fs.readFileSync("./cart.json", "utf-8"));
                const selectedProduct = products.find( item => item.id === req.body.id);
                const productIndex = products.findIndex( item => item.id === req.body.id);
                delete selectedProduct.stock;
                selectedProduct.quantity = req.body.quantity;
                products[productIndex].stock -= req.body.quantity;
                cart.push(selectedProduct);
                await fs.writeFileSync("./products.json", JSON.stringify(products));
                await fs.writeFileSync("./cart.json", JSON.stringify(cart));
                
                res.status(201).send(`✔ New product added to cart successfully!`)
            } else {
                const getData = [];
                const newProduct = req.body;
                newProduct.id = 1;
                getData.push(newProduct);
                await fs.writeFileSync("./cart.json", JSON.stringify(getData));
            }
        }

        catch (err) {
            console.log(`METHOD addToCart ERR! ${err}`);
        }
    }
}

const cartController = new Cart();
module.exports = cartController;