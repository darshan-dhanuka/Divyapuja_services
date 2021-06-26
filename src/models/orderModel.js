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
  
// module.exports.cartItemModel = cartItemModel;
