const fs = require("fs");

class Products {
    constructor(){

        this.db = "./products.json";

    }

    async save(req, res) {
        try {
            if (fs.existsSync("./products.json")) {
                const getData = await JSON.parse(fs.readFileSync("./products.json", "utf-8"));
                const lastProduct = getData[getData.length - 1].id;
                const newProduct = req.body;
                newProduct.id = lastProduct + 1;
                getData.push(newProduct);
                console.log(getData);
                await fs.writeFileSync("./products.json", JSON.stringify(getData));
                res.status(201).send(`✔ New product has been successfully saved.`)
            } else {
                const getData = [];
                const newProduct = req.body;
                newProduct.id = 1;
                getData.push(newProduct);
                await fs.writeFileSync("./products.json", JSON.stringify(getData));
            }
        }

        catch (err) {
            console.log(`METHOD save ERR! ${err}`);
        }
    }

}

const productController = new Products();

module.exports = productController;