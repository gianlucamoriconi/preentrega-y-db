const fs = require("fs");

class Products {
    constructor(){

        this.db = "./products.json";

    }

    async getProducts(req, res) {
        try {
            let admin = true;
            if (fs.existsSync("./products.json")) {
                const getProducts = await JSON.parse(fs.readFileSync("./products.json", "utf-8"));
                const findProduct = getProducts.find( item => item.id === Number(req.params.id));
                findProduct !== undefined ? res.send(findProduct) : res.send(`No product matches id.`);
            } else {
                const getProducts = [];
                res.send(`⚠ Empty products array. Please add one before reading. ${getProducts}`);
            }
        }
        catch (err) {
            console.log(`❌ METHOD getProducts ERR! ${err}`);
        }
    }

    async save(req, res) {
        try {
            let admin = true;
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
            console.log(`❌ METHOD save ERR! ${err}`);
        }
    }

    async modifyProductById(req, res) {
        try {
            let admin = true;
            const { name, timestamp, description, code, price, stock } = req.body;
            const { id } = req.params;
            const idParam = parseInt(id);
            const getProducts = await JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
            const createProduct = {name, timestamp, description, code, price, stock, "id": idParam};
            const findProductByIndex = getProducts.findIndex(item => item.id === idParam);
            if (findProductByIndex !== -1) {
                getProducts[findProductByIndex] = createProduct; 
                await fs.writeFileSync('./products.json', JSON.stringify(getProducts, null, 4));
                res.send(`✔ Product modified successfully.`);
            }
            else {
                res.send(`❌ ERR! Product with ID:${idParam} does not exist.`)
            }
            
        }
        catch (err) {
            console.log(`❌ METHOD modifyProducts ERR! ${err}`);
        }
    }

    async deleteById(req, res) {
        try {
            let admin = true;
            if (fs.existsSync("./products.json")) {
                const idParam = req.params.id;
                const successMessage = `ID:${idParam} product deleted successfully!`;
                const getProducts = await JSON.parse(fs.readFileSync("./products.json", "utf-8"));
                const filterProducts = getProducts.filter( item => item.id !== Number(idParam));
                fs.writeFileSync('./products.json', JSON.stringify(filterProducts, null, 4));
                filterProducts.length == getProducts.length ? res.send(`No product matches ID:${idParam}`) : res.send(successMessage);
            } else {
                const getProducts = [];
                res.send(`⚠ Empty products array. Please add one before reading. ${getProducts}`);
            }
        }
        catch (err) {
            console.log(`❌ METHOD deleteById ERR! ${err}`);
        }
    }

}

const productController = new Products();

module.exports = productController;