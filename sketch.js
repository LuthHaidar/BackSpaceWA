let streams = [];
const fadeInterval = 1.4;
const symbolSize = 15;

let backspace, backspaceImage, backspaceX, backspaceY;
const backspaceImagePath = `backspace.png`;
const backspaceW = 355;
const backspaceH = 142;
const backspaceScale = 0.7;

let upgrade, fasterTyping, stickyKeys, doublePress, autoComplete, rageMode, codeReview, multitasking;
const upgradesYIndent = 10;
const upgradesW = 120;
const upgradesH = 50;

let rageModeActive = true;
let rageModeUnlocked = false;
let rageModeTimer = 0;
let rageModeTime = 1800;
let rageModeChance = 0.1;
let rageModeMultiplier = 1;

let negativeEventChance = 0.05;

// Variable to keep track of deleted characters
var deletedChars = 0;

// Variables for upgrades
var autoClicksPerSecond = 0;
var userClickMultiplier = 1;

//credit to emily xie for the matrix background
//https://editor.p5js.org/cg3320/sketches/Hk4f_Jg9Q
//i updated it to use ES6 classes and fixed some bugs
class SymbolObj {
    constructor(x, y, speed, first, opacity) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.first = first;
      this.opacity = opacity;
      this.switchInterval = Math.round(random(2, 25));
    }
  
    setToRandomSymbol() {
      const charType = Math.round(random(0, 5));
      if (frameCount % this.switchInterval === 0) {
        if (charType > 1) {
          // set it to Katakana
          this.value = String.fromCharCode(0x30A0 + Math.round(random(0, 96)));
        } else {
          // set it to numeric
          this.value = Math.round(random(0, 9));
        }
      }
    }
  
    rain() {
      this.y = (this.y >= height) ? 0 : this.y += this.speed;
    }
  }
  
  class Stream {
    constructor() {
      this.symbols = [];
      this.totalSymbols = Math.round(random(5, 35));
      this.speed = random(5, 12);
    }
  
    generateSymbols(x, y) {
      let opacity = 255;
      let first = Math.round(random(0, 4)) === 1;
      for (let i = 0; i <= this.totalSymbols; i++) {
        const symbol = new SymbolObj(x, y, this.speed, first, opacity);
        symbol.setToRandomSymbol();
        this.symbols.push(symbol);
        opacity -= (255 / this.totalSymbols) / fadeInterval;
        y -= symbolSize;
        first = false;
      }
    }
  
    render() {
      this.symbols.forEach(symbol => {
        if (symbol.first) {
          fill(255, 140, 170, symbol.opacity);
        } else {
          fill(255, 0, 70, symbol.opacity);
        }
        text(symbol.value, symbol.x, symbol.y);
        symbol.rain();
        symbol.setToRandomSymbol();
      });
    }
  }

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    textFont('Consolas');

    let x = 0;
    for (let i = 0; i <= width / symbolSize; i++) {
      const stream = new Stream();
      stream.generateSymbols(x, random(-2000, 0));
      streams.push(stream);
      x += symbolSize;
    }

    backspace = new Sprite(width / 2, height / 2);
    backspace.addImage(backspaceImage);
    backspace.scale = backspaceScale;

    let upgradesX = width / 10;

    upgrade = new Group();
    upgrade.width = upgradesW;
    upgrade.height = upgradesH;
    upgrade.color = color(200, 200, 200);

    // User click upgrades
    fasterTyping = new upgrade.Sprite(upgradesX, height/6);
    fasterTyping.name = "TypeFaster";
    fasterTyping.price = 50;
    fasterTyping.amt = 0;
    fasterTyping.desc = `x2 User Clicks (One-Time Purchase)\nCost: ${fasterTyping.price} chars`;
    fasterTyping.text = `${fasterTyping.name} x${fasterTyping.amt}`;
    fasterTyping.click = function() {
        userClickMultiplier *= 2;
        fasterTyping.locked = true;
    }

    doublePress = new upgrade.Sprite(upgradesX, height/6 + (upgradesYIndent + upgradesH));
    doublePress.name = "DoublePress";
    doublePress.price = 300;
    doublePress.amt = 0;
    doublePress.desc = `x3 User Clicks (One-Time Purchase)\nCost: ${doublePress.price} chars`;
    doublePress.text = `${doublePress.name} x${doublePress.amt}`;
    doublePress.click = function() {
        userClickMultiplier *= 3;
        doublePress.locked = true;
    }

    multitasking = new upgrade.Sprite(upgradesX, height/6 + 2 * (upgradesYIndent + upgradesH));
    multitasking.name = "Multitasking";
    multitasking.price = 5000;
    multitasking.amt = 0;
    multitasking.desc = `x5 User Clicks (One-Time Purchase)\nCost: ${multitasking.price} chars`;
    multitasking.text = `${multitasking.name} x${multitasking.amt}`;
    multitasking.click = function() {
        userClickMultiplier *= 5;
        multitasking.locked = true;
    }

    stickyKeys = new upgrade.Sprite(upgradesX, height/6 + 3 * (upgradesYIndent + upgradesH));
    stickyKeys.name = "StickyKeys";
    stickyKeys.price = 15
    stickyKeys.priceMultiplier = 1.6;
    stickyKeys.desc = `+1 Auto Clicks per second \n Cost: ${stickyKeys.price} chars`;
    stickyKeys.amt = 0;
    stickyKeys.text = `${stickyKeys.name} x${stickyKeys.amt}`;
    stickyKeys.click = function() {
        autoClicksPerSecond += 1;
        stickyKeys.desc = `+1 Auto Clicks per second \n Cost: ${stickyKeys.price} chars`;
    }

    autoComplete = new upgrade.Sprite(upgradesX, height/6 + 4 * (upgradesYIndent + upgradesH));
    autoComplete.name = "AutoComplete";
    autoComplete.price = 50;
    autoComplete.priceMultiplier = 1.5;
    autoComplete.amt = 0;
    autoComplete.desc = `+5 Auto Clicks\nCost: ${autoComplete.price} chars`;
    autoComplete.text = `${autoComplete.name} x${autoComplete.amt}`
    autoComplete.click = function() {
        autoClicksPerSecond += 5;
        autoComplete.desc = `+5 Auto Clicks\nCost: ${autoComplete.price} chars`;
    }

    // Autoclick upgrades
    macro = new upgrade.Sprite(upgradesX, height/6 + 5 * (upgradesYIndent + upgradesH));
    macro.name = "Macro";
    macro.price = 1000;
    macro.priceMultiplier = 1.4;
    macro.desc = `+10 Auto Clicks per second \n Cost: ${macro.price} chars`;
    macro.amt = 0;
    macro.text = `${macro.name} x${macro.amt}`;
    macro.click = function() {
        autoClicksPerSecond += 10;
        macro.desc = `+10 Auto Clicks per second \n Cost: ${macro.price} chars`;
    }

    pyGUI = new upgrade.Sprite(width - upgradesX, height/6);
    pyGUI.name = "pyGUI";
    pyGUI.price = 2000;
    pyGUI.priceMultiplier = 1.3;
    pyGUI.amt = 0;
    pyGUI.desc = `+25 Auto Clicks\nCost: ${pyGUI.price} chars`;
    pyGUI.text = `${pyGUI.name} x${pyGUI.amt}`
    pyGUI.click = function() {
        autoClicksPerSecond += 25;
        pyGUI.desc = `+25 Auto Clicks\nCost: ${pyGUI.price} chars`;
    }

    unpaidIntern = new upgrade.Sprite(width - upgradesX, height/6 + (upgradesYIndent + upgradesH));
    unpaidIntern.name = "UnpaidIntern";
    unpaidIntern.price = 50000;
    unpaidIntern.priceMultiplier = 1.2;
    unpaidIntern.amt = 0;
    unpaidIntern.desc = `+50 Auto Clicks\nCost: ${unpaidIntern.price} chars`;
    unpaidIntern.text = `${unpaidIntern.name} x${unpaidIntern.amt}`
    unpaidIntern.click = function() {
        autoClicksPerSecond += 50;
        unpaidIntern.desc = `+50 Auto Clicks\nCost: ${unpaidIntern.price} chars`;
    }

    chatGPT = new upgrade.Sprite(width - upgradesX, height/6 + 2 * (upgradesYIndent + upgradesH));
    chatGPT.name = "ChatGPT";
    chatGPT.price = 100000;
    chatGPT.priceMultiplier = 1.1;
    chatGPT.amt = 0;
    chatGPT.desc = `+100 Auto Clicks\nCost: ${chatGPT.price} chars`;
    chatGPT.text = `${chatGPT.name} x${chatGPT.amt}`
    chatGPT.click = function() {
        autoClicksPerSecond += 100;
        chatGPT.desc = `+100 Auto Clicks\nCost: ${chatGPT.price} chars`;
    }

    rageMode = new upgrade.Sprite(width - upgradesX, height/6 + 3 * (upgradesYIndent + upgradesH));
    rageMode.name = "Rage";
    rageMode.price = 50000;
    rageMode.amt = 0;
    rageMode.desc = `Chance for a 10s boost(One-Time Purchase)\nCost: ${rageMode.price} chars`;
    rageMode.text = `${rageMode.name} x${rageMode.amt}`;
    rageMode.click = function() {
      rageModeUnlocked = true;
      rageMode.locked = true;
    }

    codeReview = new upgrade.Sprite(width - upgradesX, height/6 + 4 * (upgradesYIndent + upgradesH));
    codeReview.name = "CodeReview";
    codeReview.price = 100;
    codeReview.amt = 0;
    codeReview.desc = `Decrease negative event chance (One-Time Purchase)\nCost: ${codeReview.price} chars`;
    codeReview.text = `${codeReview.name} x${codeReview.amt}`;
    codeReview.click = function() {
        negativeEventChance *= 0.3;
        codeReview.locked = true;
    }
}

