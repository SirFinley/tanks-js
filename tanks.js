var width = 1000;
var height = 800;
var c = document.getElementById("canvas1");
var ctx = c.getContext("2d");

var colorPercent = 0;
var colorPercentInc = 0.01;
function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}


function Ball(x,y){
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.radius = 2;
	this.update = function(){
		this.x += this.vx;
		this.y += this.vy;
		this.vy += 0.15;
	};
	this.color = '#000000';
	this.draw = function() {
		ctx.style = '#000';
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
		ctx.closePath();
		ctx.fill();
	};
	this.onclick = function(){};
}

function Tank(x,y) {
	this.x = x;
	this.y = y;
	this.barrelAngle = degreesToRadians(45);
	this.fireSpeed = document.getElementById("powerInput").value;
	this.color = '#000'
	this.size = 20;
	
	this.draw = function() {
		ctx.style = this.color;
		ctx.fillStyle = this.color;
		
		var width = this.size;
		var height = this.size/2;
		ctx.fillRect(this.x-width/2, this.y, width, height);
		
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.size/3,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		var x = this.x + this.size*Math.cos(this.barrelAngle);
		var y = this.y - this.size*Math.sin(this.barrelAngle);
		ctx.lineTo(x, y);
		ctx.closePath();
		ctx.stroke();
	};
	this.fire = function() {
		var ball = addBall(this.x, this.y);
		this.fireSpeed = document.getElementById("powerInput").value;
		ball.vx = this.fireSpeed*Math.cos(this.barrelAngle);
		ball.vy = this.fireSpeed*-Math.sin(this.barrelAngle);
	};
	this.moveBarrelUp = function() {
		this.barrelAngle += degreesToRadians(1);
	};
	this.moveBarrelDown = function() {
		this.barrelAngle -= degreesToRadians(1);
	};
	this.moveLeft = function() {
		this.x -= 1;
	};
	this.moveRight = function() {
		this.x += 1;
	};
}

function degreesToRadians(deg) {
	return deg / 180 * Math.PI;
}

function clear(){
	ctx.clearRect(0,0,width,height);
}

var balls = [];
function addBall(x,y) {
	var p = new Ball(x,y);
	balls = balls.concat(p);
	return p;
}

var updater = {
	update: function(){
		for (var i = 0; i < balls.length; i++) {
			balls[i].update();
		}
	},	
	draw: function(){
		clear();
		clear();
		for (var i = 0; i < balls.length; i++) {
			balls[i].draw();
		}
		tank.draw();
	}
	
};

var updateInterval;
function setFrameRate(fps) {
	clearInterval(updateInterval);
	updateInterval = setInterval(function(){
		updater.update();
		updater.draw();
	}, 1000/fps);
}

c.onmousedown = function(e){
	console.log("x: " + e.x + "   y: " + e.y);
	tank.fire();
};

var mouseX = 0;
var mouseY = 0;
c.onmousemove = function(e){
	mouseX = e.x;
	mouseY = e.y;
	
	if (balls.length == 0) {
		return;
	}
	
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
		tank.moveBarrelUp();
	}
	
	if (e.keyCode == downArrow) {
		tank.moveBarrelDown();
	}
	
	if (e.keyCode == space) {
		tank.fire();
	}
	
	if (e.keyCode == leftArrow) {
		tank.moveLeft();
	}
	
	if (e.keyCode == rightArrow) {
		tank.moveRight();
	}
}, false);

function reset(){
	balls = [];
	clear();
}

var tank = null;
function init(){
	reset();
	setFrameRate(60);
	tank = new Tank(50, 600);
	
	var powerInput = document.getElementById('powerInput');
	var powerText = document.getElementById('powerText')
	powerInput.addEventListener('change', function(){
		powerText.textContent = powerInput.value;
	});
	
	powerInput.setAttribute('max', 50);
	powerInput.setAttribute('min', 1);
	powerText.textContent = powerInput.value;
}

init();