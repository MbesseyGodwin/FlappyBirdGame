// Constants for various game settings
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

let gamePlaying = false; // Flag to indicate whether the game is currently active
let difficulty = "simple"; // Default game difficulty
let speed = 3.2; // Speed of pipes moving from right to left for simple mode
const gravity = 0.5; // Gravity value affecting bird's flight
const size = [51, 36]; // Size of the bird
const jump = -11.5; // Jump strength of the bird
const cTenth = canvas.width / 10; // Tenth of the canvas width for positioning

let index = 0, // Index for animation frames
  bestScore = 0, // Best score achieved
  flight, // Bird's current flight
  flyHeight, // Bird's current height
  currentScore, // Current score
  pipes; // Array to hold pipe coordinates

// Pipe settings
const pipeWidth = 78;
const pipeGap = 270;

// Function to randomly generate pipe location
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth;

// Setup function to initialize game parameters
const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2;
  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
};

// Render function to update game elements and draw them on canvas
const render = () => {
  index++;

  // Draw background
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(index * (speed / 2)) % canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  // Draw pipes and handle collisions
  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
      }

      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  // Draw bird and handle its movement
  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2;
  }

  // Display scores and text
  ctx.fillText(`SCORE : ${currentScore}`, 125, 50);
  // ctx.fillText('Click to play', 90, 535);
  ctx.font = "bold 30px courier";
  // Set the fill color
  ctx.fillStyle = "white";

  document.getElementById("bestScore").innerHTML = `Best : ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Current : ${currentScore}`;

  // Request next animation frame
  window.requestAnimationFrame(render);
};

// Setup initial game state and start rendering
setup();
img.onload = render;

// Start game on click
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);

// Update game difficulty based on user selection
document.getElementById("difficulty").addEventListener("change", (event) => {
  difficulty = event.target.value;
  if (difficulty === "hard") {
    speed = 5.2; // Adjust speed for hard mode
  } else if (difficulty === "master") {
    speed = 10.2; // Adjust speed for hard mode
  } else {
    speed = 3.2; // Default speed for simple mode
  }
});
