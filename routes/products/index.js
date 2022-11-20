const { Router } = require("express");
const productController = require("../../controllers/products/index");
const routerProducts = new Router();


routerProducts.get("/", (req, res) => res.send("Products route"));

routerProducts.post("/", productController.save);

routerProducts.put("/", (req, res) => res.send("Products route"));

routerProducts.delete("/", (req, res) => res.send("Products route"));


module.exports = routerProducts;