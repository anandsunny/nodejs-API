const express = require('express');
const app = express();
const productRoutes = require('./apis/routes/products');
const orderRoutes = require('./apis/routes/orders');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./apis/routes/users');

mongoose.connect('mongodb://localhost:27017/mydb')
.then(() => {
    console.log("database connected successfull");
})
.catch((err) => {
    console.log(`database error: ${err.message} `);
});

mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     // req.header("Access-Control-Allow-Origin", "*");
//     // req.header("Access-Control-Allow-Headers", "Origin, X-Requisted-With, Content-Type, Accept, Authorization");
//     // if(req.method === "POTIONS") {
//     //     req.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
//     //         return res.status(200).json({});
//     // }
// })
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message
    })
})

// app.use(morgan('combined'));
// app.get('/', (req, res) => {
//     res.send("hello world");
// })
module.exports = app;

