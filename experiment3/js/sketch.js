// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

let seed2 = 0;
let tilesetImage2;
let currentGrid2 = [];
let numRows2, numCols2;

var myp5 = new p5((d) => {
  d.preload = () => {
    tilesetImage = d.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }
  
  function reseed() {
    seed = (seed | 0) + 1109;
    d.randomSeed(seed);
    d.noiseSeed(seed);
    d.select("#seedReport").html("seed " + seed);
    regenerateGrid();
  }
  
  function regenerateGrid() {
    d.select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
    reparseGrid();
  }
  
  function reparseGrid() {
    currentGrid = stringToGrid(d.select("#asciiBox").value());
  }
  
  function gridToString(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }
  
  function stringToGrid(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }
  
  d.setup = () => {
    numCols = d.select("#asciiBox").attribute("rows") | 0;
    numRows = d.select("#asciiBox").attribute("cols") | 0;
  
    d.createCanvas(16 * numCols, 16 * numRows).parent("canvas-container1");
    d.select('canvas').elt.getContext("2d").imageSmoothingEnabled = false;
  
    d.select("#reseedButton").mousePressed(reseed);
    d.select("#asciiBox").input(reparseGrid);
  
    reseed();
    };

    d.draw = () => {
      d.randomSeed(seed);
      drawGrid(currentGrid);
    }
  
  function placeTile(i, j, ti, tj) {
    d.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }
  
  function gridCheck(gridData, xPos, yPos, targetVal) {
    return (
      xPos < gridData[0].length &&
      xPos >= 0 &&
      yPos < gridData.length &&
      yPos >= 0 &&
      gridData[yPos][xPos] == targetVal
    );
  }
  
  function gridCode(gridData, xPos, yPos, targetVal) {
    return (
      (gridCheck(gridData, xPos, yPos - 1, targetVal) << 3) +
      (gridCheck(gridData, xPos + 1, yPos, targetVal) << 2) +
      (gridCheck(gridData, xPos, yPos + 1, targetVal) << 1) +
      (gridCheck(gridData, xPos - 1, yPos, targetVal) << 0)
    );
  }
  
  function drawContext(gridData, xPos, yPos, targetVal, xTileOffset, yTileOffset) {
    const neighborState = gridCode(gridData, xPos, yPos, targetVal);
    const [xOffset, yOffset] = lookupTable[neighborState];
    placeTile(xPos, yPos, xTileOffset + xOffset, yTileOffset + yOffset);
  }
  
  function generateGrid(numCols, numRows) {
    const noiseStrength = 1;
    const noiseScale = 10;
    const gridData = [];
    const roomCenters = [];
  
    for (let yPos = 0; yPos < numRows; yPos++) {
      const rowData = [];
      for (let xPos = 0; xPos < numCols; xPos++) {
        rowData.push("r"); // Rock
      }
      gridData.push(rowData);
    }
  
    for (let yPos = 0; yPos < numRows; yPos++) {
      for (let xPos = 0; xPos < numCols; xPos++) {
        if (d.noise(yPos * noiseStrength, xPos * noiseStrength) * noiseScale > 8) {
          roomCenters.push([yPos, xPos]);
        }
      }
    }
  
    let prevRoom = undefined;
    while (roomCenters.length > 0) {
      const currRoom = roomCenters.pop();
      const roomWidth = d.floor(d.random(4, 10));
      const roomHeight = d.floor(d.random(4, 8));
      const startX = currRoom[1] - d.floor(roomWidth / 2);
      const startY = currRoom[0] - d.floor(roomHeight / 2);
  
      for (let yPos = startY; yPos < startY + roomHeight; yPos++) {
        for (let xPos = startX; xPos < startX + roomWidth; xPos++) {
          if (gridCheck(gridData, xPos, yPos, "r")) {
            gridData[yPos][xPos] = "2";
          }
        }
      }
  
      if (prevRoom !== undefined) {
        const hallWidth = d.abs(currRoom[1] - prevRoom[1]);
        const hallHeight = d.abs(currRoom[0] - prevRoom[0]);
  
        for (let shiftAmount = 0; shiftAmount < hallWidth; shiftAmount++) {
          if (currRoom[1] < prevRoom[1]) {
            if (gridCheck(gridData, currRoom[1] + shiftAmount, currRoom[0], "r")) {
              gridData[currRoom[0]][currRoom[1] + shiftAmount] = "3";
            }
          } else {
            if (gridCheck(gridData, currRoom[1] - shiftAmount, currRoom[0], "r")) {
              gridData[currRoom[0]][currRoom[1] - shiftAmount] = "3";
            }
          }
        }
  
        for (let shiftAmount = 0; shiftAmount < hallHeight; shiftAmount++) {
          if (currRoom[0] < prevRoom[0]) {
            if (gridCheck(gridData, prevRoom[1], currRoom[0] + shiftAmount, "r")) {
              gridData[currRoom[0] + shiftAmount][prevRoom[1]] = "3";
            }
          } else {
            if (gridCheck(gridData, prevRoom[1], currRoom[0] - shiftAmount, "r")) {
              gridData[currRoom[0] - shiftAmount][prevRoom[1]] = "3";
            }
          }
        }
      }
  
      prevRoom = currRoom;
    }
  
    let chestNotPlaced = true;
    while (chestNotPlaced) {
      const xPos = d.floor(d.random(0, numCols));
      const yPos = d.floor(d.random(0, numRows));
      if (gridCheck(gridData, xPos, yPos, "2") && gridCode(gridData, xPos, yPos, "2") == 15) {
        gridData[yPos][xPos] = "9";
        chestNotPlaced = false;
      }
    }
  
    return gridData;
  }
  
  function drawGrid(gridData, lifeVal) {
    d.background(128);
  
    for (let yPos = 0; yPos < gridData.length; yPos++) {
      for (let xPos = 0; xPos < gridData[yPos].length; xPos++) {
        if (gridData[yPos][xPos] == "r") {
          placeTile(xPos, yPos, (d.millis() / 500) % 3, 18); // Animated rock
        } else if (gridData[yPos][xPos] == "2") {
          placeTile(xPos, yPos, d.random(1, 3), 23);
          drawContext(gridData, xPos, yPos, "2", 14, 21);
        } else if (gridData[yPos][xPos] == "3") {
          placeTile(xPos, yPos, 22, 21);
        } else if (gridData[yPos][xPos] == "9") {
          placeTile(xPos, yPos, d.floor(d.random(1, 4)), d.random(21, 24));
          placeTile(xPos, yPos, 4, 28);
        }
      }
    }
  }
  
  const lookupTable = [
    [0, 0], [2, 2], [2, 0], [0, 0], [1, 1], [1, 2], [1, 0], [1, 1],
    [3, 1], [3, 2], [3, 0], [3, 1], [2, 0], [2, 2], [2, 0], [2, 1]
  ];

}, 'p5sketch');


