let video;
let song;
let amplitude;

function preload() {
  song = loadSound('./data/flickeringlight.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  noStroke();

  userStartAudio();


  amplitude = new p5.Amplitude();
amplitude.setInput(song);
amplitude.smooth(0.3);

let vol = amplitude.getLevel();
let scaledVol = constrain(vol * 5, 0, 1);
}

function draw() {
  background('black');

  let centerX = width / 2;
  let centerY = height / 2;
  
  
  let vol = amplitude.getLevel();
  let constrainedVol = constrain(vol * 10, 0, 5); 

  let pink = color(255, 105, 180);
  let grey = color(120);
  let flickerColor = lerpColor(pink, grey, constrainedVol);
  
  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(255, 105, 180);
  textAlign(CENTER, BOTTOM);
  textSize(48);
  fill(flickerColor);
  text('my empathetic dj', centerX, centerY - video.height / 2 - 30);
  
  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(255, 105, 180);
  textAlign(CENTER, BOTTOM);
  textSize(10);
  fill(flickerColor);
  text('click to continue', centerX, centerY);

  let distToCenter = dist(mouseX, mouseY, centerX, centerY);
  let maxDist = dist(0, 0, centerX, centerY);
  let gridSize = int(map(distToCenter, 0, maxDist, 8, 40));

  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(255, 105, 180); 

  video.loadPixels();

  let vidW = video.width;
  let vidH = video.height;
  let offsetX = centerX - vidW / 2;
  let offsetY = centerY - vidH / 2;

  for (let y = 0; y < vidH; y += gridSize) {
    for (let x = 0; x < vidW; x += gridSize) {
      let index = (y * vidW + x) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      let brightness = (r + g + b) / 3;
      let dia = map(brightness, 0, 255, gridSize, 2);

      fill(flickerColor);
      circle(offsetX + x + gridSize / 2, offsetY + y + gridSize / 2, dia);
    }
  }
}

function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.loop();
  }
}
