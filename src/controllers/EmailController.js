const { responseMessage } = require('../utils/messages');
const apiResponse = require('../utils/response');
const emailProvider = require('../utils/emailProvider');

exports.sendEmail = async (req, res) => {
    const { email_details } = req.body;
    const emailData = JSON.parse(email_details);
    console.log(emailData);

    var msg = '';
    Object.entries(emailData).forEach((entry) => {
        const [key, value] = entry;
        console.log(`${key}: ${value}`);
        if (key != 'subject' || key != 'email') {
            msg += `${key}: ${value} <br>`;
        }
        
    });
    const data = {
        to: [emailData.email],
        subject: emailData.subject,
        emailBody: msg,
        from: 'corporate@divyapuja.com',
    };
    emailProvider.sendEmailToUser(data);


    res.apiPayload = { status: 1, message: 'emaildata', data: { msg } };
    res.statusCode = 200;
    return apiResponse.clientResponse(res);


    // let dataObj = {
    //   payment_id: paymentDetails.payment_id ? paymentDetails.payment_id : null,
    //   order_id: paymentDetails.order_id ? paymentDetails.order_id : null,
    //   razorpay_signature: paymentDetails.signature ? paymentDetails.signature : null,
    //   payment_status: paymentDetails.status ? paymentDetails.status : null,
    //   updated_at: moment().format('YYYY-MM-DD hh:mm:ss')
    // }

    // productModel.getProducts(url)
    //     .then(products => {
    //         if (!products) {
    //             res.apiPayload = { status: 0, message: responseMessage.error.tryAgain, data: {} };
    //             res.statusCode = 422;
    //             return apiResponse.clientResponse(res);
    //         } else {
    //             res.apiPayload = { status: 1, message: responseMessage.success.prodList, data: { products } };
    //             res.statusCode = 200;
    //             return apiResponse.clientResponse(res);
    //         }
            
    //     }).catch(next => {
    //         res.apiPayload = { status: 0, message: "Exception : " + next.message, data: {} };
    //         res.statusCode = 409;
    //         return apiResponse.clientResponse(res);
    //     });
}