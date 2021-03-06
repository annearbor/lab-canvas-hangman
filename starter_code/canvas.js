// NOTE: jQuery is available for you to use :-)

class HangmanCanvas {
  constructor(secretWord) {
    this.secretWord = secretWord;
    this.canvas = $("#hangman")[0];
    this.ctx = this.canvas.getContext("2d");
  }

  createBoard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 4;
  }

  drawLines() {
    let x = 410;
    let y = 600;
    let lineLength = 50;
    for (let i = 0; i < this.secretWord.length; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + lineLength, y);
      this.ctx.stroke();
      x += 60;
    }
  }

  writeCorrectLetter(index) {
    var letter = this.secretWord[index];
    this.ctx.font = "48px serif";
    this.ctx.fillStyle = "blue";
    this.ctx.fillText(letter, 415 + index * 60, 590);
    // y 600 + x, 600 + 2x etc
    console.log(
      "-- wrote letter " + this.secretWord[index] + " at index " + index + " --"
    );
  }

  writeWrongLetter(letter, errorsLeft) {
    this.ctx.font = "48px serif";
    this.ctx.fillStyle = "red";
    if (errorsLeft > 0 && errorsLeft < 10) {
      this.ctx.fillText(letter, 450, 150);
    }
    // how get the letter printed next to each other here?
    console.log("-- wrote letter " + letter + " as a wrong letter --");
  }

  drawTriangle() {
    // console.log(this)
    this.ctx.beginPath();
    this.ctx.moveTo(150, 550); //top
    this.ctx.lineTo(200, 600); //right bottom
    this.ctx.lineTo(100, 600); //left bottom
    this.ctx.lineTo(150, 550); //top
    this.ctx.stroke();
    return this;
  }

  drawPole() {
    // console.log('pole')
    this.ctx.beginPath();
    this.ctx.moveTo(150, 550);
    this.ctx.lineTo(150, 30);
    this.ctx.lineTo(350, 30);
    this.ctx.lineTo(350, 103);
    this.ctx.stroke();
    return this;
  }

  drawHead() {
    this.ctx.beginPath();
    var x = 350; // x coordinate
    var y = 150; // y coordinate
    var radius = 50; // Arc radius
    var startAngle = 0; // Starting point on circle
    var endAngle = Math.PI * 2; // End point on circle
    this.ctx.arc(x, y, radius, startAngle, endAngle, true);
    this.ctx.stroke();
    return this;
  }
  // 4.
  drawBody() {
    this.ctx.beginPath();
    this.ctx.moveTo(350, 200);
    this.ctx.lineTo(350, 400);
    this.ctx.stroke();
    return this;
  }
  // 5.
  drawArms() {
    this.ctx.beginPath();
    this.ctx.moveTo(350, 250);
    this.ctx.lineTo(305, 205);
    this.ctx.moveTo(350, 250);
    this.ctx.lineTo(390, 205);
    this.ctx.stroke();
    return this;
  }
  // 6.
  drawLegs() {
    this.ctx.beginPath();
    this.ctx.moveTo(350, 400);
    this.ctx.lineTo(310, 475);
    this.ctx.moveTo(350, 400);
    this.ctx.lineTo(390, 475);
    this.ctx.stroke();
    return this;
  }

  drawHangman() {
    this.drawTriangle()
      .drawPole()
      .drawHead()
      .drawBody()
      .drawArms()
      .drawLegs();
  }
}

// remember this is the same as $(document).ready(...)
$(function() {
  var gameStarted = false;
  var hangmanGame;

  $("#start-game-button").click(function() {
    hangmanGame = new HangmanGame();
    window.canvas = new HangmanCanvas(hangmanGame.secretWord);
    canvas.createBoard();
    canvas.drawLines();
    canvas.drawHangman();
    console.log("--- drawn the board ---");

    // hides the start image and button
    $("#start-game-button")
      .parent()
      .hide();
    $(".game-logo")
      .parent()
      .hide();

    gameStarted = true;
  });

  document.onkeydown = function(event) {
    if (!gameStarted) return; // don't do anything if game has not started yet.
    var codeOfKey = event.keyCode; // returns a number, i.e.: 69
    var keyPressed = event.key.toUpperCase();
    console.log("--- key pressed : " + keyPressed + " ---");

    // 1. check if pressed key is a letter at all -> if no, don't proceed
    if (hangmanGame.checkIfLetter(codeOfKey) === false) {
      return;
    }
    // 2. check if the pressed key was tried before already -> if yes, notify the user and don't proceed
    if (hangmanGame.checkClickedLetters(keyPressed) === false) {
      window.alert("Letter already used");
      return;
    }
    // 3. check if the pressed key is a letter of the secret word
    if (hangmanGame.secretWord.includes(keyPressed)) {
      // -> if yes, write the letter on the correct position on the canvas and add the POSITION as a correct position to the game
      hangmanGame.addCorrectLetter(hangmanGame.secretWord.indexOf(keyPressed));
      canvas.writeCorrectLetter(hangmanGame.secretWord.indexOf(keyPressed));
    }
    // -> if no, write the letter on the canvas and add as a wrong letter to the game
    // -> (note which parameters the respective methods receive)
    else {
      hangmanGame.addWrongLetter(keyPressed);
      canvas.writeWrongLetter(keyPressed, hangmanGame.errorsLeft);
      //how do i end the game /reload it?
    }
  };

  // -> (note which parameters the respective methods receive)
});
