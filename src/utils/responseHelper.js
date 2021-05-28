const { responseMessage } = require('./messages');
const apiResponse = require('./response');

module.exports.showServerError = async (res, eventData, message = responseMessage.error.tryAgain, data = {}) => {
  res.apiPayload = { status: 0, message: message, data: data };
  res.statusCode = 422;
  eventData.data = { status: 0, message: res.apiPayload.message };
  res.eventPayload = eventData;
  return apiResponse.clientResponse(res);
}

module.exports.showSuccess = (res, eventData, message = responseMessage.success.successMessage, data = []) => {
  res.apiPayload = { status: 1, message: message, data: data };
  res.statusCode = 200;
  eventData.data = { status: 1, message: res.apiPayload.message };
  res.eventPayload = eventData;
  return apiResponse.clientResponse(res);
}

module.exports.showException = (res, eventData, message = responseMessage.error.exceptionMessage) => {
  res.apiPayload = { status: 0, message: message, data: {} };
  res.statusCode = 409;
  eventData.data = { status: 0, message: res.apiPayload.message };
  res.eventPayload = eventData;
  return apiResponse.clientResponse(res);
}