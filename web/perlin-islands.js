// The code is heavily inspired by the samples at
// https://github.com/josephg/noisejs

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvasWidth = canvas.width = window.innerWidth - 50;
  canvasHeight = canvas.height = window.innerHeight - 50;

  image = ctx.createImageData(canvasWidth, canvasHeight);
  data = image.data;

  noisePeriod = Math.min(canvasWidth, canvasHeight) / 4;
  height = 0;
}

function onResize() {
  canvasWidth = canvas.width = window.innerWidth - 50;
  canvasHeight = canvas.height = window.innerHeight - 50;

  image = ctx.createImageData(canvasWidth, canvasHeight);
  data = image.data;

  var start = Date.now();

  noise.seed(Math.random());
  var noisePeriod = Math.min(canvasWidth, canvasHeight) / 3.2;
  var multiplier = 2.1;

  for (var x = 0; x < canvasWidth; x++) {
    for (var y = 0; y < canvasHeight; y++) {
      var noiseValue = noise.simplex2(x / noisePeriod, y / noisePeriod);
      // noiseValue is between -1 and 1; normalize to 0 ... 1
      var normalizedValue = multiplier * (noiseValue + 1) / 2.0;

      var rawValue = normalizedValue * multiplier;
      var clippedValue = rawValue - Math.floor(rawValue);
      //var value = (Math.cos(clippedValue * 2 * Math.PI) + 1) / 2;
      var value = clippedValue;

      value = Math.floor(value * 256);
      var cell = (x + y * canvasWidth) * 4;

      // Set rgb values to the same value
      data[cell] = data[cell + 1] = data[cell + 2] = value;
      data[cell + 3] = 255; // alpha channel.
    }
  }

  ctx.putImageData(image, 0, 0);

  var end = Date.now();
  console.log('done', end - start);
}

window.addEventListener('resize', onResize, false);

onResize();
