let backspace;
let backspaceImagePath = `backspace.png`;
let backspaceImage;
let backspaceX;
let backspaceY;
let backspaceW = 355;
let backspaceH = 142;
let backspaceScale = 0.7;

let upgradesYIndent = 10;
let upgradesW = 100;
let upgradesH = 50;

let upgrade, fasterTyping, stickyKeys, doublePress, autoComplete, rageMode, codeReview, multitasking;

let rageModeOn = false;
let rageModeTimer = 0;
let rageModeTime = 1800;
let rageModeChance = 0.1;

let negativeEventChance = 0.05;

// Variable to keep track of deleted characters
var deletedChars = 0;

// Variables for upgrades
var autoClicksPerSecond = 0;
var userClickMultiplier = 1;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);

    backspace = new Sprite(width / 2, height / 2);
    backspace.addImage(backspaceImage);
    backspace.scale = backspaceScale;

    let upgradesX = width / 10;

    upgrade = new Group();
    upgrade.width = upgradesW;
    upgrade.height = upgradesH;
    upgrade.color = color(200, 200, 200);

    fasterTyping = new upgrade.Sprite(upgradesX, height/5);
    fasterTyping.name = "fasterTyping";
    fasterTyping.price = 10;
    fasterTyping.amt = 0;
    fasterTyping.desc = `x2 User Clicks (One-Time Purchase)\nCost: ${fasterTyping.price} chars`;
    fasterTyping.text = `Faster Typing x${fasterTyping.amt}`;
    fasterTyping.click = function() {
        userClickMultiplier *= 2;
        fasterTyping.amt++;
        fasterTyping.desc = `x2 User Clicks (One-Time Purchase)\nCost: ${fasterTyping.price} chars`;
        fasterTyping.locked = true;
    }

    stickyKeys = new upgrade.Sprite(upgradesX, height/5 + upgradesYIndent + upgradesH);
    stickyKeys.name = "stickyKeys";
    stickyKeys.price = 15
    stickyKeys.desc = `+1 Auto Clicks per second \n Cost: ${stickyKeys.price} chars`;
    stickyKeys.amt = 0;
    stickyKeys.text = `Sticky Keys x${stickyKeys.amt}`;
    stickyKeys.click = function() {
        autoClicksPerSecond += 1;
        stickyKeys.amt++;
        stickyKeys.desc = `+1 Auto Clicks per second \n Cost: ${stickyKeys.price} chars`;
        stickyKeys.locked = true;
    }

    doublePress = new upgrade.Sprite(upgradesX, height/5 + 2 * (upgradesYIndent + upgradesH));
    doublePress.name = "doublePress";
    doublePress.price = 150;
    doublePress.amt = 0;
    doublePress.desc = `x3 User Clicks (One-Time Purchase)\nCost: ${doublePress.price} chars`;
    doublePress.text = `Double Press x${doublePress.amt}`;
    doublePress.click = function() {
        userClickMultiplier *= 3;
        doublePress.amt++;
        
        doublePress.desc = `x3 User Clicks (One-Time Purchase)\nCost: ${doublePress.price} chars`;
        doublePress.locked = true;
    }

    autoComplete = new upgrade.Sprite(upgradesX, height/5 + 3 * (upgradesYIndent + upgradesH));
    autoComplete.name = "autoComplete";
    autoComplete.price = 50;
    autoComplete.amt = 0;
    autoComplete.desc = `+5 Auto Clicks\nCost: ${autoComplete.price} chars`;
    autoComplete.text = `Auto Complete x${autoComplete.amt}`;
    autoComplete.click = function() {
        autoClicksPerSecond += 5;
        autoComplete.amt++;
        autoComplete.locked = true;
    }

    rageMode = new upgrade.Sprite(upgradesX, height/5 + 4 * (upgradesYIndent + upgradesH));
    rageMode.name = "rageMode";
    rageMode.price = 500;
    rageMode.amt = 0;
    rageMode.desc = `Chance for a 10s boost(One-Time Purchase)\nCost: ${rageMode.price} chars`;
    rageMode.text = `Rage Mode x${rageMode.amt}`;
    rageMode.click = function() {
        rageModeOn = true;
        rageMode.amt++;
        rageMode.locked = true;
    }

    codeReview = new upgrade.Sprite(upgradesX, height/5 + 5 * (upgradesYIndent + upgradesH));
    codeReview.name = "codeReview";
    codeReview.price = 100;
    codeReview.amt = 0;
    codeReview.desc = `Decrease negative event chance (One-Time Purchase)\nCost: ${codeReview.price} chars`;
    codeReview.text = `Code Review x${codeReview.amt}`;
    codeReview.click = function() {
        negativeEventChance *= 0.3;
        codeReview.amt++;
        codeReview.locked = true;
    }

    multitasking = new upgrade.Sprite(upgradesX, height/5 + 6 * (upgradesYIndent + upgradesH));
    multitasking.name = "multitasking";
    multitasking.price = 500;
    multitasking.amt = 0;
    multitasking.desc = `x3 User Clicks (One-Time Purchase)\nCost: ${multitasking.price} chars`;
    multitasking.text = `Multitasking x${multitasking.amt}`;
    multitasking.click = function() {
        userClickMultiplier *= 3;
        multitasking.amt++;
        multitasking.locked = true;
    }
}

// Preload function to load images
function preload() {
    backspaceImage = loadImage(backspaceImagePath);
}

// Function to draw backspace image
function drawbackspace() {
    backspace.position.x = width / 2;
    backspace.position.y = height / 2;
    backspace.draw()
}

function animateBackspace() {
    if (kb.presses('backspace') || backspace.mouse.pressed()) {
        deletedChars += userClickMultiplier;
        let targetScale = backspaceScale - 0.1;
        let duration = 10;
        let startTime = millis();
        let startScale = backspace.scale;
        let easing = function(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }; // cubic easing function
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
            let easing = function(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }; // cubic easing function
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function compressNumber(num) {
    const units = ["", "K", "M", "B", "T"];
    let unitIndex = 0;
    while (num >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    if (unitIndex == 0) return num.toFixed(0);
    return num.toFixed(1) + units[unitIndex];
  }

function draw() {
    background(255);
    windowResized();
    drawbackspace();
    animateBackspace();

    if (frameCount % 60 == 0) {
        deletedChars += autoClicksPerSecond;
    }

    for (let i = 0; i < upgrade.length; i++) {
        let currentUpgrade = upgrade[i];

        if (currentUpgrade.mouse.hovering()) {
            fill(0);
            text(currentUpgrade.desc, currentUpgrade.position.x + currentUpgrade.width, currentUpgrade.position.y);
        }

        if (currentUpgrade.locked) {
            currentUpgrade.color = color(200, 150, 150);
        } else if (deletedChars >= currentUpgrade.price) {
            currentUpgrade.color = color(150, 200, 150);
            if (currentUpgrade.mouse.hovering()) {
                currentUpgrade.color = color(100, 255, 100);
                //draw tootltip desc
            }
            if (currentUpgrade.mouse.pressed()) {
                deletedChars -= currentUpgrade.price;
                currentUpgrade.click();
            }
        } else {
            currentUpgrade.color = color(200);
        }

        // Draw the upgrade
        currentUpgrade.draw();
    }

    // Draw the user's current amount of deleted characters
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`${compressNumber(deletedChars)} Chars`, width / 2, height / 2 - backspaceH);
    textSize(24);
    text(`${autoClicksPerSecond} per second`, width / 2, height / 2 - backspaceH / 1.5);
    textSize(14);
    textAlign(LEFT, LEFT);
}