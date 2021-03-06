document.addEventListener("mousedown", function (input) {
  if (input.ctrlKey) {
    if (input.button === 0) control.lmb = true;
    if (input.button === 2) {
      player.playerFocus = true;
      adjustScreen();
    }
  }
});
id("levelLayer").addEventListener("mousedown", function (input) {
  if (!editDisabled) {
    input.preventDefault();
    window.focus();
    let xb = Math.floor((input.offsetX - camCenterx) / blockSize);
    let yb = Math.floor((input.offsetY - camCentery) / blockSize);
    if (control.e) {
      if (input.button === 0) {
        openPropertyMenu(xb, yb);
      }
    } else if (input.ctrlKey) {
      if (input.button === 0) control.lmb = true;
      if (input.button === 2) {
        player.playerFocus = true;
        adjustScreen();
      }
    } else if (input.shiftKey) {
      if (input.button === 1) {
        if (player.selectedBlock[0] == player.selectedBlock[1]) {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "#0 0 0 5px FF0000";
        } else {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow = "";
        }
        player.selectedBlock[1] = getBlockType(xb, yb, false);
        if (hasProperty(player.selectedBlock[1])) {
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            defaultProperty[player.selectedBlock[1]][i] =
              level[xb][yb][parseInt(i) + 1];
          }
          drawBlock(
            id("blockSelect" + player.selectedBlock[1]),
            0,
            0,
            player.selectedBlock[1],
            0,
            0,
            1,
            true
          );
        }
        if (player.selectedBlock[0] == player.selectedBlock[1]) {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "0 0 0 5px #FF00FF";
        } else {
          id("blockSelect" + player.selectedBlock[1]).style.boxShadow =
            "0 0 0 5px #0000FF";
        }
      } else {
        player.x = input.offsetX - camCenterx - player.size / 2;
        player.y = input.offsetY - camCentery - player.size / 2;
        player.xv = 0;
        player.yv = 0;
        drawPlayer();
      }
    } else {
      if (input.button === 0) {
        control.lmb = true;
        if (hasProperty(player.selectedBlock[0])) {
          level[xb][yb] = [player.selectedBlock[0]];
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[0]][i];
          }
        } else level[xb][yb] = player.selectedBlock[0];
        if (player.selectedBlock[0] === 17) {
          setSpawn(xb, yb, true);
          level[xb][yb] = [17].concat(player.spawnPoint.slice(2));
        }
        drawLevel();
      } else if (input.button === 1) {
        if (player.selectedBlock[1] == player.selectedBlock[0]) {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #0000FF";
        } else {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow = "";
        }
        player.selectedBlock[0] = getBlockType(xb, yb, false);
        if (hasProperty(player.selectedBlock[0])) {
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            defaultProperty[player.selectedBlock[0]][i] =
              level[xb][yb][parseInt(i) + 1];
          }
          drawBlock(
            id("blockSelect" + player.selectedBlock[0]),
            0,
            0,
            player.selectedBlock[0],
            0,
            0,
            1,
            true
          );
        }
        if (player.selectedBlock[1] == player.selectedBlock[0]) {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #FF00FF";
        } else {
          id("blockSelect" + player.selectedBlock[0]).style.boxShadow =
            "0 0 0 5px #FF0000";
        }
      } else if (input.button === 2) {
        control.rmb = true;
        if (hasProperty(player.selectedBlock[1])) {
          level[xb][yb] = [player.selectedBlock[1]];
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[1]][i];
          }
        } else level[xb][yb] = player.selectedBlock[1];
        if (player.selectedBlock[1] === 17) {
          setSpawn(xb, yb, true);
          level[xb][yb] = [17].concat(player.spawnPoint.slice(2));
        }
        drawLevel();
      }
    }
  }
});
id("levelLayer").addEventListener("mousemove", function (input) {
  if (!editDisabled) {
    input.preventDefault();
    let xb = Math.floor((input.offsetX - camCenterx) / blockSize);
    let yb = Math.floor((input.offsetY - camCentery) / blockSize);
    if (input.ctrlKey) {
      if (control.lmb) {
        player.playerFocus = false;
        lvlxOffset += input.movementX;
        lvlyOffset += input.movementY;
        camx = lvlxOffset;
        camy = lvlyOffset;
        adjustScreen();
      }
    } else if (!input.shiftKey) {
      if (control.lmb) {
        if (hasProperty(player.selectedBlock[0])) {
          level[xb][yb] = [player.selectedBlock[0]];
          for (let i in defaultProperty[player.selectedBlock[0]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[0]][i];
          }
        } else level[xb][yb] = player.selectedBlock[0];
        if (player.selectedBlock[0] === 17) {
          setSpawn(xb, yb, true);
          level[xb][yb] = [17].concat(player.spawnPoint.slice(2));
        }
        drawLevel();
      } else if (control.rmb) {
        if (hasProperty(player.selectedBlock[1])) {
          level[xb][yb] = [player.selectedBlock[1]];
          for (let i in defaultProperty[player.selectedBlock[1]]) {
            level[xb][yb][parseInt(i) + 1] =
              defaultProperty[player.selectedBlock[1]][i];
          }
        } else level[xb][yb] = player.selectedBlock[1];
        if (player.selectedBlock[1] === 17) {
          setSpawn(xb, yb, true);
          level[xb][yb] = [17].concat(player.spawnPoint.slice(2));
        }
        drawLevel();
      }
    }
    id("mousePos").innerHTML = "[" + xb + "," + yb + "]";
    if (hasProperty(getBlockType(xb, yb, false))) {
      let text = "";
      for (let i in blockProperty[getBlockType(xb, yb, false)]) {
        if (blockProperty[getBlockType(xb, yb, false)][i][0] === "!") continue;
        text += blockProperty[getBlockType(xb, yb, false)][i];
        text += ": ";
        if (propertyType[getBlockType(xb, yb, false)][i] === "block") {
          if (typeof level[xb][yb][parseInt(i) + 1] === "object") {
            text += blockName[level[xb][yb][parseInt(i) + 1][0]];
            for (let j in level[xb][yb][parseInt(i) + 1]) {
              if (j == 0) continue;
              if (
                blockProperty[level[xb][yb][parseInt(i) + 1][0]][j - 1][0] ===
                "!"
              )
                continue;
              text += "<br>";
              text += "  ";
              text += blockProperty[level[xb][yb][parseInt(i) + 1][0]][j - 1];
              text += ": ";
              text += level[xb][yb][parseInt(i) + 1][j];
            }
          } else text += blockName[level[xb][yb][parseInt(i) + 1]];
        } else text += level[xb][yb][parseInt(i) + 1];
        text += "<br>";
      }
      id("tooltip").innerHTML = text;
      id("tooltip").style.display = "block";
      id("tooltip").style.left = input.clientX + 5 + "px";
      id("tooltip").style.top =
        input.clientY - id("tooltip").clientHeight - 5 + "px";
    } else {
      id("tooltip").style.display = "none";
    }
  }
});
id("levelLayer").addEventListener("mouseup", function (input) {
  if (input.button === 0) {
    control.lmb = false;
  } else if (input.button === 2) {
    control.rmb = false;
  }
  if (!arraysEqual(level, prevVersions[currentVersion])) addVersion();
});
id("levelLayer").addEventListener("mouseleave", function () {
  id("tooltip").style.display = "none";
  control.lmb = false;
  control.rmb = false;
  if (!arraysEqual(level, prevVersions[currentVersion])) addVersion();
});
document.addEventListener("contextmenu", function (input) {
  input.preventDefault();
});

