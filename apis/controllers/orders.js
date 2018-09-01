const mongoose = require('mongoose');
const Order = require('./../models/order');
const Product = require('./../models/product');

// get all orders
exports.getAllOrders = (req, res, next) => {
    Order.find()
    .exec()
    .then(docs => {
        res.status(201).json({
            message: "List of Orders.",
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    productId: doc.product,
                    quantity: doc.quantity,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + doc._id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
// get all orders

// create order
exports.createOrder = (req, res, next) => {

    Product.findById(req.body.productId)
    .exec()
    .then(result => {
        console.log(result);
        if( !result ) {
           return res.status(404).json({
                failed: "product not found"
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
       return order.save()
    })
    .then(result => {
        res.status(201).json({
            success: "new ordered inserted",
            order: result
        });
    })
    .catch(err => {
        res.status(500).json({
            failed: "failed to insert new order",
            error: err
        })
    })
   
}
// create order

// get single order
exports.singleOrder = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .exec()
    .then(result => {
        if( !result ){
            return res.status(404).json({
                failed: "Order not found."
            })
        }
        res.status(200).json({
            order: result,
            request: {
                type: "GET",
                url: "http://localhost:3000/order"
            }
        })
    })
    .catch()
}
// get single order

// delete order
exports.deleteOrder = (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndRemove({_id: id})
    .exec()
    .then(result => {
        console.log("result: ", result);
        if(result) {
            res.status(200).json({
                success: "Order deleted successfull.",
                productId: result.product,
                quantity: result.quantity,
                _id: result._id,
                request : {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: {
                        productId: "String",
                        quantity: "Number"
                    }
                }

            })
        }
        else {
            res.status(404).json({
                failed: "Order not found."
            })
        }
    })
    .catch(err => {
        console.log("err: ", err);
        res.status(500).json({
            error: err
        })
    })
}
// delete order