let countdown = 5;
let flashState = false;
let lastFlashTime = 0;
let flashInterval = 75;

let lastCountdownTime = 0;
let countdownInterval = 1000;

let circleSize;
let initialCircleSize;

let audio;
let flashActive = true;
let flashStartTime;

let popup1Triggered = false;
let popup2Triggered = false;
let popup3Triggered = false;
let popup4Triggered = false;
let popups = [];

let spiralStarted = false;
let spiralAlpha = 0;
let circles = [];
let cols, rows;
let size = 10;
let r = size / 2;
let k = 20;

let showQuestionMarks = false;
let questionMarkStartTime = 0;

let totalStartTime;
let globalElapsed = 0;

function preload() {
  soundFormats('mp3');
  audio = loadSound('./data/clubclassics.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(64);
  initialCircleSize = min(width, height) * 0.5;
  circleSize = initialCircleSize;

  userStartAudio();
  audio.play();
  flashStartTime = millis();
  totalStartTime = millis();
}

function draw() {
  let currentTime = millis();
  let elapsed = currentTime - flashStartTime;
  globalElapsed = currentTime - totalStartTime;

  if (globalElapsed > 19000) {
    if (!spiralStarted) {
      initSpiral();
      spiralStarted = true;
    }

    if (spiralAlpha < 255) {
      spiralAlpha += 5;
    }

    background(0);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        fill('#FF00FF');
        noStroke();
        circles[i][j].display();
        circles[i][j].move(0.05);
      }
    }

    fill('#FF00FF');
    textSize(32);
    text("lets dance disc jockey", width / 2, height / 2);
    return;
  }

  
  if (elapsed > 7000) {
    flashActive = false;
    flashState = true;
  }

  if (flashActive && currentTime - lastFlashTime > flashInterval) {
    flashState = !flashState;
    lastFlashTime = currentTime;
  }

  
  let isDuringFlashing = globalElapsed < 7000;
  background(isDuringFlashing ? (flashState ? 255 : 0) : 0);

  
  if (countdown > 0) {
    if (currentTime - lastCountdownTime > countdownInterval) {
      lastCountdownTime = currentTime;
      countdown--;
      circleSize = map(countdown, 0, 5, initialCircleSize * 0.2, initialCircleSize);
    }

    noStroke();
    fill(255);
    ellipse(width / 2, height / 2, circleSize);

    fill(flashState ? 0 : 255);
    textSize(64);
    text(countdown, width / 2, height / 2);
  } else if (globalElapsed < 19000) {
    
    fill(255);
    textSize(32);
    text("lets dance disc jockey", width / 2, height / 2);
  }

  
  if (globalElapsed > 17000 && globalElapsed < 19000) {
    fill('#39FF14'); 
    textSize(128);
    text("???", width / 2, height / 4);
  }

  
  if (!popup1Triggered && globalElapsed > 9000) {
    popups.push(openPopup("okay so basically...", 100, 100));
    popup1Triggered = true;
  }
  if (!popup2Triggered && globalElapsed > 11000) {
    popups.push(openPopup("we've all met a dj who needed to be bought down a peg.", windowWidth - 500, 100));
    popup2Triggered = true;
  }
  if (!popup3Triggered && globalElapsed > 13000) {
    popups.push(openPopup("what ever happened to the empathetic dj?", 100, windowHeight - 400));
    popup3Triggered = true;
  }
  if (!popup4Triggered && globalElapsed > 15000) {
    popups.push(openPopup("<img src='https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHRjOWgzb3J4OGI4ejR6bzZ4bXJoeW9hZDRsNXE5cGw2dThwaXpzaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8gwgQZR82xB2o/giphy.gif' width='300' />", windowWidth - 500, windowHeight - 400));
    popup4Triggered = true;
  }

 
  if (globalElapsed > 17000 && !showQuestionMarks && popups.length > 0) {
    popups.forEach(p => {
      if (!p.closed) p.close();
    });
    popups = [];
    showQuestionMarks = true;
    questionMarkStartTime = millis();
  }
}


class Circle {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.originalX = x;
    this.originalY = y;
  }

  move(speed) {
    this.angle += speed;
    this.x = this.originalX + cos(this.angle) * 5;
    this.y = this.originalY + sin(this.angle) * 5;
  }

  display() {
    ellipse(this.x, this.y, r);
  }
}

function initSpiral() {
  cols = width / size;
  rows = height / size;
  for (let i = 0; i < cols; i++) {
    circles[i] = [];
    for (let j = 0; j < rows; j++) {
      let x = size / 2 + i * size;
      let y = size / 2 + j * size;
      let d = dist(x, y, width / 2, height / 2);
      let angle = d / k;
      circles[i][j] = new Circle(x, y, angle);
    }
  }
}

function openPopup(message, left, top) {
  let features = `width=400,height=300,left=${left},top=${top}`;
  let popup = window.open("", "", features);
  popup.document.write(`
    <html>
      <head>
        <title>Message</title>
        <style>
          body {
            background: black;
            color: lime;
            font-family: monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-size: 24px;
            text-align: center;
          }
        </style>
      </head>
      <body>${message}</body>
    </html>
  `);
  return popup;
}
