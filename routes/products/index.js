const { Router } = require("express");
const productController = require("../../controllers/products/index");
const routerProducts = new Router();

routerProducts.get("/:id?", productController.getProducts);

routerProducts.post("/", productController.save);

routerProducts.put("/:id", productController.modifyProductById);

routerProducts.delete("/:id", productController.deleteById);


module.exports = routerProducts;