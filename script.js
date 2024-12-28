const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 300; // Adjust for density of stars
let mouseVelocity = { x: 0, y: 0 }; // Track mouse movement speed
let lastMousePosition = { x: 0, y: 0 }; // Track the last mouse position

// Function to generate a random color (white, red, yellow, light blue)
function getRandomStarColor() {
  const colors = [
    "rgba(255, 255, 255, 1)", // White (most common)
    "rgba(255, 160, 160, 1)", // Soft red
    "rgba(255, 255, 160, 1)", // Soft yellow
    "rgba(160, 180, 255, 1)", // Soft light blue
  ];
  return Math.random() < 0.8 ? colors[0] : colors[Math.floor(Math.random() * colors.length)];
}

// Generate random stars
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.9, // Star size between 0.5 and 2.5
    color: getRandomStarColor(),
    brightness: Math.random() * 0.7 + 0.7, // Brightness between 0.5 and 1
  });
}

// Draw stars and connections on canvas
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the stars
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = star.color.replace("1)", `${star.brightness})`);
     ctx.animationDuration = `0.5s`;
    ctx.fill();
  });

  // Draw lines between close stars
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) { // Threshold for drawing lines
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`; // Fade line based on distance
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
      }
    }
  }
}

// Update star positions for animation
function updateStars() {
  stars.forEach(star => {
    // Update positions with velocity
    star.x = (star.x + mouseVelocity.x * 0.2 + canvas.width) % canvas.width; // Wrap horizontally
    star.y = (star.y + mouseVelocity.y * 0.2 + canvas.height) % canvas.height; // Wrap vertically
    star.brightness = Math.random() + 0.6*star.brightness // twinkle
/*    //doppler
    if (mouseVelocity.x > 15) {
      star.color = "blue";
    }
    else if (mouseVelocity.x < (-15)) {
      star.color = "red"
    }
    else {
      star.color = getRandomStarColor()
    }*/
  });
}

// Animation loop
function animate() {
  updateStars();
  drawStars();
  requestAnimationFrame(animate);
}

// Capture mouse movement
document.addEventListener("mousemove", (event) => {
  const currentMousePosition = { x: event.clientX, y: event.clientY };

  // Calculate velocity based on mouse movement
  mouseVelocity.x = currentMousePosition.x - lastMousePosition.x;
  mouseVelocity.y = currentMousePosition.y - lastMousePosition.y;

  lastMousePosition = currentMousePosition;
});

// Slow down movement gradually when mouse stops
setInterval(() => {
  mouseVelocity.x *= 0.95; // Gradual deceleration
  mouseVelocity.y *= 0.95;
}, 16); // Approximately 60 frames per second

// Adjust canvas on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawStars();
});

// Start the animation
animate();