var myp5 = new p5((o) => {
  o.preload = () => {
    tilesetImage2 = o.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  function reseed2() {
    seed2 = (seed2 | 0) + 1109;
    o.randomSeed(seed2);
    o.noiseSeed(seed2);
    o.select("#seedReport").html("seed " + seed2);
    regenerateGrid2();
  }
  
  function regenerateGrid2() {
    o.select("#asciiBox2").value(gridToString2(generateGrid(numCols2, numRows2)));
    reparseGrid2();
  }
  
  function reparseGrid2() {
    currentGrid2 = stringToGrid2(o.select("#asciiBox2").value());
  }
  
  function gridToString2(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }
  
  function stringToGrid2(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }
  
  o.setup = () => {
    numCols2 = o.select("#asciiBox2").attribute("rows") | 0;
    numRows2 = o.select("#asciiBox2").attribute("cols") | 0;
  
    o.createCanvas(16 * numCols2, 16 * numRows2).parent("canvas-container2");
    o.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  
    o.select("#reseedButton2").mousePressed(reseed2);
    o.select("#asciiBox2").input(reparseGrid2);
  
    reseed2();
    };
  
    o.draw = () => {
      o.randomSeed(seed2);
      drawGrid(currentGrid2);
    }
  
  function placeTile2(i, j, ti, tj) {
    o.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }
  
  
  function generateGrid(numCols, numRows) {
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        // Generating a Perlin noise value for the cell
        let noiseValue = o.noise(i / 20, j / 20);
  
        // Using the Perlin noise value to select one of four codes
        let code;
        if (noiseValue < 0.3) {
          code = ".";
        } else if (noiseValue < 0.6) {
          code = "_";
        } else if (noiseValue < 0.8) {
          code = ":";
        } else {
          code = ";";
        }
  
        row.push(code);
      }
      grid.push(row);
    }
  
    return grid;
  }
  
  function drawGrid(grid) {
    o.background(128);
  
    // Adjusting parameters for variation
    const g = 10;
    const t = o.millis() / 1000.0;
  
    // Rendering tiles based on grid contents
    o.noStroke();
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid, i, j, ".")) {
          placeTile2(i, j, 0, 3);
        } else if (gridCheck(grid, i, j, ":")) {
          placeTile2(i, j, (4 * o.pow(o.noise(t / 10, i, j / 4 + t), 2)) | 0, 14);
          drawContext2(grid, i, j, ":", 9, 3, true);
        } else {
          placeTile2(i, j, (4 * o.pow(o.random(), g)) | 0, 0);
          drawContext2(grid, i, j, ".", 4, 0);
        }
      }
    }
  }
  
  function gridCheck(grid, i, j, target) {
    // Checking if location i,j is inside the grid (not out of bounds) and if grid[i][j] == target. Otherwise, return false.
    return (
      i >= 0 &&
      i < grid.length &&
      j >= 0 &&
      j < grid[i].length &&
      grid[i][j] == target
    );
  }
  
  function gridCode(grid, i, j, target) {
    // Calculating the 4-bit code based on neighboring cells
    return (
      (gridCheck(grid, i - 1, j, target) << 0) +
      (gridCheck(grid, i, j - 1, target) << 1) +
      (gridCheck(grid, i, j + 1, target) << 2) +
      (gridCheck(grid, i + 1, j, target) << 3)
    );
  }
  
  function drawContext2(grid, i, j, target, dti, dtj, invert = false) {
    // Getting the code for this location and target
    let code = gridCode(grid, i, j, target);
  
    // Inverting the code if specified
    if (invert) {
      code = 15 - code;
    }
  
    // Placing the appropriate tile based on the code
    let [tiOffset, tjOffset] = lookup[code];
    placeTile2(i, j, dti + tiOffset, dtj + tjOffset);
  }
  
  // Defining the tile offset pairs
  const lookup = [
    [1, 1],
    [1, 0],
    [0, 1],
    [0, 0],
    [2, 1], 
    [2, 0], 
    [1, 1],
    [1, 0],
    [1, 2], 
    [1, 1],
    [0, 2], 
    [0, 1],
    [2, 2], 
    [2, 1],
    [1, 2],
    [1, 1]
  ];

}, 'p5sketch');

