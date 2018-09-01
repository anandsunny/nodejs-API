const mongoose = require('mongoose');
const User = require('./../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// create user
exports.createUser = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(result => {
        if(result.length > 0 ) {
            res.status(409).json({
                message: "E-Mail exists"
            })
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        error: err
                    })
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result => {
                        res.status(201).json({
                            success: "user created.",
                            email: result.email,
                            password: result.password,
                            _id: result._id,
                            request: {
                                type: "POST",
                                url: "http://localhost:3000/users/singup"
                            },
                            body: {
                                email: "String",
                                password: "String",
                                _id: "ObjectId"
                            }
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
} 
// create user


// get all users
exports.getAllUsers = (req, res, next) => {
    // res.send("hellow");
    User.find()
    .exec()
    .then(docs => {
        const responce = {
            count: docs.length,
            users: docs.map(doc => {
              return {
                email: doc.email,
                password: doc.password,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/users/" + doc._id
                },
                body: {
                    email: "String",
                    password: "String",
                    _id: "ObjectId"
                }
              }  
            })
        }
        res.status(201).json(responce);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
// get all users

// get single user
exports.getSingleUser = (req, res, next) => {
    User.findById({_id: req.params.userId})
    .select('email password _id')
    .exec()
    .then(result => {
        console.log(result);
        const responce = {
            message: "single user",
            email: result.email,
            password: result.password,
            _id: result._id,
            request: {
                type: "GET",
                url: "http://localhost:3000/users/" + result._id
            },
            body: {
                email: "String",
                password: "String",
                _id: "ObjectId"
            }
        }
        // if(result.length > 0 ){
            res.status(201).json(responce);
        // }
        // else {
        //     res.status(500).json({
        //         message: "user not available"
        //     })
        // }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
// get single user

// delete user
exports.deleteUser = (req, res, next) => {
    User.findByIdAndRemove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(201).json({
            success: "user deleted.",
            email: result.email,
            password: result.password,
            _id: result._id,
            request: {
                type: "GET",
                url: "http://localhost:3000/users/"
            },
            body: {
                email: "String",
                password: "String",
                _id: "ObjectId"
            }    
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
// delete user

// user login
exports.loginUser = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1) {
           return res.status(401).json({
                message: "Auth failed!"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: "Auth failed!"
                })
            }
            if(result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    "secret",
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(201).json({
                    success: "Auth Succeed.",
                    token: token
                })
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
// user login