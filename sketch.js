let negativeEventChance = 0.05;

// Variable to keep track of deleted characters
var deletedChars = 0;

// Variables for upgrades
var autoClicksPerSecond = 0;
var userClickMultiplier = 1;

function setup() {
	new Canvas();
	background(255);
	textFont('Consolas');

  boundarySetup();
  backgroundSetup();
  confettiSetup();
  backspaceSetup();
  upgradesSetup();
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

function boundarySetup() {
  let boundary = new Sprite(canvas.w / 2, canvas.h / 2, canvas.w, canvas.h, 'static');
	boundary.color = 255
	boundary.shape = 'chain'
}

function draw() {
	background(255);
  //confettiEffect();

  if (frameCount % 60 == 0) {
      deletedChars += autoClicksPerSecond * rageModeMultiplier;
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

	animateBackspace();

  backgroundDraw();

  rageModeDraw();

  checkAchievements();


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
}