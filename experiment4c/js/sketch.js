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
 
function p3_preload() {}

function p3_setup() {}

let worldSeed; // Variable to store the seed for the world

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0); // Generate a seed based on the provided key
  noiseSeed(worldSeed); // Set the noise seed based on the world seed
  randomSeed(worldSeed); // Set the random seed based on the world seed
}

function p3_tileWidth() {
  return 32; // Width of each tile
}

function p3_tileHeight() {
  return 16; // Height of each tile
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()]; // Store tile width and height

let clicks = {}; // Object to store click counts for each tile

let darkTiles = {}

function p3_removeDark(i, j) {
  let key = [i, j]; // Create a key for the tile based on its coordinates
  clicks[key] = 1 + (clicks[key] | 0); // Increment the click count for the tile
  
  // Set dark tile to start lerpColor if it hasn't already been set
  darkTiles[[i, j]] = darkTiles[[i, j]] === undefined ? 255 : darkTiles[[i, j]];
  darkTiles[[i+1, j]] = darkTiles[[i+1, j]] === undefined ? 255 : darkTiles[[i+1, j]];
  darkTiles[[i-1, j]] = darkTiles[[i-1, j]] === undefined ? 255 : darkTiles[[i-1, j]];
  darkTiles[[i, j+1]] = darkTiles[[i, j+1]] === undefined ? 255 : darkTiles[[i, j+1]];
  darkTiles[[i, j-1]] = darkTiles[[i, j-1]] === undefined ? 255 : darkTiles[[i, j-1]];
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  let key = [i, j];
  let yOffset = 0;
  
  noStroke();
  // Use the noise function to determine the biome (grass or water)
  let biome = noise(i * 0.1, j * 0.1) > 0.5 ? "grass" : "water";

  if (biome === "grass") {
    fill(120, 200, 80); // Green color for grass
    // Use a new noise layer to determine if this tile should be dark
    let darkNoise = noise(i * 0.05, j * 0.05);
    if (darkNoise > 0.675) { // Adjust this threshold as needed
      if (darkTiles[key] === undefined) {
        fill(0);
      }
      // Use lerpColor to fade the dark tile away
      else if (darkTiles[key] > 0) {
        darkTiles[key] = max(0, darkTiles[key] - 5);
        fill(lerpColor(color(0), color(120, 200, 80), darkTiles[key] / 255));
      }
      else {
        fill(120, 200, 80); // Green color for grass
      } 
    }
  } else {
    // Add bouncing effect to water tiles
    let waveColor = 15; 
    let waveHeightY = 3; 
    let time = millis() * 0.001; 
    
    // Calculate horizontal wave
    let wave = sin(time + (i * 0.1) + (j * 0.1)) * waveColor; 
    
    // Calculate vertical movement
    yOffset = cos(time * 2 + (i * 0.05) + (j * 0.05)) * waveHeightY;
    
    fill(80, 160 + wave, 200); 
  
  }

  push();
  beginShape();
  vertex(-tw, 0 + yOffset);
  vertex(0, th + yOffset);
  vertex(tw, 0 + yOffset);
  vertex(0, -th + yOffset);
  endShape(CLOSE);

  
  pop();
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
}

function p3_drawAfter() {}