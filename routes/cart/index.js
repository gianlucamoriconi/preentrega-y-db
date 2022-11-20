const { Router } = require("express");
const cartController = require("../../controllers/cart/index");
const routerCart = new Router();

routerCart.get("/", (req, res) => res.send("Cart route"));

routerCart.post("/", cartController.addToCart);

routerCart.post("/", (req, res) => res.send("Cart route"));

routerCart.delete("/", (req, res) => res.send("Cart route"));

routerCart.delete("/", (req, res) => res.send("Cart route"));

module.exports = routerCart;