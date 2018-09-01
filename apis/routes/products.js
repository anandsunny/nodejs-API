const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('./../middlwares/check_auth');
const ProductController = require('./../controllers/products');

const storage = multer.diskStorage({
    destination : function(req, file, cd) {
        cd(null, './uploads/')
    },
    filename: function(req, file, cd){
        cd(null, file.originalname);
    }
})

const fileFilter = (req, file, cd) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cd(null, true);
    }
    else {
        cd(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // max 5mb file
    },
    fileFilter: fileFilter
})

// const upload = multer({dest: './uploads/'});

// get all products
router.get('/', ProductController.getAllProducts);

// create product
router.post('/', checkAuth, upload.single('productImage'), ProductController.createProduct);

// get single product by product id
router.get('/:productId', ProductController.getSingleProduct);

// update product
router.patch('/:productId',checkAuth, ProductController.updateProduct);

// delete product
router.delete('/:productId', ProductController.deleteProduct)

module.exports = router;