// Preload function to load images
function preload() {
    backspaceImage = loadImage(backspaceImagePath);
}

function animateBackspace() {
    if (kb.presses('backspace') || backspace.mouse.pressed()) {
        deletedChars += userClickMultiplier * rageModeMultiplier;
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
    animateBackspace();

    textSize(symbolSize);
    streams.forEach(stream => {
      stream.render();
    });

    if (rageModeUnlocked && !rageModeActive) {
      if (frameCount % 1800 == 0 && random() > 0.1) {
        rageModeActive = true;
        rageModeTimer = 0;
      }
    }

    if (rageModeActive) {
      if (rageModeTimer < rageModeTime) {
        rageModeTimer++;
        translate(random(-5, 5), random(-5, 5))
        rageModeMultiplier = 10;
        fill(255, 140, 170, 150)
        textSize(80);
        textAlign(CENTER, CENTER);
        text("RAGE MODE", width/2, height/7)
      } else {
        rageModeTimer = 0;
        rageModeActive = false;
        rageModeMultiplier = 1;
      }
    }
    
    if (frameCount % 60 == 0) {
        deletedChars += autoClicksPerSecond * rageModeMultiplier;
    }


    for (let i = 0; i < upgrade.length; i++) {
        let currentUpgrade = upgrade[i];

        if (currentUpgrade.locked) {
            if (currentUpgrade.mouse.hovering()) {
                currentUpgrade.color = color(255, 100, 100);
                let textW = textWidth(currentUpgrade.desc);
                let textX = mouseX + currentUpgrade.width;
                if (textX + textW > width) {
                    textX = mouseX - textW;
                }
                fill(0);
                text(`LOCKED\n${currentUpgrade.desc}`, textX, mouseY);
            } else {
                currentUpgrade.color = color(200, 150, 150);
            }
        } else if (deletedChars >= currentUpgrade.price) {
            currentUpgrade.color = color(150, 200, 150);
            if (currentUpgrade.mouse.hovering()) {
                currentUpgrade.color = color(100, 255, 100);
                let textW = textWidth(currentUpgrade.desc);
                let textX = mouseX + currentUpgrade.width;
                if (textX + textW > width) {
                    textX = mouseX - textW;
                }
                fill(0);
                text(currentUpgrade.desc, textX, mouseY);
            }
            if (currentUpgrade.mouse.pressed()) {
                deletedChars -= currentUpgrade.price;
                currentUpgrade.amt++;
                currentUpgrade.price = round(currentUpgrade.price * currentUpgrade.priceMultiplier);  
                currentUpgrade.priceMultiplier *= random(1, currentUpgrade.priceMultiplier); 
                currentUpgrade.text = `${currentUpgrade.name} x${currentUpgrade.amt}`;
                currentUpgrade.click();
            }
        } else {
            currentUpgrade.color = color(200);
            if (currentUpgrade.mouse.hovering()) {
                currentUpgrade.color = color(150);
                let textW = textWidth(currentUpgrade.desc);
                let textX = mouseX + currentUpgrade.width;
                if (textX + textW > width) {
                    textX = mouseX - textW;
                }
                fill(0);
                text(`Not enough chars\n${currentUpgrade.desc}`, textX, mouseY);
            }
        }
    }

    // Draw the user's current amount of deleted characters
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`${compressNumber(deletedChars)} Chars`, width / 2, height / 2 - backspaceH);
    textSize(24);
    text(`${compressNumber(autoClicksPerSecond * rageModeMultiplier)} per second`, width / 2, height / 2 - backspaceH / 1.5);
    textSize(14);
    textAlign(LEFT, LEFT);
}