const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, 'secret');
        req.userData = decode;
        console.log(token);
        next();
    } catch(err) {
        return res.status(401).json({
            message: 'auth failed!',
            error: err
        })
    }
}