//Render
const express = require("express");
const app = express();
const { Router } = require("express");
const productController = require("../../controllers/products/index");
const routerRender = new Router();

routerRender.get('/', async (req, res)=>{
    let products_read = await productController.getProducts(req, res);
    const layout = "productList";
    const title = "Todos los productos";

    res.render('pages/index', {products_read, title, layout});
    
});

routerRender.get('/agregar-producto', (req, res)=>{
    const layout = "addForm";
    const title = "Agregar nuevo producto";
    res.render('pages/index', {layout, title});
});

module.exports = routerRender;