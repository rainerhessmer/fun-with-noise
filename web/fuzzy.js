// The code is heavily inspired by the samples at
// https://github.com/josephg/noisejs

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvasWidth;
var canvasHeight;
var canvasCenter;

var image
var data;

var noisePeriod;
var t = 0;
var isPaused = false;
var wrapAround = false;
var center;

const particlesPerClick = 1000;
var particles = [];
// A single particle contains its location (x,y) and its initial direction phi.
// Start angle spread:

const startDeltaPhi = 0; //0.1 * Math.PI;
const perStepDeltaPhi = 0.005 * Math.PI;
const fieldContribution = 0.9;
const maxDeltaPhi = 0.1;
const noisePeriodRatio = 4.5;

noise.seed(Math.random());

function resizeCanvas() {
  canvasWidth = canvas.width = window.innerWidth - 50;
  canvasHeight = canvas.height = window.innerHeight - 50;

  canvasCenter = {
    x: canvasWidth / 2,
    y: canvasHeight / 2
  };

  image = ctx.createImageData(canvasWidth, canvasHeight);
  data = image.data;

  noisePeriod = Math.max(canvasWidth, canvasHeight) / noisePeriodRatio;
  isPaused = false;

  // particles = createParticlesInRectangle(0.8 * w, 0.8 * h);
  /*
  var x = 0.5 * (Math.random() - 0.5) * canvasWidth + canvasCenter.x;
  var y = 0.5 * (Math.random() - 0.5) * canvasHeight + canvasCenter.y;
  center = {
    x: x,
    y: y
  };
  */
  addParticlesOnCircle(canvasCenter, 0);
}

function addParticles(x, y) {
  addParticlesOnCircle(x, y, 0);
}

function addParticlesInRectangle(width, height) {
  for (var i = 1; i <= particlesPerClick; i++) {
    var point = createStartPointInCenteredRect(0.8 * canvasWidth, 0.8 * canvasHeight);

    particles.push({
      x: point.x,
      y: point.y,
      phi: 0 + startDeltaPhi * (Math.random() - 0.5)
    });
    //
    particles.push({
      x: point.x,
      y: point.y,
      phi: Math.PI + startDeltaPhi * (Math.random() - 0.5)
    });
  }
}

// Creates points randomly within a rectangle at the center of the canvas.
function createStartPointInCenteredRect(width, height) {
  return {
    x: w / 2.0 + (Math.random() - 0.5) * width,
    y: h / 2.0 + (Math.random() - 0.5) * height
  }
}

function addParticlesOnCircle(center, radius) {
  for (var i = 1; i <= particlesPerClick; i++) {
    var angle = 2 * Math.PI * Math.random();
    particles.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
      phi: angle + startDeltaPhi * (Math.random() - 0.5)
    });
  }
}

function drawFrame() {
  for (var j = 0, len = particles.length; j < len; j++) {
    var p = particles[j];

    // Get the perlin noise value (a single float) based on the location of the particle
    var v = noise.perlin3(p.x / noisePeriod, p.y / noisePeriod, t);

    // Set fill style HSLA(hue, saturation, lightness, alpha)
    ctx.fillStyle = "hsla(" + (Math.floor(v * 360)) + ", 95%, 20%, 0.05)";
    ctx.fillRect(p.x, p.y, 1.5, 1.5);

    // Alter the original particle direction based on the noise value
    var fieldPhi = v * 2 * Math.PI; // + p.phi;
    var appliedPhi = p.phi + fieldContribution * fieldPhi;

    // Move the particle in the new direction
    p.x += Math.cos(appliedPhi);
    p.y += Math.sin(appliedPhi);

    if (wrapAround) {
      p.x = (p.x + canvasWidth) % canvasWidth;
      p.y = (p.y + canvasHeight) % canvasHeight;
    }

    /*
    // The further the particle is from the center the more we redirect it back.
    var dx = p.x - canvasCenter.x;
    var dy = p.y - canvasCenter.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var distanceRatio = distance / Math.max(canvasWidth, canvasHeight);

    var theta = Math.atan2(p.x, p.y) + Math.PI;

    p.phi += (theta - p.phi) * distanceRatio * Math.random() * 0.01;
    */

    p.phi += perStepDeltaPhi * maxDeltaPhi * 2 * Math.PI * (Math.random() - 0.5);
    // p.phi = newParticlePhi;
  }

  // noise surface ahead.
  t += 0.000;
};

function onNewFrame() {
  if (!isPaused) {
    drawFrame();
  }
  requestAnimationFrame(onNewFrame);
}

//window.addEventListener('resize', resizeCanvas, false);

window.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.key == " ") {
      // toggle isPaused
      isPaused = !isPaused;
    }
};

/*
window.onclick = function(evt) {
  addParticles(evt.clientX, evt.clientY);
}
*/

resizeCanvas();
requestAnimationFrame(onNewFrame);
