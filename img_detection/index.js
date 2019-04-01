var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');

//보안 관련 모듈
var helmet = require('helmet');
app.use(helmet());

var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');

//정적인 파일 사용하기 위한 준비
//public 디렉터리 안에 있는 정적인 파일만 url로 사용가능.
///images/hello.jpg
app.use(express.static('public'));
//body-parser가 만들어낸 미들웨어
//post형식의 데이터를 알아서 처리..create_process,update_process,delete_process를 간결하게 표현 가능
app.use(bodyParser.urlencoded({
  extended: false
}));
//데이터 압축 미들웨어--->이코드만 적으면 데이터 용량이 알아서 줄어듬.
app.use(compression());
//사용자 정의 미들웨어 ---> fs.readdir('./data', function(error, filelist) 없애도됨.
app.get('*', function(request, response, next) { //get으로 들어온 요청만 해당됨. *은 모든을 뜻함.
  fs.readdir('./data', function(error, filelist) {
    request.list = filelist;
    next();
  });
});

//홈페이지 구성
app.use('/',indexRouter);

//홈페이지 외의 화면 라우터 모듈 사용
app.use('/topic',topicRouter);

app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

//끝에 위치한 이유: 미들웨어는 순차적으로 진행되기 때문.
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000);
