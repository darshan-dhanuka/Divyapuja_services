"use strict";
const  express  =  require('express');
const  bodyParser  =  require('body-parser');
const  sqlite3  =  require('sqlite3').verbose();
const  mysql = require('mysql');
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs');
const cors = require('cors');
var multer = require('multer');
var fs = require("fs");
var https = require('https');

var upload = multer({ dest: '/tmp/' })

const  app  =  express();
const  router  =  express.Router();
app.use(cors());
const database = new sqlite3.Database("./my.db");
const SECRET_KEY = "secretkey23456";


const connection = mysql.createConnection({
    host: 'database-1.ckyk4mp0w74m.ap-south-1.rds.amazonaws.com',
    user: 'root',
    password: 'Divyapuja1234',
    database: 'divyapuja'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

const  createUsersTable  = () => {
    const  sqlQuery  =  `
        CREATE TABLE IF NOT EXISTS users (
        id int AUTO_INCREMENT PRIMARY KEY,
        name text,
        email varchar(150) UNIQUE,
        password text)`;

    return  connection.query(sqlQuery, function(err, results, fields) {
                if (err) {
                console.log(err.message);
                }
            });
}



const  createPanditTable  = () => {
    const  sqlQuery  =  `
        CREATE TABLE IF NOT EXISTS tbl_pandit_info (
        id int AUTO_INCREMENT PRIMARY KEY,
        pandit_name varchar(150) ,email_id varchar(250) ,mobile_num varchar(20) ,address text ,
        city varchar(150) ,dob varchar(150) ,languages_known varchar(250) ,experience varchar(20)
        ,adhar_num varchar(30) , pathshala_name  varchar(250) ,pandit_cat  varchar(250) ,about  text,
        photo_url varchar(250) )`;

    return  connection.query(sqlQuery, function(err, results, fields) {
                if (err) {
                console.log(err.message);
                }
            });
}

const  findUserByEmail  = (email, cb) => {
    return  connection.query(`SELECT * FROM users WHERE email = "`+email+`"`, (err, row) => {
            cb(err, row)
    });
}
const  findPanditCat  = (cb) => {
    return  connection.query(`SELECT * FROM tbl_pandit_category `, (err, row) => {
            cb(err, row)
    });
}

const  createUser  = (user, cb) => {
    let sql = 'INSERT INTO users (name, email, password) VALUES ("'+user[0]+'","'+user[1]+'","'+user[2]+'")';
    connection.query(sql,(err, row) => {
        cb(err, row)
    });
}
const  editUser  = (user, cb) => {
    let sql = 'UPDATE  users SET name = "'+user["body"]["user_name"]+'" , mobile_num = "'+user["body"]["mobile_number"]+'" WHERE email = "'+user["body"]["email_id"]+'"';
    connection.query(sql,(err, row) => {
        cb(err, row)
    });
}
const  addAddress  = (user, cb) => {
    let sql =  'INSERT INTO tbl_addresses ( user_id, address) VALUES ("'+user["body"]["id"]+'","'+useruser["body"]["address"]+'")';
    connection.query(sql,(err, row) => {
        cb(err, row)
    });
}
const  getAddress  = (user,cb) => {
    return  connection.query(`SELECT * FROM tbl_addresses WHERE user_id = "`+user["body"]["id"]+`"`, (err, row) => {
            cb(err, row)
    });
}
const  editAddress  = (user,cb) => {
    return  connection.query(`UPDATE tbl_addresses SET address = "`+user["body"]["address"]+`" WHERE id = "`+user["body"]["address_id"]+`"`, (err, row) => {
            cb(err, row)
    });
}
const  getProducts  = (user,cb) => {
    return  connection.query(`SELECT * FROM  tbl_products`, (err, row) => {
            cb(err, row)
    });
}

const  addToCart  = (user,cb) => {
    console.log(user);
    return  connection.query('INSERT INTO tbl_cart_products (product_id, user_id,shipping ,expected_delivery_date ) VALUES ("'+user["body"]["product_id"]+'","'+user["body"]["user_id"]+'","'+user["body"]["shipping"]+'","'+user["body"]["expected_delivery_date"]+'"")', (err, row) => {
            cb(err, row)
    });
}
const  removeCart  = (user,cb) => {
    return  connection.query(`UPDATE tbl_cart_products SET is_deleted = "1" WHERE id = "`+user["body"]["cart_id"]+`"`, (err, row) => {
            cb(err, row)
    });
}
const  showCart  = (user,cb) => {
    return  connection.query(`SELECT * FROM  tbl_cart_products WHERE user_id = "`+user["body"]["user_id"]+`" AND is_deleted = "0" `, (err, row) => {
            cb(err, row)
    });
}
const  createPandit  = (user, cb) => {
    console.log(user["body"]);
    let sql = 'INSERT INTO tbl_pandit_info (pandit_name, email_id, mobile_num ,address ,city,dob ,languages_known ,experience,adhar_num , pathshala_name, pandit_cat, about ,photo_url  ) VALUES ("'+user["body"]["pandit_name"]+'","'+user["body"]["email_id"]+'","'+user["body"]["mobile_num"]+'","'+user["body"]["address"]+'" ,"'+user["body"]["city"]+'","'+user["body"]["dob"]+'","'+user["body"]["languages_known"]+'","'+user["body"]["experience"]+'","'+user["body"]["adhar_num"]+'" ,"'+user["body"]["pathshala_name"]+'" ,"'+user["body"]["pandit_cat"]+'" ,"'+user["body"]["about"]+'" ,"'+user["body"]["photo_url"]+'")';
    connection.query(sql,(err, row) => {
        cb(err, row)
    });
}

const  insertImage  = (data, cb) => {
    let sql = 'INSERT INTO tbl_pandit_image (file_path, file_name) VALUES ("'+data[1]+'","'+data[0]["originalname"]+'")';
    connection.query(sql,(err, row) => {
        cb(err, row);
    });
}

router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
console.log(req);
    const  name  =  req.body.firstName;
    const  email  =  req.body.username;
    const  password  =  bcrypt.hashSync(req.body.password);

    createUser([name, email, password], (err)=>{
        if(err) return  res.status(500).send("Server error!");
        findUserByEmail(email, (err, user)=>{
            if (err) return  res.status(500).send('Server error!');  
            const  expiresIn  =  24  *  60  *  60;
            const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
                expiresIn:  expiresIn
            });
            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn          
            });
        });
    });
});

