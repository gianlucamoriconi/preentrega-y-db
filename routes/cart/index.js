const { Router } = require("express");
const cartController = require("../../controllers/cart/index");
const routerCart = new Router();

routerCart.post("/", cartController.createCart);

routerCart.get("/:id/products", cartController.getCart);

routerCart.delete("/:id", cartController.deleteById);

routerCart.post("/:id/products", cartController.addToCartById);

routerCart.delete("/:id/products/:id_product", cartController.deleteFromCartById);

module.exports = routerCart;