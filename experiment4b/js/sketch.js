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

const waves = [];

const wavePropagationSpeed = 0.025;

const dissipationRate = 0.001;

const maxWaveDistance = 1000;

const maxWaveDuration = 6 * 1000;

const waveInterval = 2000; // Generate a new wave every 2 seconds

function p3_preload() {}

function p3_setup() {
  // Start generating new waves at regular intervals
  setInterval(generateNewWave, waveInterval);
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  waves.splice(0, waves.length);
}

function p3_tileWidth() {
  return 16;
}

function p3_tileHeight() {
  return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_drawBefore() {
  background(0);
}

function p3_tileClicked(i, j) {}

function p3_drawTile(i, j, offsetX, offsetY) {
  // Calculate the wave effect for each tile
  let waveEffect = 0;

  if (waves.length > 0) {
    for (const wave of waves) {
      const { position, startTime } = wave;
      const distance = dist(position.i, j, i, j);
      const timeWithPropogation = (millis() - startTime) * wavePropagationSpeed;
      const timeElapsed = millis() - startTime;

      // Gradually increase the wave effect over time and within the maximum distance
      if (timeWithPropogation > distance && distance < maxWaveDistance) {
        const waveAmplitude = sinAt(distance - timeWithPropogation) * 7; // Calculate the wave amplitude
        waveEffect += waveAmplitude;
      }

      // Remove waves that have exceeded the maximum duration
      if (timeElapsed > maxWaveDuration) {
        const index = waves.indexOf(wave);
        if (index !== -1) {
          waves.splice(index, 1);
        }
        continue; // Skip further processing for this wave
      }

      // Gradually dissipate the wave effect over time for each wave individually
      waveEffect *= exp(-dissipationRate * (millis() - startTime));
    }
  }

  // Render the tile
  noStroke();
  const blueShade = 100 + (XXH.h32("tile:" + [i, j], worldSeed) % 100); // Generate a blue shade between 100 and 200
  fill(0, 0, blueShade);

  push();
  translate(0, waveEffect); // Apply the displacement
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();
}

function p3_drawSelectedTile(i, j) {}

function p3_drawAfter() {}

function sinAt(x, freq = 0.3, scale = 4) {
  return Math.sin((x * freq) % (2 * Math.PI)) * scale;
}

function generateNewWave() {
  const startPosition = { i: random(0, width/th), j: floor(random(0, height / th)) };
  const clickTime = millis();

  waves.push({ position: startPosition, startTime: clickTime });
}