router.post('/login', (req, res) => {
console.log(req);
    const  email  =  req.body.username;
    const  password  =  req.body.password;
    findUserByEmail(email, (err, user)=>{
       
        var resultArray = Object.values(JSON.parse(JSON.stringify(user)))
        if (err) return  res.status(500).send('Server error!');
        if (!resultArray[0]) return  res.status(404).send('User not found!');
        const  result  =  bcrypt.compareSync(password, resultArray[0]["password"]);
        if(!result) return  res.status(401).send('Password not valid!');

        const  expiresIn  =  24  *  60  *  60;
        const  accessToken  =  jwt.sign({ id:  resultArray[0]["id"] }, SECRET_KEY, {
            expiresIn:  expiresIn
        });
        res.status(200).send({ "user":  resultArray[0], "access_token":  accessToken, "expires_in":  expiresIn});
    });
});

router.get('/users', (req, res) => {
    res.status(200).send('This is an authentication server');
});
router.get('/pandit_cat', (req, res) => {
    findPanditCat((err,result)  => {
        var resultArray = Object.values(JSON.parse(JSON.stringify(result)));
       
        if (err) return  res.status(500).send('Server error!');
        if (!resultArray[0]) return  res.status(404).send('No data found!');
        res.status(200).send({ "data":  resultArray});
    });
});
router.post('/pandit_register', (req, res) => {
    createPandit(req, (err)=>{
        if(err) return  res.status(500).send("Server error!");
        res.status(200).send({ "status":  "Registered Successfully" });
    });
});
router.post('/file_upload', upload.single("file"), function (req, res) {
    console.log(req.file);
    var type = req.file.mimetype;
    var type_split =  type.split("/");
    var file = __dirname + "/uploads/" + req.file.originalname ;
    var response = {};
    fs.readFile( req.file.path, function (err, data) {
        if(err) return  res.status(500).send("Server error!");
         fs.writeFile(file, data, function (err) {
            if(err) return  res.status(500).send("Server error!");
            insertImage([req.file,file], (err,row) => {
                if(err) return  res.status(500).send("Server error!");
                response = {
                    message: 'File uploaded successfully',
                    filename: req.file.originalname,
                    id : row.insertId,
                };
                res.status(200).send({ "data":  response});
            });
        });
    });
 })
 router.post('/edit_user',  function (req, res) {
    editUser(req, (err)=>{
        if(err) return  res.status(500).send("Server error!");
        res.status(200).send({ "status":  "Edited Successfully" });
    });
 })
 router.post('/add_address',  function (req, res) {
    addAddress(req, (err)=>{
        if(err) return  res.status(500).send("Server error!");
        res.status(200).send({ "status":  "Added Successfully" });
    });
 })
 router.post('/get_address',  function (req, res) {
    getAddress(req, (err,row)=>{
        if(err) return  res.status(500).send("Server error!");
        var resultArray = Object.values(JSON.parse(JSON.stringify(row)));
        res.status(200).send({ "status":  "Fetched Successfully", "data":resultArray });
    });
 })
 router.post('/edit_address',  function (req, res) {
    editAddress(req, (err,row)=>{
        if(err) return  res.status(500).send("Server error!");
        var resultArray = Object.values(JSON.parse(JSON.stringify(row)));
        res.status(200).send({ "status":  "Edited Successfully", "data":resultArray });
    });
 })

 router.post('/get_products',  function (req, res) {
    getProducts(req, (err,row)=>{
        if(err) return  res.status(500).send("Server error!");
        var resultArray = Object.values(JSON.parse(JSON.stringify(row)));
        res.status(200).send({ "status":  "Success", "data":resultArray });
    });
 })
 router.post('/add_to_cart',  function (req, res) {
    addToCart(req, (err,row)=>{
        if(err) return  res.status(500).send("Server error!");
        var resultArray = Object.values(JSON.parse(JSON.stringify(row)));
        res.status(200).send({ "status":  "Added Successfully" });
    });
 })

 router.post('/remove_from_cart',  function (req, res) {
    removeCart(req, (err,row)=>{
        if(err) return  res.status(500).send("Server error!");
        var resultArray = Object.values(JSON.parse(JSON.stringify(row)));
        res.status(200).send({ "status":  "Removed Successfully" });
    });
 })
 router.post('/show_cart',  function (req, res) {
    showCart(req, (err,row)=>{
        if(err) return  res.status(500).send("Server error!");
        var resultArray = Object.values(JSON.parse(JSON.stringify(row)));
        res.status(200).send({ "status":  "Success", "data":resultArray });
    });
 })
router.get('/', (req, res) => {
    res.status(200).send('This is an authentication server');
});

app.use(router);
const  port  =  process.env.PORT  ||  3000;
const  server  =  app.listen(port, () => {
    console.log('Server listening at http://localhost:'  +  port);
}); 