var width = 1000;
var height = 800;
var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

Math.degreesToRadians = function(deg) {
	return deg / 180 * Math.PI;
};


var Ball = {
	init: function(x,y) {
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.radius = 2;
		this.color = '#000000';
	},
	update: function() {
		this.x += this.vx;
		this.y += this.vy;
		this.vy += 0.15;
	},
	draw: function() {
		ctx.style = '#000';
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
		ctx.closePath();
		ctx.fill();
	},
};

var Tank = {
	init: function(x,y) {
		this.x = x;
		this.y = y;
		this.barrelAngle = Math.degreesToRadians(45);
		this.fireSpeed = document.getElementById("powerInput").value;
		this.color = '#000';
		this.size = 20;
	},
	draw: function() {
		ctx.style = this.color;
		ctx.fillStyle = this.color;
		
		// body
		var width = this.size;
		var height = this.size/2;
		ctx.fillRect(this.x-width/2, this.y, width, height);
		
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.size/3,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
		
		// barrel
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		var x = this.x + this.size*Math.cos(this.barrelAngle);
		var y = this.y - this.size*Math.sin(this.barrelAngle);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();
	},
	fire: function() {
		var ball = Game.addBall(this.x, this.y);
		this.fireSpeed = document.getElementById("powerInput").value;
		ball.vx = this.fireSpeed*Math.cos(this.barrelAngle);
		ball.vy = this.fireSpeed*-Math.sin(this.barrelAngle);
	},
	moveBarrelDown: function() {
		this.barrelAngle -= Math.degreesToRadians(1);
	},
	moveBarrelUp: function() {
		this.barrelAngle += Math.degreesToRadians(1);
	},
	moveLeft: function() {
		this.x -= 1;
	},
	moveRight: function() {
		this.x += 1;
	},
};

var Input = {
	init: function(canvas) {
		this.mouseX = 0;
		this.mouseY = 0;
		this.canvas = canvas;
		
		canvas.onmousemove = function(e) {
			this.mouseX = e.x;
			this.mouseY = e.y;
		};
		canvas.onmousedown = function(e) {
			Game.tank.fire();
		};
		document.addEventListener('keydown', function(e) {
			var upArrow = 38;
			var downArrow = 40;
			var leftArrow = 37;
			var rightArrow = 39;
			var space = 32;
			
			console.log('keydown');
			console.log(e);
			
			if (e.keyCode == upArrow) {
				Game.tank.moveBarrelUp();
			}
			
			if (e.keyCode == downArrow) {
				Game.tank.moveBarrelDown();
			}
			
			if (e.keyCode == space) {
				Game.tank.fire();
			}
			
			if (e.keyCode == leftArrow) {
				Game.tank.moveLeft();
			}
			
			if (e.keyCode == rightArrow) {
				Game.tank.moveRight();
			}
		}, false);
	},
};

var Game = {
	balls: [],
	tank: null,
	init: function() {
		Input.init(canvas);
		
		this.reset();
		this.setFrameRate(60);
		this.tank = Object.create(Tank);
		this.tank.init(50, 600);
		
		var powerInput = document.getElementById('powerInput');
		var powerText = document.getElementById('powerText');
		powerInput.addEventListener('change', function() {
			powerText.textContent = powerInput.value;
		});
		
		powerInput.setAttribute('max', 50);
		powerInput.setAttribute('min', 1);
		powerText.textContent = powerInput.value;
	},
	addBall: function(x,y) {
		var ball = Object.create(Ball);
		ball.init(x,y);
		this.balls = this.balls.concat(ball);
		return ball;
	},
	clear: function() {
		ctx.clearRect(0,0,width,height);
	},
	draw: function() {
		this.clear();
		
		this.drawBackground();
		
		for (var i = 0; i < this.balls.length; i++) {
			this.balls[i].draw();
		}
		this.tank.draw();
	},
	drawBackground: function(){
		// sky
		ctx.fillStyle = '#0AF';
		ctx.fillRect(0, 0, width, height);
		
		// ground
		ctx.fillStyle = '#3C3';
		ctx.fillRect(0, height*0.75, width, height);
	},
	fullUpdate: function(self) {
		self.update();
		self.draw();
	},
	reset: function() {
		this.balls = [];
		this.clear();
	},
	setFrameRate: function(fps) {
		clearInterval(this.updateInterval);
		
		var update = function(self) {
			return function() { self.fullUpdate(self); };
		}(this);
		
		this.updateInterval = setInterval(update, 1000/fps);
	},
	update: function(self) {
		for (var i = 0; i < this.balls.length; i++) {
			this.balls[i].update();
		}
	},
};

Game.init();