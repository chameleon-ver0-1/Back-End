var express = require('express')
var bodyParser = require('body-parser')
var app = express()

const AWS = require('aws-sdk')
const parameters = require('./parameters')
const fs = require('fs')
const sharp = require('sharp')

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false
}));

app.use(bodyParser.json());
//pattern１
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/trans_data', function(req, res) {
  var img = req.body.img;
  var buffer = new Buffer.from(img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  var rekognition = new AWS.Rekognition({
    apiVersion: '2016-06-27',
    accessKeyId: parameters.AWS.accessKeyId,
    secretAccessKey: parameters.AWS.secretAccessKey,
    region: parameters.AWS.region
  });

  //로컬에서 불러온 이미지
  var params = {
    Attributes: ["ALL"],
    Image: {
      Bytes: buffer
    }
  };
  rekognition.detectFaces(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data); // successful response
      try {
        fs.writeFileSync("./result.json", JSON.stringify(data))
      } catch (err) {
        console.error(err)
      }
    }
  });
  res.send("Success");
});

app.listen(3000, () => {
  console.log('Server started!')
})
