const DbInstance = require('../DbConnection');
const sequelize = DbInstance.getSequelizeInstance();
const Op = DbInstance.Sequelize.Op;
// import { Tables } from '../utils/Tables';

/**
 * Add cart item
 */
module.exports.addCartItem = (dataObj) => {
  console.log("from cartitem model 11")

  let addKeyValues = DbInstance.formAddQuery(dataObj);
  console.log("addKeyValues :: " + addKeyValues)
  let keys = addKeyValues.keys.substring(1, addKeyValues.keys.length);
  console.log("keys :: " + keys)
  let values = addKeyValues.values.substring(1, addKeyValues.values.length);
  console.log("values :: " + values)

  let query = ` INSERT INTO tbl_cart_products (
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

module.exports.deleteCartItem = (id) => {
  // let id = id;
  let query = `UPDATE tbl_cart_products
  SET 
    is_deleted = 1
  WHERE
      id = ${id}`;
  console.log("query :: " + query)
  return sequelize.query(query, {
    type: 'UPDATE'
  }).then(async result => {
    return result;
  }).catch(error => {
    console.log('err from model ' + error)
    return false;
  });
}

module.exports.getCartItems = (user_id) => {
  let whrCondition = '';
  if (typeof user_id !== 'undefined') {
    whrCondition = `where user_id = ${user_id}`;
  }

  let query = `SELECT a.id as id, a.user_id as user_id, b.id as product_id, a.shipping as shipping, a.expected_delivery_date as expected_delivery_date, a.is_deleted as item_deleted, a.qty as qty, b.product_name as product_name, b.url as url, b.product_price as product_price, b.product_quantity as product_quantity, b.product_image_url as product_image_url, b.quantity_available as quantity_available, b.is_deleted as prod_disabled, b.brand as brand, key_feature, b.description as description, benefits, vedic_astro_accociations, cat_id, short_desc FROM  tbl_cart_products a LEFT JOIN tbl_products b ON a.product_id = b.id ${whrCondition} AND a.is_deleted = "0"`
  // let query = `SELECT 
  //                     CI.id AS id,
  //                     CI.customer_id AS customer_id,
  //                     CI.qty AS qty,
  //                     CI.created_at AS created_at,
  //                     CI.product_id,
  //                     P.product_name AS product_name,
  //                     P.rate_per_kg AS product_price,
  //                     P.product_image AS product_image,
  //                     P.is_out_of_stock 
  //                     FROM ${Tables.TABLE_CART_ITEMS} AS CI
  //                     INNER JOIN 
  //                     ${Tables.TABLE_PRODUCTS} AS P ON CI.product_id = P.id                        
  //                     ${whrCondition}`;

  return sequelize.query(query, {
    type: 'SELECT'
  }).then(async result => {
    return result;
  }).catch(error => {
    console.log('err from model ' + error)
    return false;
  });
}

// module.exports.cartItemModel = cartItemModel;
