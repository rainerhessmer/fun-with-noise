// The code is heavily inspired by the samples at
// https://github.com/josephg/noisejs

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvasWidth;
var canvasHeight;

var image
var data;

var noisePeriod;
var height = 0;
var startTime;
var isPaused = false;

function onNewFrame() {
  if (!isPaused) {
    drawFrame();
  }
  requestAnimationFrame(onNewFrame);
}

function drawFrame() {
  var startTime = Date.now();

  for (var x = 0; x < canvasWidth; x++) {
    for (var y = 0; y < canvasHeight; y++) {
      var value = Math.abs(noise.simplex3(x / noisePeriod, y / noisePeriod, height));
      value *= 256;

      var cell = (x + y * canvasWidth) * 4;
      data[cell] = data[cell + 1] = data[cell + 2] = value;
      data[cell] += Math.max(0, (20 - value) * 8);
      data[cell + 3] = 255; // alpha.
    }
  }

  ctx.putImageData(image, 0, 0);

  var endTime = Date.now();

  //ctx.font = '16px sans-serif'
  //ctx.textAlign = 'center';
  //ctx.fillText('Rendered in ' + (end - start) + ' ms', canvasWidth / 2, height - 20);

  if(console) {
    console.log('Rendered in ' + (endTime - startTime) + ' ms');
  }

  height += 0.01;
}

function resizeCanvas() {
  canvasWidth = canvas.width = window.innerWidth - 50;
  canvasHeight = canvas.height = window.innerHeight - 50;

  image = ctx.createImageData(canvasWidth, canvasHeight);
  data = image.data;

  noisePeriod = Math.max(canvasWidth, canvasHeight) / 8;
  isPaused = false;
}

window.addEventListener('resize', resizeCanvas, false);

window.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.key == " ") {
      // toggle isPaused
        isPaused = !isPaused;
    }
};

resizeCanvas();
requestAnimationFrame(onNewFrame);
