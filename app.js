const path = require('path'),
      fs= require('fs'),
      express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'), 
      cors = require('cors'),
      checkAuth = require("./middleware/authorize"),
      environment = require('./config/environment'),
      auth = require('./middleware/auth'),
      errorHandler = require('./middleware/error-handler'),
      requestHandler= require('./middleware/request-handler'),
      config =environment.config(),
      helmet = require('helmet');

const app = express();

app.use(bodyParser.json({ limit: '500mb' })); 

app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet())

app.use(cors());

app.use(requestHandler);

var morgan = require('morgan');
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.use('/images', express.static(path.join(__dirname, 'images')));

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '4d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static(path.resolve(__dirname, "dist/angular")));

app.use(auth);

app.use(errorHandler);

app.use("/api/todo", checkAuth, require("./routes/todo"));
app.use("/api/user", require("./routes/user"));

app.get('/api/*', function(req, res) {
 res.status(404).json({
    status: false,
    message: "API not there",
  });
});

app.all('/*', (req, res) => {
   res.sendFile(path.resolve(__dirname, "dist/angular/index.html"));
});


const DBurl1=config.DBurl+'TODOS',
      DBurl2='mongodb+srv://chowdary:qyWwFj7bDJhJD7Pb@cluster0-h8j8p.mongodb.net/smartML1?retryWrites=true&w=majority',
      port=process.env.NODE_ENV === 'production' ? 80 : 9009;

mongoose.connect(DBurl1)
    .then(result => {
      app.listen(process.env.PORT || port);
      console.log(`Server is running on http://localhost:${port}`);
    })
    .catch(err => console.log(err));
