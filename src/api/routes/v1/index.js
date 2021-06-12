const express = require('express');
const router = express.Router();
const CartItemController = require("../../../controllers/CartItemsController");
const ProductController = require("../../../controllers/ProductController");


// router.post('/cart-items', validateAdminApiAccess, OrgController.validate('createOrg'), OrgController.createOrg);
router.post('/cart-items', CartItemController.addCartItem);
router.get('/cart-items', CartItemController.getCartItem);
router.delete('/cart-items', CartItemController.delCartItem);

// Product Api
router.get('/products', ProductController.getProduct);

module.exports = router;