//set up canvas
var canvas = document.createElement("canvas")
var freqCanvas = canvas.getContext("2d")
var cw = canvas.width = 1024
var ch = canvas.height =255

var waveForm = document.createElement("canvas")
waveForm.width = 1024
waveForm.height =255
var ctxw = waveForm.getContext("2d")
canvas.style.background = "whitesmoke"
document.body.appendChild(canvas);
document.body.appendChild(waveForm);

let audio        = document.getElementById("audio")
let audioContext = ""
let analyser     = ""
let source       = ""
let duration     = 0

function play(){
// Set up web audio object
    window.AudioContext = window.AudioContext||window.webkitAudioContext; // old safari trick
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.connect(audioContext.destination);
    source = audioContext.createMediaElementSource(audio);
    // async, wait for audio to load before connecting to audioContext
    audio.addEventListener("canplaythrough", function(){
        source.connect(analyser);
        draw();
    })
    audio.play()
}

function getDataFromAudio(){
  analyser.fftSize = 2048*4;
  let freqByteData = new Uint8Array(analyser.fftSize/2);
  let timeByteData = new Uint8Array(analyser.fftSize/2);
  analyser.getByteFrequencyData(freqByteData);
  analyser.getByteTimeDomainData(timeByteData);
  return {f:freqByteData, t:timeByteData}; // array of all 1024 levels
}

var currentTime ;
function draw(t) {
   currentTime = audio.currentTime;
  freqCanvas.clearRect(0,0,1024,255)
  var ID = requestAnimationFrame(draw);
  if (audio.paused) {
    cancelAnimationFrame(ID)
  }
  var data = getDataFromAudio(); // {f:array, t:array}
  var waveSum = 0;
 //draw live waveform and oscilloscope
  for (let i = 0; i<data.f.length; i++) {
    freqCanvas.fillStyle="black";
    freqCanvas.fillRect(i, ch, 1, -data.f[i]);
    waveSum += data.f[i]; //add current bar value (max 255)
  }
  for (let i = 0; i<data.t.length; i++) {
    freqCanvas.fillStyle="red";
    freqCanvas.fillRect(i*2, data.t[i], 1, 80);
  }
  if (Math.round(currentTime)%4 == 0) {
    ctxw.fillRect(currentTime/duration*1024, ch, 1,-waveSum/data.f.length);
  }
}