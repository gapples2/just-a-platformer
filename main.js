/*/
TODO 
- add grav low/high block (dunno if actually gonna do or not)
- add multi-jump block
- add wall jump block (need to generalize isTouching() further)
- add switch block

- grav section
- multi-jump section
- warp confusion section (AKA the "i'll take you along for a trip" section)
- wall jump section
- final section
/*/

var gameSpeed = 1;
var playerSize = 20;
var blockSize = 50;
const player = {
	spawnPoint: [1,6,0,6,400],
	levelCoord: [0,0],
	get currentLevel() {return worldMap[player.levelCoord[0]][player.levelCoord[1]]},
	x: 0,
	y: 0,
	xv: 0,
	yv: 0,
	g: 400,
	canJump: false,
	godMode: false,
};
const control = {
	up: false,
	down: false,
	left: false,
	right: false,
};
const worldMap = [
	[0,0,0,0,0,0],
	[0,0,0,0,0,1],
	[0,0,0,0,0,2],
	[0,0,0,5,4,3],
	[0,10,0,6,0,0],
	[9,8,4,7,0,0]
]
const levels = [
	[
		[1,1,1,1,1,1,1,1],
		[1,0,0,0,0,1,0,1],
		[1,0,0,1,0,1,0,1],
		[1,0,1,1,0,1,0,1],
		[1,0,0,1,0,1,0,1],
		[1,0,0,0,0,1,0,1],
		[1,1,1,1,1,1,[-1,0],1]
	],
	[
		[1,1,1,[-1,0],1],
		[1,0,0,0,1],
		[1,0,0,1,1],
		[1,0,1,1,1],
		[1,0,0,1,1],
		[1,0,0,0,1],
		[1,1,1,[-1,0],1]
	],
	[
		[0,0,1,[-1,0],1],
		[1,1,1,3,1],
		[1,0,0,0,1],
		[1,0,0,1,1],
		[1,0,0,2,1],
		[1,0,0,1,1],
		[1,0,0,0,1],
		[1,1,1,0,1],
		[0,0,1,[-1,0],1]
	],
	[
		[1,[-1,0],1,0],
		[1,0,1,1],
		[1,0,0,[-1,0]],
		[1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,1,1,1,1,1],
		[[-1,0],0,0,0,0,0,0,0,0,0,0,[-1,0]],
		[1,1,1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1],
		[[-1,0],0,0,0,0,5,1],
		[1,1,[-1,0],1,1,1,1]
	],
	[
		[0,0,1,[-1,0],1],
		[1,1,1,0,1],
		[1,0,0,0,1],
		[1,0,0,0,5],
		[1,0,0,0,1],
		[1,0,1,1,1],
		[1,[-1,0],1,0,0]
	],
	[
		[1,1,[-1,0],1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,0,1,1,1,1,1,1,3,1],
		[1,0,1,0,2,0,1,0,0,1],
		[1,0,1,0,0,0,0,0,0,1],
		[1,0,1,2,0,1,0,1,0,1],
		[1,0,1,0,0,0,0,0,0,1],
		[1,0,1,2,0,1,0,0,0,5],
		[1,0,1,0,0,0,0,0,0,1],
		[1,0,1,1,0,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,[-1,0]],
		[1,1,1,1,1,1,1,1,1,1]
	],
	[
		[1,1,[-1,0],1,1,2,1,1,1,1],
		[1,0,0,1,0,0,1,0,0,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,1,0,0,0,0,1],
		[1,0,0,0,0,0,5,0,0,1],
		[1,0,0,0,0,0,0,1,0,1],
		[1,1,1,1,0,0,0,0,0,5],
		[[-1,0],0,0,0,0,3,1,0,0,[-1,0]],
		[1,1,1,1,0,0,0,0,0,5],
		[1,0,0,0,0,0,0,1,0,1],
		[1,0,0,0,0,0,5,0,0,1],
		[1,0,0,0,1,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,1],
		[1,1,2,1,1,2,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1],
		[[-1,0],0,0,1,0,0,[-1,0,5,1]],
		[1,0,0,1,0,0,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1],
		[1,0,0,0,0,0,1],
		[1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,0,1,1,1,1,1],
		[1,0,0,0,0,0,0],
		[1,1,1,1,1,1,1]
	],
	[
		[1,1,1,1,1,1,1,1,1],
		[0,0,0,0,0,0,6,0,1],
		[0,0,0,0,0,0,6,0,1],
		[0,0,0,0,0,0,6,0,1],
		[1,1,1,1,1,1,1,[-1,0],1]
	]
]
const hasHitbox = [1,5];

