const cartItemModel = require("../models/cartItemModel");
const { responseMessage } = require('../utils/messages');
const apiResponse = require('../utils/response');
// const validator = require('validator');

// const helper = require("../../utils/helper");

/**
 * Request parameter validation
 */
// exports.validate = (method) => {
//   switch (method) {
//     case 'createOrg': {
//       return [
//         body('name', responseMessage.error.organisationNameRequired).isLength({ min: 1 }),
//         body('primary_person', responseMessage.error.organisationPrimaryPersonNameRequired).isLength({ min: 1 }),
//         body('phone_number', responseMessage.error.orgPhoneRequired).isLength({ min: 1 }),
//         body('email_address', responseMessage.error.orgEmailIdRequired).isEmail(),
//         body('notification_email', responseMessage.error.notificationEmailRequired).optional().isEmail(),
//         body('connected_org', responseMessage.error.connectedOrgRequired).optional().isNumeric(),
//         body('invoice_start_date', responseMessage.error.invalidSubStartDate).optional().isLength({ min: 1 }),
//         body('sub_discount', responseMessage.error.subDiscountMustBeNumber).optional().isNumeric(),
//         body('sub_period', responseMessage.error.subPeriodMustBeNumber).optional().isNumeric(),

//       ]
//     }
//   }
// }

exports.addCartItem = async (req, res) => {
    const { user_id, product_id, qty } = req.body;

    let dataObj = {
        user_id: user_id,
        product_id: product_id,
        qty: qty,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss")
    }
    console.log(dataObj)

    // Check wheter product exist or not
    // let prodDetailsArr = await this.productModel.getProducts(product_id);
    // if (prodDetailsArr.length === 0) {
    //     return this.showValidationError(ErrorMessage.productDoesNotExist)
    // }

    cartItemModel.addCartItem(dataObj)
        .then(async result => {
            if (!result) {
                res.apiPayload = { status: 0, message: responseMessage.error.tryAgain, data: {} };
                res.statusCode = 422;
                return apiResponse.clientResponse(res);
            } else {
                // var prodDetails = prodDetailsArr[0];
                let resultData = {
                    id: result[0],
                    user_id: user_id,
                    qty: qty,
                    product_id: product_id,
                    // product_name: prodDetails.product_name ? prodDetails.product_name : '',
                    // product_price: prodDetails.rate_per_kg ? prodDetails.rate_per_kg : '',
                    // product_image: prodDetails.product_image,
                    // is_out_of_stock: prodDetails.is_out_of_stock ? prodDetails.is_out_of_stock : 0,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss")
                }
                // console.log('resultData data -->', resultData);
                // return this.showSuccess(SuccessMessage.cartItemAdded, resultData)
                res.apiPayload = { status: 1, message: responseMessage.success.cartItemAdded, data: resultData };
                res.statusCode = 200;
                return apiResponse.clientResponse(res);
            }
        }).catch(err => {
            res.apiPayload = { status: 0, message: "Exception:" + err.message, data: {} };
            res.statusCode = 409;
            return apiResponse.clientResponse(res);
        });
}


exports.getCartItem = async (req, res) => {
    const { user_id } = req.query;
    if (typeof user_id == 'undefined') {
        res.apiPayload = { status: 0, message: responseMessage.error.userIdRequired, data: {} };
        res.statusCode = 422;
        return apiResponse.clientResponse(res);
    } else if (user_id.length === 0) {
        res.apiPayload = { status: 0, message: responseMessage.error.userIdRequired, data: {} };
        res.statusCode = 422;
        return apiResponse.clientResponse(res);
    }

    cartItemModel.getCartItems(user_id)
        .then(cart_items => {
            if (!cart_items) {
                res.apiPayload = { status: 0, message: responseMessage.error.tryAgain, data: {} };
                res.statusCode = 422;
                return apiResponse.clientResponse(res);
            } else {
                res.apiPayload = { status: 1, message: responseMessage.success.cartItemsList, data: { cart_items } };
                res.statusCode = 200;
                return apiResponse.clientResponse(res);
            }
            
        }).catch(next => {
            res.apiPayload = { status: 0, message: "Exception : " + next.message, data: {} };
            res.statusCode = 409;
            return apiResponse.clientResponse(res);
        });
}

exports.delCartItem = async (req, res) => {
    const { id } = req.query;
    if (typeof id == 'undefined') {
        res.apiPayload = { status: 0, message: responseMessage.error.cartItemIdRequired, data: {} };
        res.statusCode = 422;
        return apiResponse.clientResponse(res);
    } else if (id.length === 0) {
        res.apiPayload = { status: 0, message: responseMessage.error.cartItemIdRequired, data: {} };
        res.statusCode = 422;
        return apiResponse.clientResponse(res);
    }

    // Delete 
    cartItemModel.deleteCartItem(id)
        .then(saveResponse => {
            if (!saveResponse) {
                res.apiPayload = { status: 1, message: responseMessage.error.tryAgain, data: {} };
                res.statusCode = 422;
                return apiResponse.clientResponse(res);
            } else {
                res.apiPayload = { status: 1, message: responseMessage.success.cartItemDeleted, data: {} };
                res.statusCode = 200;
                return apiResponse.clientResponse(res);
            }
        }).catch(err => {
            res.apiPayload = { status: 0, message: "Exception:" + err.message, data: {} };
            res.statusCode = 409;
            return apiResponse.clientResponse(res);
        });
}