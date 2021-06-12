const DbInstance = require('../DbConnection');
const sequelize = DbInstance.getSequelizeInstance();
const Op = DbInstance.Sequelize.Op;

module.exports.getProducts = (user_id) => {
  let whrCondition = '';
//   if (typeof user_id !== 'undefined') {
//     whrCondition = `where user_id = ${user_id}`;
//   }

  let query = `SELECT p.*, c.name as category_name FROM  tbl_products p LEFT JOIN tbl_product_category c ON p.cat_id = c.id ${whrCondition} AND p.is_deleted = "0"`
  
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
