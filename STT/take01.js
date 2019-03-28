'use strict';

// 회의가 진행 중이면 1, 아니면 0을 가지는 변수
let onAir = false;

// 음성인식 관련
const recognition = new webkitSpeechRecognition();
const language = 'ko-KR';
const two_line = /\n\n/g;
const one_line = /\n/g;
const first_char = /\S/;

const $btnMic = $('#btn-mic');
const $result = $('#result');

// 계속 음성인식 & 중간결과를 리턴하도록 option set
recognition.continuous = true;
recognition.interimResults = true;

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
    onAir = true;

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
    onAir = false;

    console.log("onBtnExit()");
    console.log("onAir: " + onAir);
};

//--------------------------------------------------------
//-----------------음성인식코오오오오오오드-----------------
//--------------------------------------------------------



/**
 * 음성 인식 시작 처리
 */
recognition.onstart = function() {
  console.log('onstart', arguments);
  onAir = true;
  $btnMic.attr('class', 'on');
};

/**
 * 음성 인식 종료 처리
 * @returns {boolean}
 */
recognition.onend = function() {
  console.log('onend', arguments);
  onAir = false;

  if (ignoreEndProcess) {
    return false;
  }

  // DO end process
  $btnMic.attr('class', 'off');
  if (!finalTranscript) {
    console.log('empty finalTranscript');
    return false;
  }
};

/**
 * 음성 인식 결과 처리
 * @param event
 */
recognition.onresult = function(event) {
  console.log('onresult', event);

  let interimTranscript = '';
  if (typeof(event.results) === 'undefined') {
    recognition.onend = null;
    recognition.stop();
    return;
  }

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      finalTranscript += event.results[i][0].transcript;
    } else {
      interimTranscript += event.results[i][0].transcript;
    }
  }

  finalTranscript = capitalize(finalTranscript);
  final_span.innerHTML = linebreak(finalTranscript);
  interim_span.innerHTML = linebreak(interimTranscript);

  console.log('finalTranscript', finalTranscript);
  console.log('interimTranscript', interimTranscript);
  fireCommand(interimTranscript);
};

/**
 * 음성 인식 에러 처리
 * @param event
 */
recognition.onerror = function(event) {
  console.log('onerror', event);

  if (event.error.match(/no-speech|audio-capture|not-allowed/)) {
    ignoreEndProcess = true;
  }

  $btnMic.attr('class', 'off');
};
