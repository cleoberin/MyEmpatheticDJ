let cx, cy;
let radiusMax = 300;
let radiusInc = 0.01;
let angleInc = 0.01;

let img;
let graphics;
let video;

let rotationAngle = 0;
let rotationSpeed = 0.01;

let takePhotoButton;
let secondButton;
let secondButtonVisible = false;

let playUrselfMusic;
let backgroundMusic;

function preload() {
  playUrselfMusic = loadSound('data/backgroundclub.mp3');
  backgroundMusic = loadSound('data/flickeringlight.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cx = width / 2;
  cy = height / 2;

  video = createCapture(VIDEO);
  video.size(1280, 720);
  video.hide();

  backgroundMusic.setVolume(0.3);
  backgroundMusic.loop();

  takePhotoButton = createButton("PlayUrself");
  takePhotoButton.position(500, 100);
  takePhotoButton.mousePressed(handleButtonClick);

  takePhotoButton.style('position', 'absolute');
  takePhotoButton.style('opacity', '0');
  takePhotoButton.style('transition', 'opacity 2s ease-in-out');
  takePhotoButton.style('padding', '12px 24px');
  takePhotoButton.style('background-color', 'transparent');
  takePhotoButton.style('border', '2px solid #39FF14');
  takePhotoButton.style('color', '#39FF14');
  takePhotoButton.style('font-size', '16px');
  takePhotoButton.style('border-radius', '8px');
  takePhotoButton.style('cursor', 'pointer');

  setTimeout(() => {
    takePhotoButton.style('opacity', '1');
  }, 100);
}

function draw() {
  background(0);

  if (graphics) {
    push();
    translate(width / 2, height / 2);
    rotate(rotationAngle);
    imageMode(CENTER);
    image(graphics, 0, 0);
    pop();

    rotationAngle += rotationSpeed;
  }

  if (secondButtonVisible && secondButton) {
    secondButton.position(cx + radiusMax + 30, cy);
  }
}

function handleButtonClick() {
  if (playUrselfMusic && !playUrselfMusic.isPlaying()) {
    playUrselfMusic.setVolume(1.0);
    playUrselfMusic.play();
  }

  setTimeout(() => {
    let popup = window.open("", "popupWindow", "width=400,height=300,left=100,top=200");
    popup.document.write(`
      <html>
        <head>
          <title>Spiral Mode Activated</title>
          <style>
            body {
              font-family: sans-serif;
              background: black;
              color: #39FF14;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            video {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          play yourself<br><br>don't let them play you.
        </body>
      </html>
    `);
  }, 4000); 

  captureAndDraw();

  
  setTimeout(() => {
    if (!secondButton) {
      secondButton = createButton("Another Move");
      secondButton.position(cx + radiusMax + 30, cy);
      secondButton.style('position', 'absolute');
      secondButton.style('opacity', '0');
      secondButton.style('transition', 'opacity 2s ease-in-out');
      secondButton.style('padding', '10px 20px');
      secondButton.style('background-color', 'transparent');
      secondButton.style('color', '#39FF14');
      secondButton.style('border', '2px solid #39FF14');
      secondButton.style('border-radius', '6px');
      secondButton.style('font-size', '14px');
      secondButton.style('cursor', 'pointer');

      secondButton.mousePressed(() => {
        alert("WARNING: THE NEXT PAGE IS REALLY ANNOYING");
        window.location.href = '/5_HappyDJ_SadDJ/index.html';
      });

      document.body.offsetHeight;
      secondButton.style('opacity', '1');
    }

    secondButtonVisible = true;
  }, 6000);
}

function captureAndDraw() {
  img = video.get();
  img.resize(width, 0);
  updateCanvas();
}

function updateCanvas() {
  if (!img) return;

  graphics = createGraphics(width, height);
  graphics.clear();

  graphics.fill(0);
  graphics.stroke('#39FF14');

  let angle = 0;
  for (let r = 0; r < radiusMax; r += radiusInc) {
    let x = cx + r * cos(angle);
    let y = cy + r * sin(angle);
    let pixelVal = img.get(int(x), int(y));
    let sw = map(brightness(pixelVal), 100, 0, 1, 5);

    graphics.strokeWeight(sw);
    graphics.ellipse(x, y, 3, 3);
    angle += angleInc;
  }
}
