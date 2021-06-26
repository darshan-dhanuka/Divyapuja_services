const orderModel = require("../models/orderModel");
const { responseMessage } = require('../utils/messages');
const apiResponse = require('../utils/response');
// import Razorpay from 'razorpay';
const Razorpay = require('razorpay');

exports.placeOrder = async (req, res) => {
    const { user_id, grand_total } = req.body;

    // you have to pass grand_total in paisa format so pass 100
    var options = {
        amount: grand_total,
        currency: "INR",
        payment_capture: '1'
    };

    options.receipt = await getReceiptNo(user_id);

    try {
        console.log('options => ', options);
        let orderDetails = await placeOrderOnRazorPay(options);
        console.log('orderDetails => ', orderDetails);
        // if (orderDetails) {
        //     let orderPlaced = await this.addOrder(this.req.body, orderDetails);
        //     if (orderPlaced && orderPlaced.length) {
        //         res.apiPayload = { status: 1, message: responseMessage.success.orderDetails, data: { orderDetails } };
        //         res.statusCode = 200;
        //         return apiResponse.clientResponse(res);
        //     } else {
        //         res.apiPayload = { status: 0, message: responseMessage.error.tryAgain, data: {} };
        //         res.statusCode = 422;
        //         return apiResponse.clientResponse(res);
        //     }

        // } else {
        //     res.apiPayload = { status: 0, message: responseMessage.error.tryAgain, data: {} };
        //     res.statusCode = 422;
        //     return apiResponse.clientResponse(res);
        // }

        res.apiPayload = { status: 1, message: 'order details', data: { orderDetails } };
        res.statusCode = 200;
        return apiResponse.clientResponse(res);

    } catch (err) {
        res.apiPayload = { status: 0, message: "Exception : " + err, data: {} };
        res.statusCode = 409;
        return apiResponse.clientResponse(res);
    }

}

function getReceiptNo(user_id) {
    return new Promise((resolve, reject) => {
        orderModel.getPaymentLastId()
            .then(count => {
                if (count) {
                    let orderReceiptNo = `order_receipt_${user_id}_${count}`
                    resolve(orderReceiptNo);
                } else {
                    reject(new Error("Please try again!"));
                }
            }).catch(err => {
                reject(err);
            });
    })
}

/**
 * Place order on Razor Pay
 * @param {*} options Order Object
 */
function placeOrderOnRazorPay(options) {

    return new Promise((resolve, reject) => {

        // var options = {
        //     amount: 22,
        //     currency: "INR",
        //     payment_capture: '1'
        // };

        let instance = new Razorpay({
            key_id: 'rzp_test_MR7UimzbaGMepN',
            key_secret: 'CVn8q0HWe1TSGe6HMLx2OQXP',
            // headers: {
            //   "X-Razorpay-Account": "FLP9LId12HmcCU"
            // }
        });

        console.log('payment option2 :: ' + JSON.stringify(options));

        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log('payment err 1 :: ' + JSON.stringify(err));
                resolve(false);
            } else {
                console.log('payment succ :: ' + order);
                resolve(order)
            }
        });
    }).catch(err => {
        reject(err)
    });
}

/**
* Add order in our Database
* @param {*} body  Request Body
* @param {*} orderDetails Order details with order id
*/
// function addOrder(body, orderDetails) {
//     const { customer_id, order_items, grand_total, cust_address_id, order_note, order_date } = body;
//     const { id, receipt } = orderDetails;

//     let promiseArray = [];
//     let groceryOrderObj = {
//         customer_id: customer_id,
//         order_id: id,
//         receipt_no: receipt,
//         cust_address_id: cust_address_id,
//         payment_status: 0,
//         order_note: order_note,
//         tax_amt: 0,
//         shipping_amt: 0,
//         grand_total: grand_total,
//         order_status: 'pending',
//         order_date: order_date,
//         created_at: this.getCurrentDate()
//     }

//     // Return order id from here to insert order items in order_items table
//     let orderResultArr = await this.GroceryOrderModel.addGroceryOrderPayment(groceryOrderObj);
//     if (orderResultArr) {

//         try {

//             promiseArray.push(orderResultArr);
//             // Insert multiple order items into order_items table agains order id      
//             let orderItemsDetails = typeof (order_items) === 'string' ? JSON.parse(order_items) : order_items;
//             for (let item of orderItemsDetails) {
//                 let dataObj = {
//                     order_id: orderResultArr[0],
//                     product_id: item.product_id,
//                     price: item.price,
//                     qty: item.qty,
//                     sub_total: parseFloat(item.price) * item.qty,
//                     created_at: this.getCurrentDate(),
//                 }
//                 promiseArray.push(await this.GroceryOrderModel.addOrderItems(dataObj));
//             }

//             return Promise.all(promiseArray)
//                 .then(result => {
//                     return result;
//                 }).catch(err => {
//                     return false;
//                 })

//         } catch (err) {
//             return false;
//         }

//     } else {
//         return false;
//     }

// }

exports.updateOrder = async (req, res) => {

}

exports.getOrders = async (req, res) => {
}