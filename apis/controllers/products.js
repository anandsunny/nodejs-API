const mongoose = require('mongoose');
const Product = require('./../models/product');

// get all products
exports.getAllProducts = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(result => {
        console.log(result);
        const responce = {
            count: result.length,
            products: result.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        }
        res.status(200).json(responce)
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
// get all products

// create product
exports.createProduct = (req, res, next) => {
    console.log(req.file);
    console.log(req);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name
    });
    product.save()
    .then((result) => {
        res.status(201).json({
            success: "product created successfull.",
            product: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products"
                }
            }
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}
// create product


// get single product by product id
exports.getSingleProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(result => {
        console.log(result);
        if (result) {
            res.status(200).json({
                message: "get single product",
                product: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        }
        else {
            res.status(404).json({
                message: "request data not found in database."
            })
        }

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}
// get single product by product id


// update product
exports.updateProduct = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    console.log(req.body);
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps);
    Product.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            success: "Product updated successfull.",
            name: result.name,
            price: result.price,
            _id: result._id,
            productImage: result.productImage,
            request: {
                type: "POST",
                url: "http://localhost:3000/products" 
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
// update product


// delete product by product id
exports.deleteProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        if(result.n != 0 ) {
            res.status(200).json({
                success: "product deleted successful",
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products",
                    body: {
                        name: "String",
                        price: "Number"
                    }
                }
            })
        }
        else {
            res.status(404).json({
                error: "product could not be deleted."
            })
        }
        
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
// delete product by product id