/*
var myp5 = new p5((d) => {
  d.preload = () => {
    tilesetImage = d.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvas-container1");
  select('canvas').elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}


function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      // Generating a Perlin noise value for the cell
      let noiseValue = noise(i / 20, j / 20);

      // Using the Perlin noise value to select one of four codes
      let code;
      if (noiseValue < 0.3) {
        code = ".";
      } else if (noiseValue < 0.6) {
        code = "_";
      } else if (noiseValue < 0.8) {
        code = ":";
      } else {
        code = ";";
      }

      row.push(code);
    }
    grid.push(row);
  }

  return grid;
}

function drawGrid(grid) {
  background(128);

  // Adjusting parameters for variation
  const g = 10;
  const t = millis() / 1000.0;

  // Rendering tiles based on grid contents
  noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, 0, 3);
      } else if (gridCheck(grid, i, j, ":")) {
        placeTile(i, j, (4 * pow(noise(t / 10, i, j / 4 + t), 2)) | 0, 14);
        drawContext(grid, i, j, ":", 9, 3, true);
      } else {
        placeTile(i, j, (4 * pow(random(), g)) | 0, 0);
        drawContext(grid, i, j, ".", 4, 0);
      }
    }
  }
}

function gridCheck(grid, i, j, target) {
  // Checking if location i,j is inside the grid (not out of bounds) and if grid[i][j] == target. Otherwise, return false.
  return (
    i >= 0 &&
    i < grid.length &&
    j >= 0 &&
    j < grid[i].length &&
    grid[i][j] == target
  );
}

function gridCode(grid, i, j, target) {
  // Calculating the 4-bit code based on neighboring cells
  return (
    (gridCheck(grid, i - 1, j, target) << 0) +
    (gridCheck(grid, i, j - 1, target) << 1) +
    (gridCheck(grid, i, j + 1, target) << 2) +
    (gridCheck(grid, i + 1, j, target) << 3)
  );
}

function drawContext(grid, i, j, target, dti, dtj, invert = false) {
  // Getting the code for this location and target
  let code = gridCode(grid, i, j, target);

  // Inverting the code if specified
  if (invert) {
    code = 15 - code;
  }

  // Placing the appropriate tile based on the code
  let [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, dti + tiOffset, dtj + tjOffset);
}

// Defining the tile offset pairs
const lookup = [
  [1, 1],
  [1, 0],
  [0, 1],
  [0, 0],
  [2, 1], 
  [2, 0], 
  [1, 1],
  [1, 0],
  [1, 2], 
  [1, 1],
  [0, 2], 
  [0, 1],
  [2, 2], 
  [2, 1],
  [1, 2],
  [1, 1]
];
}, 'p5sketch');
*/

