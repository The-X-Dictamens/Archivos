
//iniciar Express
var express = require('express');
var path = require('path');
var mysql2 = require('mysql2');
var app = express();
var router = express.Router();
var bodyParser= require('body-parser')
//variabels que se encargan de conectarse a los modulos de routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//lectura de archivos
var fs = require('fs');






const multer = require('multer')
const upload = multer({ dest: 'uploads/' });



// configura el motor de visualizacion ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static('public'));
//path.join() concatena los directorios
app.set('views', path.join(__dirname, 'views'));



//////////////////////////Configuracion de la api de google drive///////////////////////////
const {google} = require('googleapis');
const CLIENT_ID = '811575600397-v8r3l877h6sqnrr6sp1fk1ctfoa2ilvc.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04IzZF9ZbuZrnCgYIARAAGAQSNwF-L9Ir52lF9MZuoOJVBUt2uo1VduV0pJNQ32ZizUFFFBneAjPavY2pifMOgkJg5KS6QAso20o';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
})


///////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////Configuracion de la coneccion de la base de datos//////////////////

var conexion = mysql2.createConnection({
  host: 'localhost',
  database: 'mybase',
  user: 'root',
  password:'11608041211'
});

///////////////////////////////////////////////////////////////////////////////////////////////


////////////////rutas de control de back end//////////////////

app.post('/agregarDB',upload.single('image'),async(req,res)=>{
  var nombre = req.body.name;
  var descripcion = req.body.description;

  //agregar la imagen a drive
  try {
    const response = await drive.files.create({
 
      resource: {
        name: req.file.originalname, 
        mimeType: req.file.mimetype, 
      },
      media: {
        mimeType: req.file.mimetype,
        body: req.file.stream,
      },
    });
    
  } catch (err) {
    console.log('Error uploading file:', err);
  }
  ///////////////////////////



  /*
  conexion.query('INSERT INTO videojuegos (nom_vd, des_vd) VALUES ("'+ nombre +'","'+ descripcion +'")";', (err,res)=>{
    if(err)throw err;
  })
  */
  
  res.redirect('/')

});



//funcionde de google drive












//mostrar ejs
app.get('/agregar',(req,res)=>{
  res.render('vagregar');
});





//inicar servidor en el puerto 8080
app.use(express.static('public'));
app.listen(8080, ()=> {
    console.log('ya se corre en http://localhost:8080 7u7')
});

app.use('/', indexRouter);
app.use('/users', usersRouter);



//responde a las solicitudes que no existen en la aplicacion
app.use((req, res, next)=>{
    res.status(404).render("404")
  })
  

 app.use(function(err, req, res, next) {
    
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  }); 



module.exports = app;





