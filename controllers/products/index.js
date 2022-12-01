const fs = require("fs");

class Products {
    constructor(db = "./products.json"){
        this.db = db;
    }

    async getProducts(req, res) {

        try {
            let admin = true;
            if (fs.existsSync("./products.json")) {
                const products = await JSON.parse(fs.readFileSync("./products.json", "utf-8"));
                if (products.length > 0){
                    
                    return products;
                }

                else{
                    res.send(`Aún no hay productos cargados.`);
                }
                // findProduct !== undefined ? res.send(findProduct) : res.send(`No product matches id ${id}.`);
            } 
            
            else {
                const products = [];
                res.send(`Empty products array. Please add one before reading. ${products}`);
            }

        }
        catch (err) {
            res.send(`Hubo un error al intentar obtener los productos: ${err}`);
        }
    };


    async getProductById(req, res){
        const id = Number(req.params.id);
        const products = await JSON.parse(fs.readFileSync("./products.json", "utf-8"));
        
        var result = [];

        if (products.length !== 0){

            if (products.some((item) => item.id === id)){
                products.map((it) => {
                    if (it.id === id){
                        console.log(it);
                        result = it;
                    }
                });
            } else {
                console.log(`El producto de ID: ${id} no fue encontrado`);
                result = `El producto de ID: ${id} no fue encontrado`;
            }

            res.send(result);

        } else{
            console.log("No se puede buscar por ID porque la lista de productos está vacía.");
            res.send("No se puede buscar por ID porque la lista de productos está vacía.");
        }  

    } 

    async saveProduct(req, res){
        const products = await JSON.parse(fs.readFileSync("./products.json", "utf-8"));
        const product = req.body;

        if (products.length === 0){
            console.log("Está vacío");
            var productToAdd = product;

            productToAdd.id = 1;
            productToAdd = [productToAdd];
            productToAdd = JSON.stringify(productToAdd, null, 2);
    
            fs.writeFileSync("./products.json", productToAdd)
            .then(res => {
                console.log(`Guardaste el primer producto de la lista, el id es: 1`);
                res.send("Guardaste el primer producto de la lista, el id es: 1");
            })
    
            .catch(error => {
                console.log(`No fue posible guardar el archivo con este único producto: ${error}`);
                res.send(`No fue posible guardar el archivo con este único producto: ${error}`);
            })
        }
       
        else {
            var productToAdd = product;
            let idsArray = [];
    
            products.map((prod) =>{
                if (prod.hasOwnProperty("id")){
                    idsArray.push(prod.id);
                }
            });

            let maxId = idsArray.sort((a,b)=> a-b)[idsArray.length-1];
            let id = maxId + 1;

            productToAdd.id = id;
            let productsUpdate = products.push(productToAdd); 
            productsUpdate = JSON.stringify(products, null, 2);

            try{
                fs.writeFileSync("./products.json", productsUpdate);
                res.send(`El producto fue creado bajo el id ${id}`);
            }
    
            catch (err){
                console.log(`No fue posible sumar el producto en el archivo: ${err}`);
                res.send(`No fue posible sumar el producto en el archivo: ${err}`);
            }
        }
    }