/*
/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */
/*

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function gridCheck(gridData, xPos, yPos, targetVal) {
  return (
    xPos < gridData[0].length &&
    xPos >= 0 &&
    yPos < gridData.length &&
    yPos >= 0 &&
    gridData[yPos][xPos] == targetVal
  );
}

function gridCode(gridData, xPos, yPos, targetVal) {
  return (
    (gridCheck(gridData, xPos, yPos - 1, targetVal) << 3) +
    (gridCheck(gridData, xPos + 1, yPos, targetVal) << 2) +
    (gridCheck(gridData, xPos, yPos + 1, targetVal) << 1) +
    (gridCheck(gridData, xPos - 1, yPos, targetVal) << 0)
  );
}

function drawContext(gridData, xPos, yPos, targetVal, xTileOffset, yTileOffset) {
  const neighborState = gridCode(gridData, xPos, yPos, targetVal);
  const [xOffset, yOffset] = lookupTable[neighborState];
  placeTile(xPos, yPos, xTileOffset + xOffset, yTileOffset + yOffset);
}

function generateGrid(numCols, numRows) {
  const noiseStrength = 1;
  const noiseScale = 10;
  const gridData = [];
  const roomCenters = [];

  for (let yPos = 0; yPos < numRows; yPos++) {
    const rowData = [];
    for (let xPos = 0; xPos < numCols; xPos++) {
      rowData.push("r"); // Rock
    }
    gridData.push(rowData);
  }

  for (let yPos = 0; yPos < numRows; yPos++) {
    for (let xPos = 0; xPos < numCols; xPos++) {
      if (noise(yPos * noiseStrength, xPos * noiseStrength) * noiseScale > 8) {
        roomCenters.push([yPos, xPos]);
      }
    }
  }

  let prevRoom = undefined;
  while (roomCenters.length > 0) {
    const currRoom = roomCenters.pop();
    const roomWidth = floor(random(4, 10));
    const roomHeight = floor(random(4, 8));
    const startX = currRoom[1] - floor(roomWidth / 2);
    const startY = currRoom[0] - floor(roomHeight / 2);

    for (let yPos = startY; yPos < startY + roomHeight; yPos++) {
      for (let xPos = startX; xPos < startX + roomWidth; xPos++) {
        if (gridCheck(gridData, xPos, yPos, "r")) {
          gridData[yPos][xPos] = "2";
        }
      }
    }

    if (prevRoom !== undefined) {
      const hallWidth = abs(currRoom[1] - prevRoom[1]);
      const hallHeight = abs(currRoom[0] - prevRoom[0]);

      for (let shiftAmount = 0; shiftAmount < hallWidth; shiftAmount++) {
        if (currRoom[1] < prevRoom[1]) {
          if (gridCheck(gridData, currRoom[1] + shiftAmount, currRoom[0], "r")) {
            gridData[currRoom[0]][currRoom[1] + shiftAmount] = "3";
          }
        } else {
          if (gridCheck(gridData, currRoom[1] - shiftAmount, currRoom[0], "r")) {
            gridData[currRoom[0]][currRoom[1] - shiftAmount] = "3";
          }
        }
      }

      for (let shiftAmount = 0; shiftAmount < hallHeight; shiftAmount++) {
        if (currRoom[0] < prevRoom[0]) {
          if (gridCheck(gridData, prevRoom[1], currRoom[0] + shiftAmount, "r")) {
            gridData[currRoom[0] + shiftAmount][prevRoom[1]] = "3";
          }
        } else {
          if (gridCheck(gridData, prevRoom[1], currRoom[0] - shiftAmount, "r")) {
            gridData[currRoom[0] - shiftAmount][prevRoom[1]] = "3";
          }
        }
      }
    }

    prevRoom = currRoom;
  }

  let chestNotPlaced = true;
  while (chestNotPlaced) {
    const xPos = floor(random(0, numCols));
    const yPos = floor(random(0, numRows));
    if (gridCheck(gridData, xPos, yPos, "2") && gridCode(gridData, xPos, yPos, "2") == 15) {
      gridData[yPos][xPos] = "9";
      chestNotPlaced = false;
    }
  }

  return gridData;
}

function drawGrid(gridData, lifeVal) {
  background(128);

  for (let yPos = 0; yPos < gridData.length; yPos++) {
    for (let xPos = 0; xPos < gridData[yPos].length; xPos++) {
      if (gridData[yPos][xPos] == "r") {
        placeTile(xPos, yPos, (millis() / 500) % 3, 18); // Animated rock
      } else if (gridData[yPos][xPos] == "2") {
        placeTile(xPos, yPos, random(1, 3), 23);
        drawContext(gridData, xPos, yPos, "2", 14, 21);
      } else if (gridData[yPos][xPos] == "3") {
        placeTile(xPos, yPos, 22, 21);
      } else if (gridData[yPos][xPos] == "9") {
        placeTile(xPos, yPos, floor(random(1, 4)), random(21, 24));
        placeTile(xPos, yPos, 4, 28);
      }
    }
  }
}

const lookupTable = [
  [0, 0], [2, 2], [2, 0], [0, 0], [1, 1], [1, 2], [1, 0], [1, 1],
  [3, 1], [3, 2], [3, 0], [3, 1], [2, 0], [2, 2], [2, 0], [2, 1]
];
*/