var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var randomstring = require('randomstring');

//*** Middleware ***//
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow CORS
  res.setHeader('Cache-control', 'no-cache'); // disable caching
  next();
});

//*** DB ***//
// typically separate files, kept here for readbility in code challenge
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/hz-chal');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UrlSchema = mongoose.Schema({
  shortUrl: String,
  originalUrl: String,
  visitCount: Number,
  createdAt: Date
});

var Url = mongoose.model('Url', UrlSchema);

//**** Routes ****//
// also typically borken into separate files with contorollers
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    res.send('Hello World!');
  });

router.route('/api/links')
  .get(function(req,res) {
    Url.find({}).then(function(results) {
      res.json(results);
    });
  })
  .post(function(req,res) {
    var newUrl = new Url({
      shortUrl: randomstring.generate(7),
      originalUrl: req.body.originalUrl,
      visitCount: 0,
      createdAt: new Date()
    });
    newUrl.save(function(err, doc) {
      if (!err) {
        res.json({code: doc.code})
      }
    });
  });

router.route('/:id')
  .get(function(req,res) {
    Url.findOne({shortUrl: req.params.id}, function(err, doc) {
      if (!err && doc) {
        doc.visitCount ++
        doc.save(function(err) {
          if (!err) {res.redirect(doc.originalUrl);}
        });
      } else {
        res.send(err);
      }
    })
  });

app.use(router); // router middleware

//*** Express simple HTTP server ****//
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
  console.log('Server started: 104.131.109.177:' + app.get('port')+ '/');
});
