'use strict';

// 회의가 진행 중이면 1, 아니면 0을 가지는 변수
let onAir = 0;

// 음성인식 관련
const recognition = new webkitSpeechRecognition();
const language = 'ko-KR';
const two_line = /\n\n/g;
const one_line = /\n/g;
const first_char = /\S/;

// 미디어 접근 관련
const mediaStreamConstraints = {
    video: true,
    audio: true
};

const localVideo = document.querySelector('video');

let localStream;

function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
}

function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

//--------------------------------------------------------
//-----------------버트으으으은코오오오오드-----------------
//--------------------------------------------------------

// Join 버튼을 클릭하면 회의 시작
var btnJoin = document.getElementById('btnJoin');
btnJoin.addEventListener('click', onBtnJoin);

function onBtnJoin() {

    // 미디어 자원을 얻어온다.
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints).then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

    // 회의 진행 상태로 변경
    onAir = 1;

    console.log("onBtnJoin()");
    console.log("onAir: " + onAir);
};

// Exit 버튼을 클릭하면 회의 종료
var btnExit = document.getElementById('btnExit');
btnExit.addEventListener('click', onBtnExit);

function onBtnExit() {

    // 미디어 자원을 해제한다.
    localStream = null;
    localVideo.srcObject = null;

    alert("Done");

    // 회의 종료 상태로 변경
    onAir = 0;

    console.log("onBtnExit()");
    console.log("onAir: " + onAir);
};
