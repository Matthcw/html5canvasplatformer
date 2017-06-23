var canvas;
var canvasContext;

var playerX = 0;
var playerY = 0;
var playerSpeedY = 0;
var playerSpeedX = 0;
const PLAYER_RADIUS = 25;
const PLAYER_RADIUS_MARGIN = PLAYER_RADIUS + 5;
const PLAYER_SPEED = 4;
const PLAYER_JUMP = -10;

const GRAVITY = 0.4;

const BLOCK_H = 50;
const BLOCK_W = 50;
const BLOCK_PADDING = 2;
const BLOCK_COLS = 16;
const BLOCK_ROWS = 12;


var keyLeftPressed = false;
var keyUpPressed = false;
var keyRightPressed = false;
var keyDownPressed = false;


var levelArray = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1,
                  1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                  1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
                  1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1,
                  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var tightSqueeze = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1];

  var mousePos = {x:0,y:0};

  function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return{x:mouseX, y:mouseY};
  }
  function keySet(evt, setTo){
    if(evt.keyCode == 37){
      keyLeftPressed = setTo;
    }
    if(evt.keyCode == 38){
      keyUpPressed = setTo;
    }
    if(evt.keyCode == 39){
      keyRightPressed = setTo;
    }
    if(evt.keyCode == 40){
      keyDownPressed = setTo;
    }
  }
  function keyPressed(evt){
    keySet(evt, true);
  }
  function keyReleased(evt){
    keySet(evt, false);
  }
  window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    canvas.addEventListener('mousemove', function(evt){
      mousePos = calculateMousePos(evt);
      /*
      console.log(levelArray[69]);
      canvasContext.fillStyle = 'yellow';
      canvasContext.fillText(playerIsAtBlock(mousePos.x, mousePos.y), mousePos.x, mousePos.y);*/
    });

    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);

    //Gameloop
    var framesPerSecond = 30;
    setInterval(function(){
      moveAll();
      drawAll();
    }, 1000/framesPerSecond);
  }

  function drawAll(){
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    drawLevel();
    drawCircle(playerX, playerY, PLAYER_RADIUS, 'white');
  }

  function moveAll(){
    playerX += playerSpeedX;
    playerY += playerSpeedY;
    if(keyLeftPressed){
      if(playerIsAtBlock(playerX - PLAYER_RADIUS_MARGIN, playerY)){
        playerSpeedX = 0;
      } else {
        playerSpeedX = -PLAYER_SPEED;
      }
    }

    if(keyRightPressed){
      if(playerIsAtBlock(playerX + PLAYER_RADIUS_MARGIN, playerY)){
        playerSpeedX = 0;
      } else {
        playerSpeedX = PLAYER_SPEED;
      }
    }

    if(!keyLeftPressed && !keyRightPressed){
      playerSpeedX = 0;
    }

    if(playerIsAtBlock(playerX, playerY - PLAYER_RADIUS_MARGIN)){
      playerSpeedY = 0.2;
    }
    //Handle collision of ball, if there's no platform below it, it'll drop
    //How do we know whether there is a blue block at this coordinate? - TILES
    //playerY *=1.04;
    if(playerIsAtBlock(playerX, playerY + PLAYER_RADIUS_MARGIN)){
      if(keyUpPressed){
        playerSpeedY = PLAYER_JUMP;
      } else {
        playerSpeedY = 0;
      }
    } else {
      playerSpeedY += GRAVITY;
    }
  }

  function playerIsAtBlock(xPos, yPos){
    var currentCol = Math.floor(xPos / BLOCK_W);
    var currentRow = Math.floor(yPos / BLOCK_H);
    return levelArray[currentCol + currentRow * BLOCK_COLS] == 1;
  }

  function drawLevel(){
    var arrayIndex = 0;
    for(var eachRow=0; eachRow < BLOCK_ROWS; eachRow++){
      for(var eachCol=0; eachCol < BLOCK_COLS; eachCol++){
        //If there's a block in the grid here, then draw, otherwise don't
        if(levelArray[arrayIndex] == 1){
          drawRect(eachCol * BLOCK_H, eachRow * BLOCK_W, BLOCK_W-BLOCK_PADDING, BLOCK_H-BLOCK_PADDING, 'blue');
        }
        if(levelArray[arrayIndex] == 2){
          playerX = eachCol * BLOCK_H + PLAYER_RADIUS;
          playerY = eachRow * BLOCK_W + PLAYER_RADIUS;
          levelArray[arrayIndex] = 0;
        }
        //console.log(arrayIndex + " " + levelArray[arrayIndex]);
        arrayIndex++;
      }//End of loop through each row
    }//End of loop through each col
  }//End of drawLevel function

  function drawRect(xPos, yPos, width, height, colour){
    canvasContext.fillStyle = colour;
    canvasContext.fillRect(xPos, yPos, width, height);
  }

  function drawCircle(xPos, yPos, radius, colour){
    canvasContext.fillStyle = colour;
    canvasContext.beginPath();
    canvasContext.arc(xPos, yPos, radius, 0, Math.PI*2, true);
    canvasContext.fill();
  }
