const express = require('express');
const router = express.Router();
const OrderController = require('./../controllers/orders');
const checkAuth = require('./../middlwares/check_auth');


// get all orders
router.get('/', checkAuth, OrderController.getAllOrders)

// create order
router.post('/', checkAuth, OrderController.createOrder)

// get single order
router.get('/:orderId', checkAuth, OrderController.singleOrder)

router.delete('/:orderId', checkAuth, OrderController.deleteOrder)

module.exports = router;