document.addEventListener("keydown", function (input) {
  if (!editDisabled) {
    let key = input.code;
    if (!(key === "F12" || (key === "KeyC" && input.altKey && input.metaKey))) {
      input.preventDefault();
    }
    switch (key) {
      case "ArrowUp":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of rows added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else {
            alert("Invalid input!");
            break;
          }
          changeLevelSize("up", dw);
        } else if (input.ctrlKey || input.metaKey) {
          changeLevelSize("up", -1);
        } else if (input.shiftKey) {
          changeLevelSize("up", 1);
        }
      case "KeyW":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey)) {
          control.up = true;
        }
        break;
      case "ArrowDown":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of rows added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else {
            alert("Invalid input!");
            break;
          }
          changeLevelSize("down", dw);
        } else if (input.ctrlKey || input.metaKey) {
          changeLevelSize("down", -1);
        } else if (input.shiftKey) {
          changeLevelSize("down", 1);
        }
      case "KeyS":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.down = true;
        break;
      case "ArrowLeft":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of columns added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else {
            alert("Invalid input!");
            break;
          }
          changeLevelSize("left", dw);
        } else if (input.ctrlKey || input.metaKey) {
          changeLevelSize("left", -1);
        } else if (input.shiftKey) {
          changeLevelSize("left", 1);
        }
      case "KeyA":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.left = true;
        break;
      case "ArrowRight":
        if ((input.ctrlKey || input.metaKey) && input.shiftKey) {
          let dw = prompt(
            "Please enter desired amount of columns added. (Negatives allowed)"
          );
          if (dw == parseInt(dw)) {
            dw = parseInt(dw);
          } else {
            alert("Invalid input!");
            break;
          }
          changeLevelSize("right", dw);
        } else if (input.ctrlKey || input.metaKey) {
          changeLevelSize("right", -1);
        } else if (input.shiftKey) {
          changeLevelSize("right", 1);
        }
      case "KeyD":
        if (!input.shiftKey && !(input.ctrlKey || input.metaKey))
          control.right = true;
        break;
      case "KeyE":
        if (isMobile) control.e = !control.e;
        else control.e = true;
        break;
      case "KeyR":
        if (input.shiftKey) {
          respawn(true);
        } else respawn();
        break;
      case "KeyG":
        player.godMode = !player.godMode;
        drawPlayer();
        break;
      case "KeyN":
        player.noclip = !player.noclip;
        drawPlayer();
        break;
      case "Digit1":
        if (id("info").style.display !== "none") {
          id("info").style.display = "none";
        } else if (id("info").style.display !== "inline")
          id("info").style.display = "inline";
        break;
      case "Digit2":
        if (id("control").style.display !== "none") {
          id("control").style.display = "none";
        } else if (id("control").style.display !== "inline")
          id("control").style.display = "inline";
        break;
      case "Digit3":
        if (id("blockSelect").style.display !== "none") {
          id("blockSelect").style.display = "none";
          id("mobileControls").style.bottom = 0;
          id("mobileControlsLeft").style.bottom = 0;
        } else if (id("blockSelect").style.display !== "flex") {
          id("blockSelect").style.display = "flex";
          id("mobileControls").style.bottom = "max(20%, 125px)";
          id("mobileControlsLeft").style.bottom = "max(20%, 125px)";
        }
        break;
      case "Digit4":
        if (id("grid").style.display !== "none") {
          id("grid").style.display = "none";
        } else if (id("grid").style.display !== "block")
          id("grid").style.display = "block";
        break;
      case "Digit5":
        if (id("infoOpen").style.display !== "none") {
          id("infoOpen").style.display = "none";
        } else if (id("infoOpen").style.display !== "block")
          id("infoOpen").style.display = "block";
        break;
      case "KeyF":
        if (input.shiftKey) {
          save();
        } else if (input.ctrlKey || input.metaKey) {
          control.lmb = false;
          control.rmb = false;
          toggleSaveMenu();
        }
        break;
      case "Delete":
        if (input.shiftKey) {
          for (let i in level) level[i] = level[i].fill(0);
          drawLevel();
        }
        break;
      case "KeyZ":
        if (input.ctrlKey || input.metaKey) {
          if (input.shiftKey) {
            if (currentVersion < prevVersions.length - 1) {
              currentVersion++;
              level = deepCopy(prevVersions[currentVersion]);
              if (
                prevVersions[currentVersion - 1].length !== level.length ||
                prevVersions[currentVersion - 1][0].length !== level[0].length
              ) {
                id("lvlWidth").innerHTML = level.length;
                id("levelLayer").width = Math.min(level.length * blockSize, window.innerWidth + 2 * camOffsetLimit);
                id("lvlHeight").innerHTML = level[0].length;
                id("levelLayer").height = Math.min(level[0].length * blockSize, window.innerHeight + 2 * camOffsetLimit);
                prevLevel = [];
              }
              drawLevel();
            }
          } else if (currentVersion > 0) {
            currentVersion--;
            level = deepCopy(prevVersions[currentVersion]);
            if (
              prevVersions[currentVersion + 1].length !== level.length ||
              prevVersions[currentVersion + 1][0].length !== level[0].length
            ) {
              id("lvlWidth").innerHTML = level.length;
              id("levelLayer").width = Math.min(level.length * blockSize, window.innerWidth + 2 * camOffsetLimit);
              id("lvlHeight").innerHTML = level[0].length;
              id("levelLayer").height = Math.min(level[0].length * blockSize, window.innerHeight + 2 * camOffsetLimit);
              prevLevel = [];
            }
            drawLevel();
          }
        }
        break;
      case "KeyC":
        openInfo();
        break;
      case "MobileSize":
        if (id("mobileSizeMenu").style.display !== "none") {
          id("mobileSizeMenu").style.display = "none";
        } else if (id("mobileSizeMenu").style.display !== "inline")
          id("mobileSizeMenu").style.display = "inline";
        break;
      default:
    }
  }
});
document.addEventListener("keyup", function (input) {
  if (!editDisabled) {
    let key = input.code;
    switch (key) {
      case "ArrowLeft":
      case "KeyA":
        control.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        control.right = false;
        break;
      case "ArrowUp":
      case "KeyW":
        control.up = false;
        if (!control.down) player.canJump = true;
        break;
      case "ArrowDown":
      case "KeyS":
        control.down = false;
        if (!control.up) player.canJump = true;
        break;
      case "KeyE":
        control.e = false;
        break;
      default:
    }
  }
});
