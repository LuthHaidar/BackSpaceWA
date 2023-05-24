
/*
function animateBackspace() {
  const backspace = document.getElementById("backspace");
  backspace.classList.add("pressed");
  setTimeout(() => backspace.classList.remove("pressed"), 100);
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Backspace") {
    animateBackspace();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Backspace") {
    const backspace = document.getElementById("backspace");
    backspace.classList.remove("pressed");
  }
});
*/

/// Game variables
let points = 0;
let pointIncrement = 1;
let autoIncrement = 0;
let doublePointsChance = 0.1;
let rageModeActive = false;
let upgradeCosts = [10, 50, 100, 200, 500, 1000, 2000];
let upgrades = [0, 0, 0, 0, 0, 0, 0]; // Corresponds to upgrade indexes
let upgradeEffects = [1, 0, 0, 0, 0, 0, 0]; // Corresponds to upgrade indexes

// Event variables
let randomEvents = ["scrum", "mergeConflict", "bugInvasion", "coffeeBreak", "deadlineCrunch"];
let eventChances = [0.15, 0.05, 0.05, 0.1, 0.1];
let currentEvent = null;
let eventDuration = 5; // In seconds
let eventTimer = 0;
let eventActive = false;

// UI variables
let backspaceKey;
let backspaceAnimation = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  backspaceKey = new BackspaceKey(width / 2, height / 2, 100, 50);
}

function draw() {
  background(220);
  
  // Update and display backspace key
  backspaceKey.update();
  backspaceKey.display();
  
  // Display points
  textAlign(CENTER);
  textSize(32);
  text(points, width / 2, height - 50);
  
  // Check if random event should occur
  if (!eventActive && random() < eventChances.reduce((a, b) => a + b, 0)) {
    activateRandomEvent();
  }
  
  // Update and display event if active
  if (eventActive) {
    updateEvent();
    displayEvent();
  }
  
  // Upgrade buttons
  for (let i = 0; i < upgradeCosts.length; i++) {
    let x = 50 + (i * 70);
    let y = height - 100;
    let upgradeText = `Upgrade ${i + 1}\nCost: ${upgradeCosts[i]}`;
    if (upgrades[i] === 0) {
      upgradeText += `\nEffect: ${upgradeEffects[i]}`;
    } else {
      upgradeText += `\nEffect: ${upgradeEffects[i] * (upgrades[i] + 1)}`;
    }
    if (points >= upgradeCosts[i]) {
      fill(0, 255, 0);
    } else {
      fill(255, 0, 0);
    }
    rect(x, y, 60, 60);
    fill(0);
    textAlign(CENTER);
    textSize(12);
    text(upgradeText, x + 30, y + 40);
  }
}

function mousePressed() {
  // Check if backspace key is clicked
  if (backspaceKey.contains(mouseX, mouseY)) {
    backspaceAnimation = true;
    points += pointIncrement * (doublePointsChance > random() ? 2 : 1);
  }
  
  // Check if upgrade button is clicked
  for (let i = 0; i < upgradeCosts.length; i++) {
    let x = 50 + (i * 70);
    let y = height - 100;
    if (mouseX > x && mouseX < x + 60 && mouseY > y && mouseY < y + 60 && points >= upgradeCosts[i]) {
      points -= upgradeCosts[i];
      upgrades[i]++;
      upgradeCosts[i] *= 2;
      updateUpgradeEffects();
    }
  }
}

function keyPressed() {
  // Check if backspace key is pressed
  if (keyCode === BACKSPACE) {
    backspaceAnimation = true;
    points += pointIncrement * (doublePointsChance > random() ? 2 : 1);
  }
}

function updateUpgradeEffects() {
  upgradeEffects[0] = 1 + upgrades[0] * 0.5; // Faster typing
  upgradeEffects[1] = upgrades[1]; // Sticky keys
  upgradeEffects[2] = upgrades[2]; // Double press
  upgradeEffects[3] = upgrades[3]; // Auto-complete
  upgradeEffects[4] = upgrades[4] * 2; // Rage mode
  upgradeEffects[5] = upgrades[5]; // Code review
  upgradeEffects[6] = upgrades[6]; // Multitasking
}

function activateRandomEvent() {
  let index = floor(random(randomEvents.length));
  currentEvent = randomEvents[index];
  eventActive = true;
  eventTimer = eventDuration;
}

function updateEvent() {
  eventTimer -= deltaTime / 1000;
  if (eventTimer <= 0) {
    eventActive = false;
    switch (currentEvent) {
      case "scrum":
        pointIncrement *= 0.5; // Decrease point increment during scrum event
        break;
      case "mergeConflict":
        // Disable some upgrades and require the player to resolve the conflict
        for (let i = 0; i < upgrades.length; i++) {
          if (upgrades[i] > 0) {
            upgrades[i]--;
          }
        }
        updateUpgradeEffects();
        break;
      case "bugInvasion":
        // Reduce points by a random amount
        let pointsLost = floor(random(points * 0.1, points * 0.5));
        points -= pointsLost;
        break;
      case "coffeeBreak":
        // Increase point increment during coffee break event
        pointIncrement *= 2;
        break;
      case "deadlineCrunch":
        // Implement timed challenge where player must generate points before timer runs out
        // You can use an additional timer variable and update it accordingly
        break;
    }
  }
}

function displayEvent() {
  textAlign(CENTER);
  textSize(16);
  text(`Event: ${currentEvent}`, width / 2, height - 20);
}

class BackspaceKey {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  contains(px, py) {
    return px > this.x - this.w / 2 && px < this.x + this.w / 2 && py > this.y - this.h / 2 && py < this.y + this.h / 2;
  }
  
  update() {
    if (backspaceAnimation) {
      // Perform animation logic here
      // For example, you can change the scale or color of the backspace key temporarily
      backspaceAnimation = false; // Reset animation flag
    }
  }
  
  display() {
    // Display backspace key
    rectMode(CENTER);
    fill(200);
    rect(this.x, this.y, this.w, this.h);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("⌫", this.x, this.y);
  }
}