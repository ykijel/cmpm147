"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {
} //do

function p3_setup() {
}

let worldSeed;
let brightnessAdjustments = []; // Array to store brightness adjustments for tiles

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);

  // Calculate brightness adjustments for all tiles based on the new seed
  brightnessAdjustments = [];
  for (let i = 0; i < width / tw; i++) {
    for (let j = 0; j < height / th; j++) {
      let randomBrightness = random(-20, 20); // Adjust brightness by random value between -20 and 20
      brightnessAdjustments.push(randomBrightness);

      // Spawn a piece on this tile with a 30% chance
      let spawnChance = random(1);
      if (spawnChance < 0.3) {
        let pieceTypes = ["pawn", "rook", "knight", "bishop", "queen", "king"];
        let randomPiece = random(pieceTypes);
        piecesSpawned[[i, j]] = randomPiece;
      }
    }
  }
}


function p3_tileWidth() {
  return 32;
} //do
function p3_tileHeight() {
  return 16;
} //do

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};
let tileclicks = {};

let tileColors = {}; // Store the color state of each tile

let pulseRadius = 1; // Adjust as needed for the desired pulse radius
let pulseSpeed = 200; // Adjust the speed of the pulsating effect

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1+ (clicks[key] || 0);

  // Randomly choose a color each time a tile is clicked
  let randomColor = color(random(255), random(255), random(255));
  tileColors[key] = randomColor;

  // Start the pulsating effect for the clicked tile
  pulsateTile(i, j, 0);
}

function pulsateTile(x, y, distance) {
  if (distance <= pulseRadius) {
    let key = [x, y];
    if (!tileColors[key]) {
      tileColors[key] = color(random(255), random(255), random(255));
    }
    let currentColor = tileColors[key];
    let targetColor = color(random(255), random(255), random(255));
    let timer = 0;

    let interval = setInterval(function () {
      if (timer < 255) {
        timer += pulseSpeed;
        let newColor = lerpColor(currentColor, targetColor, timer / 255);
        tileColors[key] = newColor;
        redraw();
      } else {
        clearInterval(interval);
        // Continue pulsating neighboring tiles recursively
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx !== 0 || dy !== 0) {
              pulsateTile(x + dx, y + dy, distance + 1);
            }
          }
        }
      }
    }, 10); // Adjust interval as needed for the desired speed
  }
}

function p3_drawBefore() {} //do

let piecesSpawned = {};

function p3_drawTile(i, j) {
  
  noStroke();
  


  // Determine tile color based on position
  let isDarkTile = (i + j) % 2 === 0;

  // Define primary color for tiles
  let baseColor = isDarkTile ? color(60, 40, 20) : color(255);

  // Variation: Adjust brightness of tiles dynamically
  let randomBrightness = brightnessAdjustments[i,j] // Adjust brightness by random value between -20 and 20
  let randomBrightness2 = brightnessAdjustments[i,-j]
  let tileColor = lerpColor(baseColor, color(255), randomBrightness / 100); // Interpolate between base color and white based on random brightness
  let tileColor2 = lerpColor(baseColor, color(255), randomBrightness2 / 100);
  
  // Set fill color
  fill(tileColor);
  fill(tileColor2);
  

  let key = [i, j];
  if (tileColors[key] !== undefined) {
    fill(tileColors[key]); // Use the color stored in tileColors if the tile has been clicked
  }

  push(); // Save the drawing state
  
  
  // Draw tile shape
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    let pieceType = piecesSpawned[[i, j]];
    if(!pieceType)
    {
      let pieceTypes = ["pawn", "rook", "knight", "bishop", "queen", "king"];
      let randomPiece = random(pieceTypes);
      pieceType = randomPiece;
      piecesSpawned[[i, j]] = pieceType;
    }
    fill(0,0,0,0); // Set the fill color of the piece based on the tile color
    ellipse(0, 0, 120, 120); // Increase size of the circle for the queen
    // Optionally, draw a queen symbol inside the circle
    fill(isDarkTile ? 255 : 0); // Set the fill color of the symbol opposite to the tile color
    textAlign(CENTER, CENTER);
    textSize(20); // Increase text size for the queen symbol
    drawChessPiece(pieceType, isDarkTile);

  }

  pop(); // Restore the drawing state
}

function drawChessPiece(pieceType) {
  switch (pieceType) {
  case "pawn":
    text("♟", 0, 0); // Pawn symbol
    break;
  case "rook":
    text("♜", 0, 0); // Rook symbol
    break;
  case "knight":
    text("♞", 0, 0); // Knight symbol
    break;
  case "bishop":
    text("♝", 0, 0); // Bishop symbol
    break;
  case "queen":
    text("♛", 0, 0); // Queen symbol
    break;
  case "king":
    text("♚", 0, 0); // King symbol
    break;
  }
}



function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
} //do

function p3_drawAfter() {} //do
