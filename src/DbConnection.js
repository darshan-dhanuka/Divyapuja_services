
/**
 * Get DB connection
 */
class DbConnection {
  constructor() {

  }

  /**
   * gete Aurora db connection for sequelizer
   */
  getSequelizeInstance() {

    if (!DbConnection.sequeConnect) {
      const Sequelize = require('sequelize');
      // console.log('db name : ' + process.env.AURORA_DB_NAME)
      // console.log('host : ' + process.env.AURORA_HOST)
      DbConnection.sequeConnect = new Sequelize('divyapuja', 'root', 'Divyapuja1234', {
        host: 'database-1.ckyk4mp0w74m.ap-south-1.rds.amazonaws.com',
        dialect: 'mysql',
        // migrationStorageTableName: "sequelize_migrations",
        // define: {
        //   timestamps: false
        // }
      });
    }
    return DbConnection.sequeConnect;
  }

  /**
   * Form keys and values for add query based on requested obj
   * @param {*} requestObj 
   */
  formAddQuery(requestObj) {
    let addKeyValuesObj = {};
    let keys = "";
    let values = "";
    Object.entries(requestObj).map(([key, value]) => {
      keys = `${keys},${key}`;
      values = value || value == 0 ? `${values},"${value}"` : `${values},null`;
    });

    addKeyValuesObj.keys = keys;
    addKeyValuesObj.values = values;
    return addKeyValuesObj;
  }

}

module.exports = new DbConnection();

module.exports.Sequelize = require('sequelize');

