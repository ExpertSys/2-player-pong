$(document).ready(function(){
    $(".player1-btns, .player2-btns").fadeOut(5000);
});

var canvas = document.getElementsByTagName('canvas')[0];
var c = canvas.getContext('2d');
canvas.width = 700;
canvas.height = window.innerHeight;

var puck = new Puck();
var keyState = [];
var background = ["red","green","yellow","blue","purple", "cynan", "black", "grey", "beige", "white"];

var player1 = {
    positionY : 100,
    color: "#9e3853",
    controls: "top",
    score: 0
};

var player2 = {
    positionY : canvas.height-100,
    color: "rgba(84, 118, 179, 0.8)",
    controls: "bottom",
    score: 0
};

var topPaddle = new Paddle(player1.positionY, player1.color, player1.controls, player1.score);
var bottomPaddle = new Paddle(player2.positionY, player2.color, player2.controls, player2.score);

function Paddle(y, color, controls, score) {
    this.width = 120, this.height = 20, this.x = (canvas.width/2) - this.width/2, this.y = y, this.velX = 0,
    this.score = score,

    this.update = function() {
        this.velX *= .98;
        this.x += this.velX;
        this.draw();
        this.collision();
        this.steer();
    };

    this.draw = function() {
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height, 0, 2*Math.PI);
        c.strokeStyle = "#fff";
        c.stroke();
        c.fillStyle = color;
        c.fill();
    };

    this.collision = function() {
        //Right wall detection
        if (this.x+this.width >= canvas.width) {
            this.velX = -this.velX*1.05;
        }

        //Left wall detection
        if ( this.x <= 0) {
            this.velX = -this.velX+2.05;
        }
    };

    this.steer = function() {
        if (controls === "top") {
            if (keyState[97]) {
               this.velX -= .3;
            }

            if (keyState[99]) {
                this.velX += .3;
            }
        }

        else if (controls === "bottom"){
            if (keyState[81]) {
                this.velX -= .3;
            }

            if (keyState[69]) {
                this.velX += .3;
            }
        }
    };
}

function Puck(){
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 10;
    this.velX = 0;
    this.velY = 3;
    this.trailX = new Array(15);
    this.trailY = new Array(15);
    this.changeBG = new Array("red","green","yellow","blue","purple",
    "cynan", "black", "grey", "beige", "white");

    this.update = function(){
        this.x += this.velX;
        this.y += this.velY;
        this.draw();
        this.collision();
        this.trailX.push(this.x);
        this.trailY.push(this.y);
        this.trailX.splice(0,1);
        this.trailY.splice(0,1);
    };

    this.draw = function(){
        //Draw trail
        for (var x = 0; x < this.trailX.length; x++){
            c.beginPath();
            c.arc(this.trailX[x], this.trailY[x], this.radius, 0, 2*Math.PI);
            c.strokeStyle = "yellow";
            c.fillStyle = "rgba(51, 51, 51, 0.2)";
            c.fill();
            c.stroke();
        }

        //Draw current position
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        c.strokeStyle = "yellow";
        c.fillStyle = "rgba(51, 51, 51, 1)";
        c.fill();
        c.stroke();
    };

    this.collision = function(){
        //Hits bottom paddle
        if (this.y+this.radius >= bottomPaddle.y && this.y-this.radius <= bottomPaddle.y+bottomPaddle.height) {
            if(this.x+this.radius >= bottomPaddle.x && this.x-this.radius <= bottomPaddle.x+bottomPaddle.width) {
                this.velY = -this.velY;
                this.velX = (Math.random() * 10) - 5;
            }
        }
        //Hits top paddle
        else if (this.y+this.radius >= topPaddle.y && this.y-this.radius <= topPaddle.y+topPaddle.height) {
            if(this.x+this.radius >= topPaddle.x && this.x-this.radius <= topPaddle.x+topPaddle.width) {
                this.velY = -this.velY;
            }
        }
        //If ball hits wall right wall
        var arr = this.changeBG;
        var chooseRandom = Math.floor((Math.random() * arr.length));

        if (this.x+this.radius >= canvas.width) {
            this.velX = .80;
            this.velX = -this.velX - 5;
            document.getElementById("game").style.borderColor = arr[chooseRandom];
        }
        //If ball hits wall left wall
        else if (this.x+this.radius <= 0) {
            this.velX = -this.velX + .80;
            document.getElementById("game").style.borderColor = arr[chooseRandom];
        }

        //If green player scores
        if (this.y+this.radius >= canvas.height) {
            topPaddle.score++;
            document.getElementById("green-score").innerHTML= topPaddle.score;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.velX = 0;
        }

        else if (this.y+this.radius < canvas.height / 12) {
            bottomPaddle.score++;
            document.getElementById("red-score").innerHTML = bottomPaddle.score;
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.velX = 0;
        }
    };
}

function update() {
    //Clear the whole canvas: x, y, width, height
    c.clearRect(0, 0, canvas.width, canvas.height);

    puck.update();
    topPaddle.update();
    bottomPaddle.update();

    requestAnimationFrame(update);
}
requestAnimationFrame(update);


//Add to keyCodes
window.addEventListener("keydown", function (e) {
	keyState[e.keyCode || e.which] = true;
},true);

window.addEventListener("keyup", function (e) {
	keyState[e.keyCode || e.which] = false;
},false);
