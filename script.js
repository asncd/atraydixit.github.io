const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const stars = [];
const numStars = 300; // Adjust for density of stars
let mouseVelocity = { x: 0, y: 0 }; // Track mouse movement speed
let lastMousePosition = { x: 0, y: 0 }; // Track the last mouse position

function getRandomStar() {
  let r,g,b,s,l;
  const randoroll = Math.random()
  if (randoroll < 0.95) {
    r = 255;
    g = 255;
    b = Math.floor(Math.random() * 128)+128;
    s = Math.random() * 2 + 1.5;
    l = 0.6;
  } else if (randoroll < 0.98)  {
    r = 255;
    g = Math.floor(Math.random() * 128);
    b = Math.floor(Math.random() * 64);
    s = Math.random() * 2 + 0.9;
    l = 0.4;
  } else {
    r = Math.floor(Math.random() * 51)+51;
    g = Math.floor(Math.random() * 77)+127;
    b = 255;
    s = Math.random() * 2 + 2;
    l = 0.85;
  }


  return [`rgba(${r}, ${g}, ${b}, 1)`,s,l];
}

function starSeq() {
  const mainseqcolor = getRandomStar();

  const csb = [

    [mainseqcolor[0],mainseqcolor[1],mainseqcolor[2]], // White (most common)
    ["rgba(255, 100, 100, 1)",Math.random() * 2 + 3,0.9]  // red giant
  ];
  return Math.random() < 0.96 ? csb[0] : csb[1];
}


function createStars() {
  // Generate random stars
  stars.length = 0
  const numStars = canvas.width < 768 ? 200 : canvas.width < 1024 ? 300 : 400; // Adjust based on screen size
  for (let i = 0; i < numStars; i++) {
    const [c, s, b] = starSeq()
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: s,//Math.random() * 2 + 0.9, // Star size between 0.5 and 2.5
      color: c,//getRandomStarColor(),
      brightness: b//Math.random() * 0.7 + 0.7, // Brightness between 0.5 and 1
    });
  }
}

createStars();


// Draw stars and connections on canvas
function drawStars() {
  const dist = canvas.width < 768 ? 88 : canvas.width < 1024 ? 100 : 110; // Adjust based on screen size
  ctx.clearRect(0, 0, canvas.width, canvas.height);



  // Draw lines between close stars
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < dist) { // Threshold for drawing lines
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / dist})`; // Fade line based on distance
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  // Draw the stars
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = star.color.replace("1)", `${star.brightness})`);
     ctx.animationDuration = `0.5s`;
    ctx.fill();
  });
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
  createStars();
  drawStars();
});

// Start the animation
animate();