document.addEventListener("keydown", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			control.up = true;
			break;
		case "ArrowDown":
		case "KeyS":
			control.down = true;
			break;
		case "ArrowLeft":
		case "KeyA":
			control.left = true;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = true;
			break;
	}
});

document.addEventListener("keyup", function(input){
	let key = input.code;
	switch(key) {
		case "ArrowUp":
		case "KeyW":
			control.up = false;
			break;
		case "ArrowDown":
		case "KeyS":
			control.down = false;
			break;
		case "ArrowLeft":
		case "KeyA":
			control.left = false;
			break;
		case "ArrowRight":
		case "KeyD":
			control.right = false;
			break;
	}
});

function getBlockType(x,y) {
	if (x < 0 || x >= levels[player.currentLevel].length || y < 0 || y >= levels[player.currentLevel][0].length) {
		if (levels[player.currentLevel][x-1] != undefined) {
			if (typeof(levels[player.currentLevel][x-1][y]) == "object") {
				if (levels[player.currentLevel][x-1][y][0] == -1) {
					return -2;
				}
			}
		}
		if (levels[player.currentLevel][x+1] != undefined) {
			if (typeof(levels[player.currentLevel][x+1][y]) == "object") {
				if (levels[player.currentLevel][x+1][y][0] == -1) {
					return -2;
				}
			}
		}
		if (levels[player.currentLevel][x] != undefined) {
			if (typeof(levels[player.currentLevel][x][y-1]) == "object") {
				if (levels[player.currentLevel][x][y-1][0] == -1) {
					return -2;
				}
			}
			if (typeof(levels[player.currentLevel][x][y+1]) == "object") {
				if (levels[player.currentLevel][x][y+1][0] == -1) {
					return -2;
				}
			}
		}
		return 1;
	}
	if (typeof(levels[player.currentLevel][x][y]) == "object") return levels[player.currentLevel][x][y][0];
	return levels[player.currentLevel][x][y];
}
function isTouching(dir, type) {
	let x1 = player.x;
	let x2 = player.x+playerSize;
	let y1 = player.y;
	let y2 = player.y+playerSize;
	let x1b = Math.floor(x1/blockSize);
	let x2b = Math.floor(x2/blockSize);
	let y1b = Math.floor(y1/blockSize);
	let y2b = Math.floor(y2/blockSize);
	switch (dir) {
		case "left":
			return (hasHitbox.includes(getBlockType(x1b,y1b)) && blockSize-(x1+blockSize)%blockSize < blockSize-(y1+blockSize)%blockSize) 
			|| (hasHitbox.includes(getBlockType(x1b,y2b)) && blockSize-(x1+blockSize)%blockSize < y2%blockSize);
			break;
		case "right":
			return (hasHitbox.includes(getBlockType(x2b,y1b)) && x2%blockSize < blockSize-(y1+blockSize)%blockSize) 
			|| (hasHitbox.includes(getBlockType(x2b,y2b)) && x2%blockSize < y2%blockSize);
			break;
		case "up":
			return ((hasHitbox.includes(getBlockType(x1b,y1b)) && blockSize-(x1+blockSize)%blockSize > blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x1b,y1b+1))) 
			|| (hasHitbox.includes(getBlockType(x2b,y1b)) && x2%blockSize > blockSize-(y1+blockSize)%blockSize && !hasHitbox.includes(getBlockType(x2b,y1b+1))))
			&& player.yv < 0;
			break;
		case "down":
			return ((hasHitbox.includes(getBlockType(x1b,y2b)) && blockSize-(x1+blockSize)%blockSize > y2%blockSize && !hasHitbox.includes(getBlockType(x1b,y2b-1))) 
			|| (hasHitbox.includes(getBlockType(x2b,y2b)) && x2%blockSize > y2%blockSize && !hasHitbox.includes(getBlockType(x2b,y2b-1))))
			&& player.yv > 0;
			break;
		case "any":
			x1 = player.x + 1;
			x2 = player.x+playerSize - 1;
			y1 = player.y + 1;
			y2 = player.y+playerSize - 1;
			x1b = Math.floor(x1/blockSize);
			x2b = Math.floor(x2/blockSize);
			y1b = Math.floor(y1/blockSize);
			y2b = Math.floor(y2/blockSize);
			return getBlockType(x1b,y1b) == type
			|| getBlockType(x2b,y1b) == type
			|| getBlockType(x1b,y2b) == type
			|| getBlockType(x2b,y2b) == type;
	}
}
function getCoord(type) {
	let x1 = player.x;
	let x2 = player.x+playerSize;
	let y1 = player.y;
	let y2 = player.y+playerSize;
	let x1b = Math.floor(x1/blockSize);
	let x2b = Math.floor(x2/blockSize);
	let y1b = Math.floor(y1/blockSize);
	let y2b = Math.floor(y2/blockSize);
	if (getBlockType(x1b,y1b) == type) {
		return [x1b,y1b];
	} else if (getBlockType(x2b,y1b) == type) {
		return [x2b,y1b];
	} else if (getBlockType(x1b,y2b) == type) {
		return [x1b,y2b];
	} else if (getBlockType(x2b,y2b) == type) {
		return [x2b,y2b];
	}
}
function respawn() {
	player.levelCoord = [player.spawnPoint[2],player.spawnPoint[3]];
	player.x = player.spawnPoint[0] * blockSize + (blockSize - playerSize)/2;
	player.y = player.spawnPoint[1] * blockSize + (blockSize - playerSize)/2;
	player.xv = 0;
	player.yv = 0;
	player.g = player.spawnPoint[4];
}

