var express = require('express');
var router = express.Router();
var mysql2 = require('mysql2');

var conexion = mysql2.createConnection({
  host: 'localhost',
  database: 'mybase',
  user: 'root',
  password:'11608041211'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  conexion.query('SELECT * FROM mybase.videojuego;',(err,respuesta)=>{
    if(err)throw err;
    res.render('index', { title: 'Express',resp: respuesta});
  })
});

module.exports = router;