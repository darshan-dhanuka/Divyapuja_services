const DbInstance = require('../DbConnection');
const sequelize = DbInstance.getSequelizeInstance();
const Op = DbInstance.Sequelize.Op;

module.exports.getProducts = (prod_id) => {
  let whrCondition = '';
  if (typeof prod_id !== 'undefined') {
    whrCondition = ` where p.id = ${prod_id}`;
  }

  let query = `SELECT p.*, c.name as category_name FROM  tbl_products p LEFT JOIN tbl_product_category c ON p.cat_id = c.id ${whrCondition} AND p.is_deleted = "0"`
  console.log('query:: ' + query)
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
