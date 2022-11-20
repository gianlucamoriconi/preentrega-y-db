const express = require("express");
const app = express();
const routerCart = require("./routes/cart/index");
const routerProducts = require("./routes/products/index");

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use("/api/cart", routerCart);
app.use("/api/products", routerProducts);

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on PORT: http://localhost:${server.address().port}`);
})

app.get("/api", (req, res) => res.send("Welcome to API"));