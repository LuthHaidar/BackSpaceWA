function animateBackspace() {
  const backspace = document.getElementById("backspace");
  backspace.classList.add("pressed");
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

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
