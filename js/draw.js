
var mycanvas = document.getElementById('mycanvas');
var ctx = mycanvas.getContext('2d');
var snakeSize = 10;
var w = 350;
var h = 350;
var score = 0;
var snake;
var snakeSize = 10;
var food;
function isOnSnake(x,y){
  for (i in snake) {
    if(snake[i].x == x && snake[i].y == y)
      return true
  }
  return false
}
function dist(pos1, pos2){
  return Math.abs(pos1.x-pos2.x) + Math.abs(pos1.y-pos2.y)
}
function intToStr(i){
  i = parseInt(i)
  if(i == 0){
    return "right"
  }
  if(i == 1){
    return "up"
  }
  if(i == 2){
    return "left"
  }
  if(i == 3){
    return "down"
  }
  return "non"
}
var AI = function(){

  this.target = { x: -1, y: -1 }
  this.path = []
  this.nodes = []
  this.seenPoses = []
  this.trash = -1
  this.walk = 0
  this.isValid = function(x, y){
      if(x == 0 || x > w/10 -1 || y == 0 || y > h/10 - 1)
        return false
      for (i in this.ghostSnake) {
        if(this.ghostSnake[i].x == x && this.ghostSnake[i].y == y)
          return false
      }

      return true
  }

  this.calcDistAround = function(x, y, dir){
    nextPos = this.posAfterMove(x,y,dir)
    if(!this.isValid(nextPos.x, nextPos.y))
      return 1000
    return   dist({x:nextPos.x, y:nextPos.y}, this.target)
  }

  this.lookAround = function(x, y){
    dists = []
    for(var i = 0; i < 4; i++){



       nextPos = this.posAfterMove(x,y,i)
       if(this.isValid(nextPos.x,nextPos.y) && !this.nodeExists(nextPos.x, nextPos.y)){

         d = this.calcDistAround(x,y,i)
         dists.push(d)
         thePath = JSON.parse(JSON.stringify(this.path));
         thePath.push(i)
         node = {
           virg: true,
           x: nextPos.x,
           y: nextPos.y,
           history: thePath,
           price: d,
           move: i,
           walk: this.walk+1,
           snakeState: this.snakeNextState(this.ghostSnake, i)
         }
         this.nodes.push(node)

       }

    }
    this.walk++
    return [dists.indexOf(Math.min(...dists)), Math.min(...dists) ];
  }
  this.posAfterMove = function(x, y, move){
    if(move == 0){
        return {x:x+1, y:y}
    }
    if(move == 1){
        return {x:x, y:y-1}
    }
    if(move == 2){
        return {x:x-1, y:y}
    }
    if(move == 3){
        return {x:x ,y:y+1}
    }
  }

  this.snakeNextState = function(snks,dir){
    snk = JSON.parse(JSON.stringify(snks));

    var sx = snk[0].x;
    var sy = snk[0].y;

    if (dir == 0) {
      sx++; }
    else if (dir == 2) {
      sx--; }
    else if (dir == 1) {
      sy--;
    } else if(dir == 3) {
      sy++; }

      var tl = snk.pop(); //pops out the last cell
      tl.x = sx;
      tl.y = sy;
      snk.unshift(tl);
      return snk
  }

  this.minNode = function(){
    min = 1000
    index = -1
    for(i in this.nodes){

        if(this.nodes[i].price < min && this.nodes[i].virg){
          index = i
          min = this.nodes[i].price
          this.min = min
        }
    }
    return this.nodes[index]
  }
  this.nodeExists = function(x,y){
    for(i in this.nodes){
      if(this.nodes[i].x == x && this.nodes[i].y == y)
        return true
    }
    return false
  }
  this.generatePath = function(){
    /*
      0 - right
      1 - up
      2 - left
      3 - down
    */
    startPos = {x:snake[0].x, y:snake[0].y}
    this.ghostSnake = JSON.parse(JSON.stringify(snake));
    this.path = []
    this.nodes = []
    this.target = food
    this.walk = 0
    this.min = 900
    node = -1
    while(!(startPos.x == this.target.x && startPos.y == this.target.y) ){

      if(node != -1){
        node.virg = false
      }
      this.lookAround(startPos.x, startPos.y)
        node = this.minNode()

        this.path = node.history
        startPos.x = node.x
        startPos.y = node.y
        this.ghostSnake = node.snakeState
        this.walk = node.walk

    }
    return this.path

  }


  this.move = function(){

      p= this.path[0]
     move = this.path.shift()
     return p
  }
}








ai = new AI()

var drawModule = (function () {
  var bodySnake = function(x, y) {
        ctx.fillStyle = 'green';
        ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
  }

  var pizza = function(x, y) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
        ctx.fillStyle = 'red';
        ctx.fillRect(x*snakeSize+1, y*snakeSize+1, snakeSize-2, snakeSize-2);
  }

  var scoreText = function() {
    var score_text = "Score: " + score;
    ctx.fillStyle = 'blue';
    ctx.fillText(score_text, 145, h-5);
  }

  var drawSnake = function() {
      var length = 4;
      snake = [];
      for (var i = length-1; i>=0; i--) {
          snake.push({x:i, y:0});
      }
  }

  var drawSeens = function(seens) {

      for (var i = seens.length-1; i>=0; i--) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(seens[i][1][0]*snakeSize, seens[i][1][1]*snakeSize, snakeSize, snakeSize);

      }
  }

  var paint = function(){
      ctx.fillStyle = 'lightgrey';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(0, 0, w, h);

      btn.setAttribute('disabled', true);

      var snakeX = snake[0].x;
      var snakeY = snake[0].y;

      if (direction == 'right') {
        snakeX++; }
      else if (direction == 'left') {
        snakeX--; }
      else if (direction == 'up') {
        snakeY--;
      } else if(direction == 'down') {
        snakeY++; }

      if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision(snakeX, snakeY, snake)) {
          //restart game
          console.log(snakeX,snakeY)
          console.log(direction)
          console.log(ai.path)
          console.log("fhauhlkshglaıshflıshgal")
          btn.removeAttribute('disabled', true);

          ctx.clearRect(0,0,w,h);
          gameloop = clearInterval(gameloop);
          return;
        }
        scored = false
        if(snakeX == food.x && snakeY == food.y) {
          scored = true
          var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
          score ++;

           //Create new food

        } else {
          var tail = snake.pop(); //pops out the last cell
          tail.x = snakeX;
          tail.y = snakeY;
        }

        //The snake can now eat the food.
        snake.unshift(tail); //puts back the tail as the first cell
        if(scored){
          createFood();
          ai.generatePath()
        }
        if(ai.min > 1000)
          ai.generatePath()

        for(var i = 0; i < snake.length; i++) {
          bodySnake(snake[i].x, snake[i].y);
        }

        pizza(food.x, food.y);
        scoreText();
        direction = intToStr(ai.move())
  }

  var createFood = function() {
      food = {
        x: Math.floor((Math.random() * 30) + 2),
        y: Math.floor((Math.random() * 30) + 2)
      }

      while(isOnSnake(food.x,food.y)){
        food.x = Math.floor((Math.random() * 30) + 2);
        food.y = Math.floor((Math.random() * 30) + 2);
      }

  }

  var checkCollision = function(x, y, array) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].x === x && array[i].y === y){
          return true;
        }
      }
      return false;
  }

  var init = function(){
      direction = 'down';
      drawSnake();
      createFood();
      ai.generatePath()
      gameloop = setInterval(paint, 10);
  }


    return {
      init : init
    };


}());
