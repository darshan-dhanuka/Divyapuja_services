const express = require('express');
const router = express.Router();
const CartItemController = require("../../../controllers/CartItemsController");


// router.post('/add_to_cart', validateAdminApiAccess, OrgController.validate('createOrg'), OrgController.createOrg);
router.post('/add_to_cart', CartItemController.addCartItem);
router.get('/get_products', CartItemController.getProduct);

module.exports = router;