var lastFrame = 0;
function nextFrame(timeStamp) {
	// setup stuff
	let dt = timeStamp - lastFrame;
	lastFrame = timeStamp;
	if (dt < 100) {
		let xprev = player.x;
		let yprev = player.y;
		let lvlxprev = player.levelCoord[0];
		let lvlyprev = player.levelCoord[1];
		// position change based on velocity
		player.x += player.xv * dt / 500 * gameSpeed;
		player.y += player.yv * dt / 500 * gameSpeed;
		// velocity change
		player.xv *= 0.5;
		if (Math.abs(player.xv) < 5) player.xv = 0;
		player.yv += player.g * dt / 500 * gameSpeed;
		if (player.yv > player.g && player.g > 0) player.yv = player.g;
		if (player.yv < player.g && player.g < 0) player.yv = player.g;
		// collision detection
		let x1 = player.x;
		let x2 = player.x+playerSize;
		let y1 = player.y;
		let y2 = player.y+playerSize;
		let x1b = Math.floor(x1/blockSize);
		let x2b = Math.floor(x2/blockSize);
		let y1b = Math.floor(y1/blockSize);
		let y2b = Math.floor(y2/blockSize);
		// left wall
		if (isTouching("left")) {
			player.xv = 0;
			player.x = (x1b + 1) * blockSize;
		}
		// right wall
		if (isTouching("right")) {
			player.xv = 0;
			player.x = x2b * blockSize - playerSize;
		}
		// ceiling
		if (isTouching("up")) {
			player.yv = 0;
			if (((getBlockType(x2b,y1b) == 5 && getBlockType(x1b,y1b) == 5)
			   || ((getBlockType(x2b,y1b) == 5 || getBlockType(x1b,y1b) == 5)
			       && ((!hasHitbox.includes(getBlockType(x2b,y1b)) || hasHitbox.includes(getBlockType(x2b,y1b+1)))
				   || (!hasHitbox.includes(getBlockType(x1b,y1b)) || hasHitbox.includes(getBlockType(x1b,y1b+1))))))
			   && player.g < 0) player.yv = -Math.sign(player.g)*300;
			player.y = (y1b + 1) * blockSize;
			if (player.g < 0 && player.yv <= 0) player.canJump = true;
		} else if (player.g < 0 && !player.godMode) player.canJump = false;
		// floor
		if (isTouching("down")) {
			player.yv = 0;
			if (((getBlockType(x2b,y2b) == 5 && getBlockType(x1b,y2b) == 5)
			   || ((getBlockType(x2b,y2b) == 5 || getBlockType(x1b,y2b) == 5)
			       && ((!hasHitbox.includes(getBlockType(x2b,y2b)) || hasHitbox.includes(getBlockType(x2b,y2b-1))) 
				   || (!hasHitbox.includes(getBlockType(x1b,y2b)) || hasHitbox.includes(getBlockType(x1b,y2b-1))))))
			   && player.g > 0) player.yv = -Math.sign(player.g)*300;
			player.y = y2b * blockSize - playerSize;
			if (player.g > 0 && player.yv >= 0) player.canJump = true;
		} else if (player.g > 0 && !player.godMode) player.canJump = false;
		// checkpoint
		if (isTouching("any",3)) {
			levels[worldMap[player.spawnPoint[2]][player.spawnPoint[3]]][player.spawnPoint[0]][player.spawnPoint[1]] = 3;
			let coord = getCoord(3);
			player.spawnPoint = [coord[0],coord[1],player.levelCoord[0],player.levelCoord[1],player.g];
			levels[player.currentLevel][coord[0]][coord[1]] = 4;
			drawLevel();
		}
		// anti-grav
		if (isTouching("any",6)) {
			if (player.g > 0) player.g = -player.g;
		}
		if (isTouching("any",7)) {
			if (player.g < 0) player.g = -player.g;
		}
		// death block
		if (isTouching("any",2) && !player.godMode) {
			respawn();
		}
		x1 = player.x + 1;
		x2 = player.x+playerSize - 1;
		y1 = player.y + 1;
		y2 = player.y+playerSize - 1;
		// level warp
		if (isTouching("any",-2)) {
			let coord = getCoord(-1);
			let warpId = levels[player.currentLevel][coord[0]][coord[1]][1];
			if (x1 < 0) { // left
				if (levels[player.currentLevel][coord[0]][coord[1]][2] != undefined) {
					player.levelCoord = [coord[2],coord[3]];
				} else player.levelCoord[0]--;
				player.x = levels[player.currentLevel].length * blockSize - playerSize;
				player.y = blockSize*levels[player.currentLevel][levels[player.currentLevel].length-1].findIndex(x => x[0]==-1 && x[1]==warpId)+(y1+blockSize)%blockSize;
			} else if (x2 > levels[player.currentLevel].length * blockSize) { // right
				if (levels[player.currentLevel][coord[0]][coord[1]][2] != undefined) {
					player.levelCoord = [coord[2],coord[3]];
				} else player.levelCoord[0]++;
				player.x = 0;
				player.y = blockSize*levels[player.currentLevel][0].findIndex(x => x[0]==-1 && x[1]==warpId)+(y1+blockSize)%blockSize;
			} else if (y1 < 0) { // up
				if (levels[player.currentLevel][coord[0]][coord[1]][2] != undefined) {
					player.levelCoord = [coord[2],coord[3]];
				} else player.levelCoord[1]++;
				player.y = levels[player.currentLevel][0].length * blockSize - playerSize;
				player.x = blockSize*levels[player.currentLevel].findIndex(x => x[x.length-1][0]==-1 && x[x.length-1][1]==warpId)+(x1+blockSize)%blockSize;
			} else if (y2 > levels[player.currentLevel][0].length * blockSize) { // down
				if (levels[player.currentLevel][coord[0]][coord[1]][2] != undefined) {
					player.levelCoord = [coord[2],coord[3]];
				} else player.levelCoord[1]--;
				player.y = 0;
				player.x = blockSize*levels[player.currentLevel].findIndex(x => x[0][0]==-1 && x[0][1]==warpId)+(x1+blockSize)%blockSize;
			}
		}
		// key input
		if (control.up && player.canJump) player.yv = -Math.sign(player.g)*225;
		if (control.left) player.xv = -100;
		if (control.right) player.xv = 100;
		// draw checks
		if (player.x != xprev || player.y != yprev) drawPlayer();
		if (player.levelCoord[0] != lvlxprev || player.levelCoord[1] != lvlyprev) drawLevel();
	}
	window.requestAnimationFrame(nextFrame);
}
function drawPlayer() {
	let canvas = document.getElementById("playerLayer");
	let pL = canvas.getContext("2d");
	canvas.width = levels[player.currentLevel].length*blockSize;
	canvas.height = levels[player.currentLevel][0].length*blockSize;
	pL.clearRect(0,0,canvas.width,canvas.height);
	pL.fillStyle = "#0000FF";
	pL.fillRect(Math.floor(player.x), Math.floor(player.y), playerSize, playerSize);
	adjustScreen();
}
function drawLevel() {
	let canvas = document.getElementById("levelLayer");
	let lL = canvas.getContext("2d");
	canvas.width = levels[player.currentLevel].length*blockSize;
	canvas.height = levels[player.currentLevel][0].length*blockSize;
	lL.clearRect(0,0,canvas.width,canvas.height);
	for (let x in levels[player.currentLevel]) {
		for (let y in levels[player.currentLevel][x]) {
			lL.lineWidth = blockSize*3/25;
			let xb = x * blockSize;
			let yb = y * blockSize;
			let type = getBlockType(x,y);
			switch (type) {
				case 1:
					lL.fillStyle = "#000000";
					break;
				case 2:
					lL.fillStyle = "#FF0000";
					break;
				case 3:
					lL.fillStyle = "#00888888";
					break;
				case 4:
					lL.fillStyle = "#00FFFF88";
					break;
				case 5:
					lL.fillStyle = "#FFFF00";
					break;
				case 6:
					lL.fillStyle = "#FF888888";
					break;
				case 7:
					lL.fillStyle = "#8888FF88";
					break;
				default:
					lL.fillStyle = "#00000000";
			}
			lL.fillRect(xb, yb, blockSize, blockSize);
			switch (type) {
				case 2:
					lL.strokeStyle = "#880000";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.stroke();

					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 3:
					lL.strokeStyle = "#00444488";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 4:
					lL.strokeStyle = "#00888888";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/2);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/25*3);
					lL.stroke();
					break;
				case 5:
					lL.strokeStyle = "#888800";
					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize/4);
					lL.lineTo(xb+blockSize/2,yb+blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize/4);
					lL.stroke();

					lL.beginPath();
					lL.moveTo(xb+blockSize/25*3,yb+blockSize-blockSize/4);
					lL.lineTo(xb+blockSize/2,yb+blockSize-blockSize/25*3);
					lL.lineTo(xb+blockSize-blockSize/25*3,yb+blockSize-blockSize/4);
					lL.stroke();
					break;
				case 6:
					lL.strokeStyle = "#88000088";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize/25*3,blockSize/5,blockSize/5);

					for (let i=0; i<3; i++) {
						lL.beginPath();
						lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/25*3);
						lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize/5+blockSize/25*6);
						lL.stroke();
					}
					break;
				case 7:
					lL.strokeStyle = "#00008888";
					lL.lineWidth = blockSize/25;
					lL.strokeRect(xb+(blockSize-blockSize/5)/2,yb+blockSize-blockSize/5-blockSize/25*3,blockSize/5,blockSize/5);

					for (let i=0; i<3; i++) {
						lL.beginPath();
						lL.moveTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize/25*3);
						lL.lineTo(xb+(blockSize-blockSize/5)/2+blockSize*i/10,yb+blockSize-blockSize/5-blockSize/25*6);
						lL.stroke();
					}
					break;
			}
		}
	}
	adjustScreen();
}
function adjustScreen() {
	let lvlx = Math.floor((window.innerWidth - levels[player.currentLevel].length*blockSize) / 2);
	if (lvlx < 0) {
		lvlx = Math.floor(window.innerWidth/2) - Math.floor(player.x+playerSize/2);
		if (lvlx > 0) lvlx = 0;
		if (lvlx < window.innerWidth - levels[player.currentLevel].length*blockSize) lvlx = Math.floor(levels[player.currentLevel].length*blockSize - window.innerWidth);
	}
	let lvly = Math.floor((window.innerHeight - levels[player.currentLevel][0].length*blockSize) / 2);
	if (lvly < 0) {
		lvly = Math.floor(window.innerHeight/2) - Math.floor(player.y+playerSize/2);
		if (lvly > 0) lvly = 0;
		if (lvly < window.innerHeight - levels[player.currentLevel][0].length*blockSize) lvly = Math.floor(window.innerHeight - levels[player.currentLevel][0].length*blockSize);
	}
	document.getElementById("playerLayer").style.left = lvlx+"px";
	document.getElementById("levelLayer").style.left = lvlx+"px";
	document.getElementById("playerLayer").style.top = lvly+"px";
	document.getElementById("levelLayer").style.top = lvly+"px";
}
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
respawn();
drawPlayer();
drawLevel();
window.requestAnimationFrame(nextFrame);
