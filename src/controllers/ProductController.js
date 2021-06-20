const productModel = require("../models/productModel");
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


exports.getProduct = async (req, res) => {
    const { prod_id } = req.query;
    // if (typeof user_id == 'undefined') {
    //     res.apiPayload = { status: 0, message: responseMessage.error.userIdRequired, data: {} };
    //     res.statusCode = 422;
    //     return apiResponse.clientResponse(res);
    // } else if (user_id.length === 0) {
    //     res.apiPayload = { status: 0, message: responseMessage.error.userIdRequired, data: {} };
    //     res.statusCode = 422;
    //     return apiResponse.clientResponse(res);
    // }

    productModel.getProducts(prod_id)
        .then(products => {
            if (!products) {
                res.apiPayload = { status: 0, message: responseMessage.error.tryAgain, data: {} };
                res.statusCode = 422;
                return apiResponse.clientResponse(res);
            } else {
                res.apiPayload = { status: 1, message: responseMessage.success.prodList, data: { products } };
                res.statusCode = 200;
                return apiResponse.clientResponse(res);
            }
            
        }).catch(next => {
            res.apiPayload = { status: 0, message: "Exception : " + next.message, data: {} };
            res.statusCode = 409;
            return apiResponse.clientResponse(res);
        });
}