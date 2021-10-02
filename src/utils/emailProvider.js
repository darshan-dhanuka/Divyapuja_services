const AWS = require("aws-sdk");

AWS.config.update({
  region: 'ap-south-1a',
});
const ses = new AWS.SES();
exports.sendEmailToUser = async (details) => {
  console.log("SES started");
  const { to, subject, emailBody, from = 'corporate@divyapuja.com' } = details;
  const params = {
    Source: "corporate@divyapuja.com",
    Destination: { ToAddresses: to },
    Message: {
      Body: {
        Text: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data: emailBody
        },
        Html: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data: emailBody
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject
      }
    }

  };

  return ses.sendEmail(params).promise()
    .then(data => {
      console.log("SES success", data);
      return true;
    })
    .catch(error => {
      console.log("SES failed", error);
      return false;
    });

}