    async update(req, res){
        const idParam = Number(req.params.idParam);
        const product = JSON.parse(req.body);
        var products = await JSON.parse(fs.readFileSync("./products.json", "utf-8"));

        var updateData = product;
        //Nos aseguramos que al actualizar, el ID se mantenga y no se modifique con el id que podría estar en
        //el cuerpo del body
        updateData.id = idParam;

        if (products.some( (item) => item.id === idParam)) {
            console.log("Existe el producto con ese ID");
            let productUpdate = products.filter(prod => prod.id !== updateData.id);
            productUpdate.push(updateData);
            fs.writeFileSync("./products.json", JSON.stringify(productUpdate, null, 2))
            console.log(productUpdate);
            res.send(`La información del producto ${idParam} fue actualizada.`);
        }

        else{
            res.send(`No existe ningún producto con el id ${idParam}. Antes de actualizar o editar un producto, es necesario que lo crees.`);
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








// const fs = require('fs');
// class Products {

//     constructor(){
//         this.db = "./products.json";
//         this.getAll();
//     }


//     async getAll(){
//         try{
//             let getProducts = await fs.readFileSync(this.fileName);

//             if (getProducts.length === 0){
//                 return getProducts;
//             }
           
//             else {
//                 getProducts = JSON.parse(getProducts);
//                 return getProducts;
//             }
//         }

//         catch (err){
//             console.log(`No se pudo leer el archivo: ${err}`);
//         }
//     }
    

//     // Obtener producto por su ID
//     getById(id){
//         id = Number(id);
//         let products = this.getAll();
        
//         var result = [];

//         if (products.length !== 0){

//             if (products.some((item) => item.id === id)){
//                 products.map((it) => {
//                     if (it.id === id){
//                         console.log(it);
//                         result = it;
//                     }
//                 });
//             } else {
//                 console.log(`El producto de ID: ${id} no fue encontrado`);
//                 result = `El producto de ID: ${id} no fue encontrado`;
//             }

//             return result;

//         } else{
//             console.log("No se puede buscar por ID porque la lista de productos está vacía.");
//             return "No se puede buscar por ID porque la lista de productos está vacía.";
//         }  

//     }    

//     //Escribir/Sobreescribir archivo
//     save(product){
//         var productsRead = this.getAll();
//         console.log(productsRead);

//         if (productsRead.length === 0){
//             console.log("Está vacío");
//             var productToAdd = product;

//             productToAdd.id = 1;
//             productToAdd = [productToAdd];
//             productToAdd = JSON.stringify(productToAdd, null, 2);
    
//             fs.writeFile(this.fileName, productToAdd)
//             .then(res => {
//                 console.log(`Guardaste el primer producto de la lista, el id es: 1`)
//                 return "Guardaste el primer producto de la lista, el id es: 1";
//             })
    
//             .catch(error => {
//                 console.log(`No fue posible guardar el archivo con este único producto: ${error}`);
//             })
//         }
       
//         else {
//             var productToAdd = product;
//             let idsArray = [];
    
//             productsRead.map((prod) =>{
//                 if (prod.hasOwnProperty("id")){
//                     idsArray.push(prod.id);
//                 }
//             });

//             let maxId = idsArray.sort((a,b)=> a-b)[idsArray.length-1];
//             let id = maxId + 1;

//             productToAdd.id = id;
//             let productsUpdate = productsRead.push(productToAdd); 
//             productsUpdate = JSON.stringify(productsRead, null, 2);

//             try{
//                 fs.promises.writeFile(this.fileName, productsUpdate);
//                 return `El producto fue creado bajo el id ${id}`;
//             }
    
//             catch (error){
//                 console.log(`No fue posible sumar el producto en el archivo: ${error}`);
//                 return error;
//             }
//         }
//     }


//     update(idParam, product){
//         idParam = Number(idParam);
//         var productsRead = this.getAll();
//         var updateData = product;
//         //Nos aseguramos que al actualizar, el ID se mantenga y no se modifique con el id que podría estar en
//         //el cuerpo del body
//         updateData.id = idParam;

//         if (productsRead.some( (item) => item.id === idParam)) {
//             console.log("Existe el producto con ese ID");
//             let productUpdate = productsRead.filter(prod => prod.id !== updateData.id);
//             productUpdate.push(updateData);
//             fs.promises.writeFile(this.fileName, JSON.stringify(productUpdate, null, 2))
//             console.log(productUpdate);
//             return `La información del producto ${idParam} fue actualizada.`
//         }

//         else{
//             return `No existe ningún producto con el id ${idParam}. Antes de actualizar o editar un producto, es necesario que lo crees.`;
//         }
//     }


//       //Borrar producto por ID
//     deleteById(id){
//         id = Number(id);
//         let products = this.getAll();

//         if (products.length !== 0){
//             //Revisamos si existe el producto con ese ID
//             if (products.some((item) => item.id === id)){
                
//                 //Filtramos el producto a eliminar del listado recuperado
//                 products = products.filter((item) => item.id !== id);
//                 try{
//                     //Escribimos el listado con el producto ya filtrado
//                     fs.promises.writeFile(this.fileName, JSON.stringify(products, null, 2))
//                     console.log(`El producto con ID ${id} fue borrado`);
//                     return `El producto con ID ${id} fue borrado`;
//                 }

//                 catch (err){
//                     console.log(`El producto con ID ${id} no pudo ser borrado: ${err}`);
//                     return `El producto con ID ${id} no pudo ser borrado: ${err}`;
//                 }

//             }
            
//             else {
//                 console.log(`El producto con id ${id} no existe`);
//                 return `El producto con id ${id} no existe`
//             } 
//         }
        
//         else {
//             console.log("No se puede eliminar por ID porque la lista de productos está vacía.");
//             return "No se puede eliminar por ID porque la lista de productos está vacía.";
//         }
//     }

//     //Borrar todos los productos
//     deleteAll(){

//         let products = this.getAll();

//         if (products.length > 0){
//             try{
//                 fs.promises.writeFile(this.fileName, JSON.stringify([], null, 2))
//                 console.log('Todos los productos fueron borrados');
//             }
    
//             catch (err){
//                 console.log(`No fue posible borrar el contenido del archivo: ${err}`);
//             }
//         }

//         else {
//             console.log("No hay productos por borrar, la lista está vacía.")
//         }

//     }

// }


const productController = new Products();
module.exports = productController;