// Constants - User-servicable parts
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let numMountains = 30; // Number of mountains
let minMountainHeight = 50; // Minimum height of mountains
let maxMountainHeight = 130; // Maximum height of mountains
let numTrees = 25; // Number of trees
let minTreeSize = 10; // Minimum size of trees
let maxTreeSize = 25; // Maximum size of trees
let cloudX = 0; // Initialize cloud position on x-axis
let cloudY = 50; // Initialize cloud position on y-axis
let numClouds = 5; // Number of clouds

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  background(173, 216, 230); // Light blue background representing the sky on a sunny day

  let forestCurveAmount = 30;
  let forestCurve = forestCurveAmount;

  let waterCurveAmount = 20;
  let waterCurve = waterCurveAmount;

  let waterLineY = 3 * height / 4.5;
  let forestLineY = waterLineY - height / 7;
  let grasslandLineY = forestLineY - height / 20;
  let mountainLineY = grasslandLineY - 50;

  beginShape();
  for (let x = 0; x < width; x += 10) {
    let y = forestLineY + map(noise(x * 0.005, frameCount * 0.005), 0, 1, -forestCurve, forestCurve);
    vertex(x, y);
  }
  endShape();

  beginShape();
  for (let x = 0; x < width; x += 10) {
    let y = grasslandLineY + map(noise(x * 0.005, frameCount * 0.005), 0, 1, -forestCurve, forestCurve);
    vertex(x, y);
  }
  endShape();

  fill(255);
  noStroke();
  for (let i = 0; i < numMountains; i++) {
    let x = random(width);
    let y = random(mountainLineY - maxMountainHeight, mountainLineY - minMountainHeight);
    triangle(x, mountainLineY, x + 50, y, x + 100, mountainLineY);
  }

  fill(0, 255, 0);
  noStroke();
  beginShape();
  vertex(0, forestLineY-70);
  vertex(0, waterLineY);
  for (let x = 0; x < width; x += 10) {
    let y = waterLineY + map(noise(x * 0.005, frameCount * 0.005), 0, 1, -waterCurve, waterCurve);
    vertex(x, y);
  }
  vertex(width, forestLineY-70);
  endShape(CLOSE);

  fill(0, 100, 0);
  noStroke();
  beginShape();
  vertex(0, grasslandLineY-50);
  vertex(0, forestLineY);
  for (let x = 0; x < width; x += 10) {
    let y = forestLineY + map(noise(x * 0.005, frameCount * 0.005), 0, 1, -forestCurve, forestCurve);
    vertex(x, y);
  }
  vertex(width, grasslandLineY-50);
  endShape(CLOSE);

  fill(0, 100, 0); // Dark green color for trees
  noStroke();
  for (let i = 0; i < numTrees; i++) {
    let x = random(width);
    let y = random(waterLineY - 50, forestLineY);
    let size = random(minTreeSize, maxTreeSize);
    triangle(x, y, x - size / 2, y + size, x + size / 2, y + size);
  }
}

function draw() {
  // Clear only the region where the clouds are moving
  let cloudRegionHeight = 100; // Height of the region where clouds are moving
  let cloudRegionY = 0; // Y-coordinate of the top of the cloud region
  let cloudRegionWidth = width; // Width of the cloud region
  let cloudRegionX = 0; // X-coordinate of the left side of the cloud region
  fill(173, 216, 230); // Light blue color for the sky
  noStroke();
  
  rect(cloudRegionX, cloudRegionY, cloudRegionWidth, cloudRegionHeight);

  fill(255, 255, 0); // Bright yellow color for the sun
  noStroke();
  ellipse(width / 1.5, height / 12, 80, 80); // Draw the sun at the top of the screen
  // Draw the clouds
  for (let i = 0; i < numClouds; i++) {
    drawCloud(cloudX + i * 300, cloudY); // Call function to draw a cloud at the specified position
  }
  cloudX += 1.5; // Move the cloud to the right
  if (cloudX > width) {
    cloudX = -1300; // Reset the cloud position when it goes off-screen
  }
}

function drawCloud(x, y) {
  fill(255); // White color for clouds
  noStroke();
  ellipse(x, y, 80, 60); // Draw a cloud
  ellipse(x + 20, y + 10, 60, 40); // Draw another cloud shape
}

function mousePressed() {
    // code to run when mouse is pressed
}