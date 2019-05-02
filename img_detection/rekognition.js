const AWS = require('aws-sdk')
const parameters = require('./parameters')
const fs = require('fs')

//이부분은 node에서는 실행이 안되고 일반 js에서만 실행됨
//html에서 서버로 전송받는 작업이 필요
//var canvas = document.getElementById(canvas);
//fs.writeFileSync("image/capture.jpg", canvas);

const file = 'public/image/1553769537885-run.jpg';
const bitmap = fs.readFileSync(file);
const buffer = new Buffer.from(bitmap, 'base64')

var rekognition = new AWS.Rekognition({
  apiVersion: '2016-06-27',
  accessKeyId: parameters.AWS.accessKeyId,
  secretAccessKey: parameters.AWS.secretAccessKey,
  region: parameters.AWS.region
});

//버킷에서 불러온 이미지
// var params = {

//   Attributes: ["ALL"],
//   Image: {
//     S3Object: {
//       Bucket: parameters.AWS.bucket,
//       Name: "node-rekognition-folder/1553769537887-Mark_Zuckerberg.jpg"
//     }
//   }
// };

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
