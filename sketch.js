// Image variables
let backspaceImagePath = `backspace.png`;
let backspaceImage;
let backspaceX;
let backspaceY;
let backspaceW = 355;
let backspaceH = 142;
let backspaceScale = 0.7;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);

    backspaceX = width / 2 - backspaceW / 2;
    backspaceY = height / 2 - backspaceH / 2;
}

// Preload function to load images
function preload() {
  backspaceImage = loadImage(backspaceImagePath);
}

// Function to draw backspace image
function drawbackspace() {
	image(backspaceImage, backspaceX, backspaceY, backspaceW * backspaceScale, backspaceH * backspaceScale);
}

// Variable to keep track of deleted characters
var deletedChars = 0;

// Variables for upgrades
var autoClicksPerSecond = 0;
var userClickMultiplier = 1;

// Class for auto-clicker upgrades
class AutoClickerUpgrades{
    constructor(name, cost, costMultiplier, owned, cps, description){
        this.name = name;
        this.cost = cost;
        this.costMultiplier = costMultiplier;
        this.owned = owned;
        this.cps = cps;
        this.description = description;
    }

    // Function to draw upgrade button
    drawAutoClickerUpgradeButton(x, y) {
        //draw rect, handling cost
        if (deletedChars >= this.cost){
            fill(255);
        } else {
            fill(200);
        }
        rect(x, y, 100, 50);

        //draw button text
        fill(0);
        textSize(12);
        text(this.name, x + 5, y + 15);
        text(`Cost: ${this.cost}`, x + 5, y + 30);
    }

    // Function to buy auto-clicker upgrade
    buyAutoClickerUpgrade(){
        if (deletedChars >= this.cost){
            deletedChars -= this.cost;
            this.owned++;
            this.cost *= this.costMultiplier;
        }
    }

    //handle mouse functions (hover tooltip desc, click to buy)
    handleMouse(x, y){
    }
}

// Array of upgrade objects
let upgrades = [
    new AutoClickerUpgrades(`Faster Typing`, 10, 1.1, 0, 1, `+1 CPS`),
    new AutoClickerUpgrades(`Sticky Keys`, 50, 1.2, 0, 1, `+5 CPS`),
    //new UserClickUpgrades(`Double Press`, 100, 1.3, `User clicks x2`),
    new AutoClickerUpgrades(`Auto-Complete`, 500, 1.4, 0, 5, `+10 CPS`),
    //new MiscUpgrades(`Rage Mode`, 1000, 1.5, 0, 1, `Chance of a 30s period of x10 point generation, from both auto-clicks and user clicks`),
    //new MiscUpgrades(`Code Review`, 5000, 1.6, 0, 1, `Reduce the chance of negative random events`),
    //new UserClickUpgrades(`Multitasking`, 10000, 1.7, `User clicks x3`)
];   

function draw() {
    background(255);
    drawbackspace();
    //test upgrade button
    upgrades[0].drawAutoClickerUpgradeButton(100, 100);
}