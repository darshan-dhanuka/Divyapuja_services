"use strict";
const  express  =  require('express');
const  bodyParser  =  require('body-parser');
const  sqlite3  =  require('sqlite3').verbose();
const  mysql = require('mysql');
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 
const cors = require('cors')

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

const  findUserByEmail  = (email, cb) => {
    return  connection.query(`SELECT * FROM users WHERE email = "`+email+`"`, (err, row) => {
            cb(err, row)
    });
}

const  createUser  = (user, cb) => {
    let sql = 'INSERT INTO users (name, email, password) VALUES ("'+user[0]+'","'+user[1]+'","'+user[2]+'")';
    connection.query(sql,(err, row) => {
        cb(err, row)
    });
}

createUsersTable();
router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
    const  name  =  req.body.name;
    const  email  =  req.body.email;
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
    const  email  =  req.body.email;
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

router.get('/', (req, res) => {
    res.status(200).send('This is an authentication server');
});

app.use(router);
const  port  =  process.env.PORT  ||  3000;
const  server  =  app.listen(port, () => {
    console.log('Server listening at http://localhost:'  +  port);
}); 