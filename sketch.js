let backspace;
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

    backspace = createSprite(width / 2, height / 2);
    backspace.addImage(backspaceImage);
    backspace.scale = backspaceScale;
}

// Preload function to load images
function preload() {
  backspaceImage = loadImage(backspaceImagePath);
}

// Function to draw backspace image
function drawbackspace() {
	backspace.position.x = width / 2;
    backspace.position.y = height / 2;   
    drawSprites();
}

function animateBackspace(){
    if (kb.presses('backspace') || backspace.mouse.pressed() ) {
        deletedChars++;
        let targetScale = backspaceScale - 0.1;
        let duration = 10;
        let startTime = millis();
        let startScale = backspace.scale;
        let easing = function(t) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; }; // cubic easing function
        let updateScale = function() {
            let now = millis();
            let t = (now - startTime) / duration;
            if (t >= 1) {
                backspace.scale = targetScale;
                requestAnimationFrame(reverseScale);
            } else {
                backspace.scale = lerp(startScale, targetScale, easing(t));
                requestAnimationFrame(updateScale);
            }
        };
        let reverseScale = function() {
            let targetScale = backspaceScale;
            let duration = 100;
            let startTime = millis();
            let startScale = backspace.scale;
            let easing = function(t) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; }; // cubic easing function
            let updateScale = function() {
                let now = millis();
                let t = (now - startTime) / duration;
                if (t >= 1) {
                    backspace.scale = targetScale;
                } else {
                    backspace.scale = lerp(startScale, targetScale, easing(t));
                    requestAnimationFrame(updateScale);
                }
            };
            updateScale();
        };
        updateScale();
    }
}

// Variable to keep track of deleted characters
var deletedChars = 0;

// Variables for upgrades
var autoClicksPerSecond = 0;
var userClickMultiplier = 1;

// Class for auto-clicker upgrades
class AutoClickerUpgrades{
    constructor(name, pos, cost, costMultiplier, owned, cps, description){
        this.name = name;
        this.pos = pos;
        this.cost = cost;
        this.costMultiplier = costMultiplier;
        this.owned = owned;
        this.cps = cps;
        this.description = description;
    }

    // Function to draw upgrade button
    drawAutoClickerUpgradeButton() {
        //draw rect, handling cost
        if (deletedChars >= this.cost){
            fill(255);
        } else {
            fill(200);
        }
        rect(this.pos.x, this.pos.y, 100, 50);

        //draw button text
        fill(0);
        textSize(12);
        text(this.name, this.pos.x + 5, this.pos.y + 15);
        text(`Cost: ${this.cost}`, this.pos.x + 5, this.pos.y + 30);
    }

    // Function to buy auto-clicker upgrade
    buyAutoClickerUpgrade(){
        if (deletedChars >= this.cost){
            deletedChars -= this.cost;
            this.owned++;
            this.cost *= this.costMultiplier;
        }
    }

    // Function to handle mouse interaction (hover for tooltip, click to buy)
    handleMouse(){
        if (mouseX > this.pos.x && mouseX < this.pos.x + 100 && mouseY > this.pos.y && mouseY < this.pos.y + 50) {
            fill(255, 0, 0);
            rect(this.pos.x, this.pos.y, 100, 50);
            fill(0);
            textSize(12);
            text(this.description, this.pos.x + 5, this.pos.y + 45);
            if (mouseIsPressed){
            }
        } 
    }
}

// Array of upgrade objects
let upgrades = [
    new AutoClickerUpgrades(`Faster Typing`, new p5.Vector(100, 100), 10, 1.1, 0, 1, `+1 CPS`),
    new AutoClickerUpgrades(`Sticky Keys`, new p5.Vector(100, 200), 50, 1.2, 0, 1, `+5 CPS`),
    //new UserClickUpgrades(`Double Press`, 100, 1.3, `User clicks x2`),
    new AutoClickerUpgrades(`Auto-Complete`, new p5.Vector(100, 300), 500, 1.4, 0, 5, `+10 CPS`),
    //new MiscUpgrades(`Rage Mode`, 1000, 1.5, 0, 1, `Chance of a 30s period of x10 point generation, from both auto-clicks and user clicks`),
    //new MiscUpgrades(`Code Review`, 5000, 1.6, 0, 1, `Reduce the chance of negative random events`),
    //new UserClickUpgrades(`Multitasking`, 10000, 1.7, `User clicks x3`)
];

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);
    drawbackspace();
    animateBackspace();
    //test upgrade button
    upgrades[0].drawAutoClickerUpgradeButton();
    upgrades[0].handleMouse();
}