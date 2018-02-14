// 获取页面元素
var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var send = document.querySelector('.send');
var msg_content = document.querySelector('.content');
var chunks = [];

// 初始化按钮状态
stop.disabled = true;

// 设置websocket服务器地址
const wsUrl = 'ws://localhost:8000/';
const ws = new WebSocket(wsUrl);

// Websocket钩子方法
ws.onopen = function(evt) {
    console.log('ws open()');
}

ws.onerror = function(err) {
    console.error('ws onerror() ERR:', err);
}

ws.onmessage = function(evt) {
    console.log('ws onmessage() data:', evt.data);

    // 接收Blob对象
    var blob = new Blob(evt.data, { 'type' : 'audio/ogg; codecs=opus' });

    // 添加audio元素
    var audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    msg_content.appendChild(audio);
    audio.controls = true;
    audio.src = window.URL.createObjectURL(blob);
}


if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  var constraints = { audio: true };

  var onSuccess = function(stream) {
    var mediaRecorder = new MediaRecorder(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      // 保存录音
      var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];

      // 发送录音
      ws.send(blob);

      console.log("recorder stopped"); 
    }

    // 录音逻辑
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  // 开始获取音频流
  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}
