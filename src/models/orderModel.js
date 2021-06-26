const DbInstance = require('../DbConnection');
const sequelize = DbInstance.getSequelizeInstance();
const Op = DbInstance.Sequelize.Op;

module.exports.getPaymentLastId = () => {
    let countQuery = `SELECT count(*) AS last_payment_id FROM tbl_orders;`

    return sequelize.query(countQuery, {
      type: 'SELECT'
    }).then(async result => {
      let count = 0;
      if (result) {
        count = result[0].last_payment_id + 1;
      }
      return count;
    }).catch(error => {
      console.log("COUNT ERROR ", error);
      return false;
    });
}

module.exports.OrderPayment = (dataObj) => {
  console.log("from orderPayment")

  let addKeyValues = DbInstance.formAddQuery(dataObj);
  console.log("addKeyValues :: " + addKeyValues)
  let keys = addKeyValues.keys.substring(1, addKeyValues.keys.length);
  console.log("keys :: " + keys)
  let values = addKeyValues.values.substring(1, addKeyValues.values.length);
  console.log("values :: " + values)

  let query = ` INSERT INTO tbl_orders (
    ${keys}
) VALUES (${values})`;
  console.log("query :: " + query)
  return sequelize.query(query, {
    bind: dataObj,
    type: 'INSERT'
  }).then(async result => {
    console.log('order payment success ')
    return result;
  }).catch(error => {
    console.log('err from model ' + error)
    return false;
  });
}

module.exports.addOrderItems = (dataObj) => {
  console.log("from addOrderItems")

  let addKeyValues = DbInstance.formAddQuery(dataObj);
  console.log("addKeyValues :: " + addKeyValues)
  let keys = addKeyValues.keys.substring(1, addKeyValues.keys.length);
  console.log("keys :: " + keys)
  let values = addKeyValues.values.substring(1, addKeyValues.values.length);
  console.log("values :: " + values)

  let query = ` INSERT INTO tbl_order_items (
    ${keys}
) VALUES (${values})`;
  console.log("query :: " + query)
  return sequelize.query(query, {
    bind: dataObj,
    type: 'INSERT'
  }).then(async result => {
    return result;
  }).catch(error => {
    console.log('err from model ' + error)
    return false;
  });
}

module.exports.updateOrderByOrderId = (dataObj) => {
  let updateColumn = DbInstance.formUpdateQuery(dataObj);

    let query = `UPDATE tbl_orders 
  SET 
      `+ updateColumn + `
  WHERE  
    order_id="${dataObj.order_id}"`;

    return sequelize.query(query, {
      type: 'UPDATE'
    }).then(async result => {
      return result;
    }).catch(error => {
      return false;
    });
}
  
// module.exports.cartItemModel = cartItemModel;
