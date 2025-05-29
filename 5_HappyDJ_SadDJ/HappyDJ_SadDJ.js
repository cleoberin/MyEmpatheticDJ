let popupContents = [
  { text: "who hurt you?", audio: "audio1.mp4", gif: "data/gif1.gif" },
  { text: "a girl hating you is a hundred times better then her thinking you're a good guy", audio: "audio2.mp4", gif: "data/gif2.gif" },
  { text: "fellas, do not let a b**** diminish your confidence", audio: "audio4.mp3", gif: "data/gif3.gif" },
  { text: "you're just jealous that i am more successful than you", audio: "audio5.mp3", gif: "data/gif4.gif" },
  { text: "everyone must tell you all the time that your beautiful right? you must hear this always", audio: "audio6.mp3", gif: "data/gif5.gif" },
  { text: "i am a superhero", audio: "audio7.mp3", gif: "data/gif6.gif" },
  { text: "you're very clearly a smart lady, you're very beautiful, you have a nice voice as we've already discussed", audio: "audio8.mp3", gif: "data/gif7.gif" }
];

let img1, img2;
let imgX, imgY;
let invaded = false;
let audioElements = [];
let gifImages = [];
let visibleTexts = [];
let startTime;
let blackout = false;
let blackoutStart;
let flickerAudio;
let amplitude;
let annoyingClubMusic;  

function preload() {
  img1 = loadImage("data/DJHappy.png");
  img2 = loadImage("data/DJSad.png");

  for (let content of popupContents) {
    let audio = loadSound("data/" + content.audio);
    audio.setVolume(1);
    audioElements.push(audio);
    gifImages.push(loadImage(content.gif));
  }

  flickerAudio = loadSound("data/flickeringlight.mp3");

  annoyingClubMusic = loadSound("data/annoyingclub.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(20);
  imgX = width / 2;
  imgY = height / 2;

  amplitude = new p5.Amplitude();
  amplitude.setInput(flickerAudio);
  amplitude.smooth(0.3);

  annoyingClubMusic.setVolume(0.2);
  annoyingClubMusic.loop();
}

function draw() {
  if (blackout) {
    drawBlackoutSequence();
    return;
  }

  background('black');
  fill(57, 255, 20);
  text("annoy that annoyind dj. hover to tickle. ", width / 2, imgY - img1.height / 2 - 60);
  text("click to hear his trademark sermon.", width / 2, imgY + img1.height / 2 + 40);

  let offsetX = 5 * sin(frameCount * 0.1);
  let offsetY = 5 * cos(frameCount * 0.1);

  if (isMouseOver(imgX, imgY, img1)) {
    image(img2, imgX + offsetX, imgY + offsetY);
  } else {
    image(img1, imgX + offsetX, imgY + offsetY);
  }

  if (invaded) {
    drawTextBoxes();

    if (millis() - startTime > 17000) {
      stopAllAudio();


      if (annoyingClubMusic.isPlaying()) {
        annoyingClubMusic.stop();
      }

      blackout = true;
      blackoutStart = millis();
      flickerAudio.loop();
    }
  }
}

function drawBlackoutSequence() {
  background(0);

  let vol = amplitude.getLevel();
  let constrainedVol = constrain(vol * 10, 0, 5);
  let pink = color(255, 105, 180);
  let grey = color(50);
  let flickerColor = lerpColor(pink, grey, constrainedVol);

  textAlign(CENTER, CENTER);
  textSize(36);
  fill(flickerColor);
  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = pink;

  let elapsed = millis() - blackoutStart;

  if (elapsed > 2000) {
    text('are you feeding these bottomless pits of egotistical despair  ???', width / 2, height / 2 - 20);
  }

  if (elapsed > 5000) {
    text('stop dancing for them.', width / 2, height / 2 + 30);
  }

  if (elapsed > 7000) {
    text('they dont deserve your praise.', width / 2, height / 2 + 80);
  }

  if (elapsed > 12000) {
    flickerAudio.stop();
    window.location.href = '/4_Countdown/index.html';
  }
}

function mousePressed() {
  if (!invaded && isMouseOver(imgX, imgY, img1)) {
    triggerInvasion();
    invaded = true;
  } else {
    for (let i = visibleTexts.length - 1; i >= 0; i--) {
      let box = visibleTexts[i];
      let boxW = width * 0.6;
      let boxH = height * 0.6;
      let boxX = box.x - boxW / 2;
      let boxY = box.y - boxH / 2;
      let xBtnX = boxX + boxW - 30;
      let xBtnY = boxY + 5;

      if (mouseX > xBtnX && mouseX < xBtnX + 20 &&
          mouseY > xBtnY && mouseY < xBtnY + 20) {
        let audio = audioElements[box.index];
        if (audio.isPlaying()) audio.stop();
        visibleTexts.splice(i, 1);
      }
    }
  }
}

function isMouseOver(x, y, img) {
  return mouseX > x - img.width / 2 &&
         mouseX < x + img.width / 2 &&
         mouseY > y - img.height / 2 &&
         mouseY < y + img.height / 2;
}

function triggerInvasion() {
  startTime = millis();
  for (let i = 0; i < audioElements.length; i++) {
    let delay = i * 1200;
    setTimeout(() => {
      audioElements[i].loop();
      let x = random(width * 0.3, width * 0.7);
      let y = random(height * 0.3, height * 0.7);
      visibleTexts.push({ index: i, x, y });
    }, delay);
  }
}

function drawTextBoxes() {
  textAlign(LEFT, TOP);
  textSize(16);
  rectMode(CORNER);
  textFont("Arial");

  for (let box of visibleTexts) {
    let i = box.index;
    let content = popupContents[i];
    let gif = gifImages[i];

    let boxW = width * 0.6;
    let boxH = height * 0.6;
    let boxX = box.x - boxW / 2;
    let boxY = box.y - boxH / 2;

    stroke(0);
    strokeWeight(2);
    fill(0);
    rect(boxX, boxY, boxW, boxH);

    noStroke();
    fill('#39FF14');
    rect(boxX, boxY, boxW, 30);

    fill(0);
    textStyle(BOLD);
    text("AlphaExplorer", boxX + 10, boxY + 8);

    fill(255, 0, 0);
    rect(boxX + boxW - 30, boxY + 5, 20, 20);
    fill(255);
    text("X", boxX + boxW - 25, boxY + 8);

    textStyle(NORMAL);
    fill(255);
    let textPadding = 20;
    let textBoxW = boxW - textPadding * 2;
    let textBoxX = boxX + textPadding;
    let textBoxY = boxY + 40;
    text(content.text, textBoxX, textBoxY, textBoxW);

    if (gif) {
      let maxGifW = boxW - 40;
      let maxGifH = boxH / 3;
      let gifW = gif.width;
      let gifH = gif.height;
      let scale = min(1, maxGifW / gifW, maxGifH / gifH);
      let drawW = gifW * scale;
      let drawH = gifH * scale;
      let gifX = boxX + boxW / 2;
      let gifY = boxY + boxH - drawH / 2 - 20;
      imageMode(CENTER);
      image(gif, gifX, gifY, drawW, drawH);
    }
  }
}

function stopAllAudio() {
  for (let audio of audioElements) {
    if (audio.isPlaying()) {
      audio.stop();
    }
  }
}
