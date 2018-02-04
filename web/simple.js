var canvas = document.getElementsByTagName('canvas')[0];

canvas.width = 1440;
canvas.height = 900;

var ctx = canvas.getContext('2d');
var start = Date.now();

noise.seed(Math.random());

var image = ctx.createImageData(canvas.width, canvas.height);
var data = image.data;
const noisePeriod = 200;
for (var x = 0; x < canvas.width; x++) {
  for (var y = 0; y < canvas.height; y++) {
    //var relativePosition = x / canvas.width;
    var dx = x - canvas.width / 2;
    var dy = y - canvas.height / 2;
    var relativePosition = Math.sqrt(dx * dx + dy * dy) / canvas.height;
    var valueOffset = Math.cos(relativePosition * Math.PI / 2);
    var featureScale = 1 - valueOffset;

    var feature = (1 + Math.cos(Math.PI * noise.simplex2(x / noisePeriod, y / noisePeriod))) / 2;

    //var value = 1 - x / canvas.width + (1 + Math.cos(Math.PI * noise.simplex2(x / 400, y / 400))) / 2;
    var value = valueOffset + featureScale * feature;
    value = Math.floor(value * 256);
    var cell = (x + y * canvas.width) * 4;

    // Set rgb values to the same value
    data[cell] = data[cell + 1] = data[cell + 2] = value;
    data[cell + 3] = 255; // alpha.
  }
}

ctx.fillColor = 'black';
ctx.fillRect(0, 0, 100, 100);
ctx.putImageData(image, 0, 0);

var end = Date.now();
console.log('done', end - start);
