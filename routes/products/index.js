const { Router } = require("express");
const productController = require("../../controllers/products/index");
const routerProducts = new Router();

routerProducts.get("/:id?", productController.getProductById);

routerProducts.get("/", productController.getProducts);

routerProducts.get("/:id/:idProduct", productController.getProductById);

routerProducts.post("/", productController.saveProduct);

routerProducts.delete("/:id", productController.deleteById);


module.exports = routerProducts;