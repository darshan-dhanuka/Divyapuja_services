/**
 * Comman respnse
 */
module.exports.clientResponse = async (res) => {
  console.log("Sending response...");
  return res.status(res.statusCode).send(res.apiPayload).end();
};