let song;
let amplitude;
let fade = 0;
let fadeDirection = 1;
let currentSentence = 0;
let timer = 0;
let done = false;

let statements = [
  "Through an irreverent, critical, and feminist lens,",
  "This project dismantles the romanticised image of the DJ.",
  "It exposes how the title conceals gendered power dynamics.",
  "This platform documents and satirises that inequality.",
  "[START]"
];

function preload() {
  song = loadSound('./data/flickeringlight.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  
  if (!song.isPlaying()) {
    song.loop();
  }
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.6);
}

function draw() {
  background(0);

  let vol = amplitude.getLevel();
  let constrainedVol = constrain(vol * 10, 0, 5);
  let flickerColor = lerpColor(color(255, 105, 180), color(120), constrainedVol);

  if (!done) {
    fade += fadeDirection * 2;
    fade = constrain(fade, 0, 255);

    if (fade >= 255) {
      timer++;
      if (timer > 80) {
        fadeDirection = -1;
        timer = 0;
      }
    }

    if (fade <= 0 && fadeDirection === -1) {
      currentSentence++;
      if (currentSentence >= statements.length - 1) {
        done = true;
        currentSentence = statements.length - 1; 
        fade = 255;
      } else {
        fadeDirection = 1;
      }
    }
  }

  fill(flickerColor.levels[0], flickerColor.levels[1], flickerColor.levels[2], fade);
  textSize(currentSentence === statements.length - 1 ? 48 : 32);
  textAlign(CENTER, CENTER);
  drawingContext.shadowBlur = 24;
  drawingContext.shadowColor = color(255, 105, 180);
  text(statements[currentSentence], width / 2, height / 2);
}