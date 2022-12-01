const express = require("express");
const app = express();
const routerCart = require("./routes/cart/index");
const routerProducts = require("./routes/products/index");
const routerRender = require("./routes/render/index");
const Port = '8080';



const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const messages = [];

io.on('connection', socket => {
    console.log('Nuevo cliente conectado.');
    socket.emit('messages', messages);
    socket.emit('products');

    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

    socket.on('new-product', data => {
        io.sockets.emit('products');
    });
});


app.use(express.static(__dirname + '/public/src'));
app.use(express.static(__dirname));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use("/", routerRender);

//API
app.use("/api/cart", routerCart);
app.use("/api/products", routerProducts);


const server = httpServer.listen(Port, () => {
    console.log(
        `Server started on PORT http://127.0.0.1:${Port} at ${new Date().toLocaleString()}`
    );
});

server.on('error', error => console.log(`Error en servidor: ${error}`));