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
        if (orderDetails) {
            let orderPlaced = await addOrder(req.body, orderDetails);
            if (orderPlaced && orderPlaced.length) {
                res.apiPayload = { status: 1, message: 'order details', data: orderDetails };
                res.statusCode = 200;
                return apiResponse.clientResponse(res);
            } else {
                res.apiPayload = { status: 0, message: responseMessage.error.tryAgain, data: {} };
                res.statusCode = 422;
                return apiResponse.clientResponse(res);
            }

        } else {
            res.apiPayload = { status: 0, message: responseMessage.error.tryAgain, data: {} };
            res.statusCode = 422;
            return apiResponse.clientResponse(res);
        }

        // res.apiPayload = { status: 1, message: 'order details', data: { orderDetails } };
        // res.statusCode = 200;
        // return apiResponse.clientResponse(res);

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
const addOrder = async(body, orderDetails) => {
    const { user_id, order_items, grand_total, user_address_id, order_note, delivery_date, name, last_name, email, mobile_num, user_street, user_appartment, user_city, user_state, user_postcode, user_country, company } = body;
    const { id, receipt } = orderDetails;

    let promiseArray = [];
    let OrderObj = {
        user_id: user_id,
        order_id: id,
        receipt_no: receipt,
        user_address_id: user_address_id,
        payment_status: 0,
        order_note: order_note,
        tax_amt: 0,
        shipping_amt: 0,
        grand_total: grand_total,
        order_status: 'pending',
        delivery_date: delivery_date,
        payment_method: 'razorpay',
        created_at: moment().format('YYYY-MM-DD hh:mm:ss')
    }

    // Return order id from here to insert order items in order_items table
    let orderResultArr = await orderModel.OrderPayment(OrderObj);
    console.log(' order payment data saved ')
    if (orderResultArr) {
        try {
            console.log(' in try ')
            promiseArray.push(orderResultArr);
            // Insert multiple order items into order_items table agains order id      
            let orderItemsDetails = typeof (order_items) === 'string' ? JSON.parse(order_items) : order_items;
            for (let item of orderItemsDetails) {
                let dataObj = {
                    order_id: orderResultArr[0],
                    product_id: item.product_id,
                    price: item.price,
                    qty: item.qty,
                    sub_total: parseFloat(item.price) * item.qty,
                    created_at: moment().format('YYYY-MM-DD hh:mm:ss')
                }
                promiseArray.push(await orderModel.addOrderItems(dataObj));
            }
            console.log(' in try after for ')
            return Promise.all(promiseArray)
                .then(result => {
                    console.log(' in try from promise ')
                    return result;
                }).catch(err => {
                    console.log(' in promise catch ')
                    return false;
                })

        } catch (err) {
            console.log(' in addOrder catch ')
            return false;
        }

    } else {
        console.log(' in addOrder outer else ')
        return false;
    }

}

exports.updateOrder = async (req, res) => {

}

exports.getOrders = async (req, res) => {
}