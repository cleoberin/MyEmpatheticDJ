let song, analyzer;
let currentColor;
let colors = ["#39ff14", "#ff0aff"];
let colorIndex = 0;
let showIntro = true;
let rings = [];
let backButton;
let buttonVisible = false;
let musicStartTime;
let strobeAlpha = 0;

let capture, tracker, positions;
let w = 0, h = 0;

function preload() {
  song = loadSound('./VonDutch.mp3');
}

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  background(0);
  currentColor = color(colors[colorIndex]);

  analyzer = new p5.Amplitude();
  analyzer.setInput(song);

  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
}

function draw() {
  background(0, 20);

  if (song.isPlaying()) {
    showIntro = false;
    let vol = analyzer.getLevel();
    let maxDim = max(width, height);
    let size = map(vol, 0, 0.4, maxDim * 0.3, maxDim * 1.2);

    // Flashing strobe effect
    if (vol > 0.2 && frameCount % 10 === 0) {
      strobeAlpha = 150;
    }

    if (strobeAlpha > 0) {
      fill(random(colors) + hex(floor(strobeAlpha), 2));
      noStroke();
      rect(0, 0, width, height);
      strobeAlpha -= 10;
    }

    noFill();
    stroke(currentColor);
    strokeWeight(4);
    ellipse(width / 2, height / 2, size);

    if (frameCount % 5 === 0) {
      rings.push(new PulseRing(width / 2, height / 2, size));
    }
    for (let r of rings) {
      r.update();
      r.display();
    }
    rings = rings.filter(r => r.alpha > 0);

    push();
    translate(width / 2, height / 2);
    rotate(vol * frameCount * 2.0);
    fill(currentColor);
    noStroke();
    textSize(size / 15 + 30);
    textAlign(CENTER, CENTER);
    text("your move", 0, 0);
    pop();
  }

  if (showIntro) {
    fill("#39ff14");
    textAlign(CENTER, CENTER);
    textSize(28);
    text("you should be your own empathetic dj. [click to begin]", width / 2, height / 2);
  }

  translate(width, 0);
  scale(-1, 1);
  positions = tracker.getCurrentPosition();

  if (positions && positions.length > 0) {
    const eye1 = {
      outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPoint),
      center: getPoint(27),
      top: getPoint(24),
      bottom: getPoint(26)
    };
    const eye2 = {
      outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPoint),
      center: getPoint(32),
      top: getPoint(29),
      bottom: getPoint(31)
    };

    let irisColor = color(random(colors));
    drawEye(eye1, irisColor);
    drawEye(eye2, irisColor);
  }

  if (song.isPlaying() && millis() - musicStartTime > 5000 && !buttonVisible) {
    createBackButton();
    buttonVisible = true;
  }
}

function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
    buttonVisible = false;
    if (backButton) backButton.hide();
  } else {
    song.play();
    musicStartTime = millis();
  }

  colorIndex = (colorIndex + 1) % colors.length;
  currentColor = color(colors[colorIndex]);
}

function getPoint(index) {
  return createVector(positions[index][0], positions[index][1]);
}

function drawEye(eye, irisColor) {
  noFill();
  stroke(255);
  strokeWeight(1.5);
  drawEyeOutline(eye);

  const irisRadius = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
  const irisSize = irisRadius * 2;
  noStroke();
  fill(irisColor);
  ellipse(eye.center.x, eye.center.y, irisSize, irisSize);

  const pupilSize = irisSize / 3;
  fill(0, 150);
  ellipse(eye.center.x, eye.center.y, pupilSize, pupilSize);
}

function drawEyeOutline(eye) {
  beginShape();
  const firstPoint = eye.outline[0];
  eye.outline.forEach((p, i) => {
    curveVertex(p.x, p.y);
    if (i === 0 || i === eye.outline.length - 1) {
      curveVertex(firstPoint.x, firstPoint.y);
    }
  });
  endShape(CLOSE);
}

class PulseRing {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.alpha = 200;
    this.weight = random(1, 4);
  }

  update() {
    this.size += random(3, 6);
    this.alpha -= 4;
  }

  display() {
    stroke(currentColor.levels[0], currentColor.levels[1], currentColor.levels[2], this.alpha);
    strokeWeight(this.weight);
    noFill();
    ellipse(this.x, this.y, this.size);
  }
}

function createBackButton() {
  backButton = createA('./index.html', '[GO]');
  backButton.position(width - 150, height - 50);
  backButton.style('color', 'black');
  backButton.style('font-size', '16px');
  backButton.style('font-family', 'Verdana');
  backButton.style('text-decoration', 'none');
  backButton.style('background', 'none');
  backButton.style('border', 'none');
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
  background(0);
  if (backButton && buttonVisible) {
    backButton.position(width - 150, height - 50);
  }
}