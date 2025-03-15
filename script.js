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

    [mainseqcolor[0],mainseqcolor[1],mainseqcolor[2]], // White (most common) hardcoded it all to 1
    ["rgba(255, 100, 100, 1)",Math.random() * 2 + 3,0.9]  // red giant lum=0.9
  ];
  return Math.random() < 0.97 ? csb[0] : csb[1];
}


function createStars() {
  // Generate random stars
  stars.length = 0
  const numStars = canvas.width < 768 ? 200 : canvas.width < 1024 ? 300 : 400; // Adjust based on screen size
  for (let i = 0; i < numStars; i++) {
    const [c, s, b] = starSeq()
    const twinkles = Math.random() * 0.01 + 0.0; // Twinkle speed (0.01-0.03)
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1.1*s,//Math.random() * 2 + 0.9, // Star size between 0.5 and 2.5
      color: c,//getRandomStarColor(),
      brightness: 1.0*b,//Math.random() * 0.7 + 0.7, // Brightness between 0.5 and 1
      twinkleSpeed: twinkles//Math.random() * 0.7 + 0.7, // Brightness between 0.5 and 1

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
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - (distance / (1.25*dist))})`; // Fade line based on distance
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  // Draw the stars
  stars.forEach(star => {

    // Update alpha for twinkling
    star.brightness += star.twinkleSpeed;
    if (star.brightness > 1 || star.brightness < 0.5) {
      star.twinkleSpeed *= -1; // Reverse direction if too bright or dim
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        let gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
    gradient.addColorStop(0, star.color.replace("1)", `${star.brightness})`));  // Bright center
    gradient.addColorStop(0.8, "rgba(0.9, 0.9, 0.9, 0.9)");  // Fades into space
    gradient.addColorStop(1, "rgba(0.25, 0.25, 0.25, 0.25)");  // Fades into space

    ctx.fillStyle = gradient;
     ctx.animationDuration = `0.5s`;
    ctx.fill();

  });



}


// Update star positions for animation
function updateStars() {
  stars.forEach(star => {
    // Update positions with velocity
//    star.x = (star.x + mouseVelocity.x * 0.2 + canvas.width) % canvas.width; // Wrap horizontally
//    star.y = (star.y + mouseVelocity.y * 0.2 + canvas.height) % canvas.height; // Wrap vertically

    let speedFactor = (star.brightness - 0.5) *4;  // Closer stars move faster
    star.x = (star.x + mouseVelocity.x * 0.1 * speedFactor + canvas.width) % canvas.width;
    star.y = (star.y + mouseVelocity.y * 0.1 * speedFactor + canvas.height) % canvas.height;


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

const constellations = [];

// When user clicks, create a temporary constellation
document.addEventListener("click", (event) => {
    let constellation = [];
    let clickX = event.clientX;
    let clickY = event.clientY;

    // Find the 5 closest stars to the click position
    let sortedStars = [...stars] // Create a copy to avoid modifying the original
        .map(star => ({
            x: star.x,
            y: star.y,
            distance: Math.hypot(star.x - clickX, star.y - clickY), // Distance from click
            alpha: 1.0 // Opacity for fading effect
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10); // Get the 10 closest stars

    if (sortedStars.length > 1) {
        constellations.push(sortedStars);
    }
});

function drawConstellations() {
    for (let i = constellations.length - 1; i >= 0; i--) {
        let constellation = constellations[i];
        if (constellation.length > 1) {
            let edges = [];
            
            // Generate potential edges
            for (let j = 0; j < constellation.length; j++) {
                for (let k = j + 1; k < constellation.length; k++) {
                    const star1 = constellation[j];
                    const star2 = constellation[k];
                    const distance = Math.hypot(star2.x - star1.x, star2.y - star1.y);
                    edges.push({ star1, star2, distance });
                }
            }

            // Gabriel Graph: Remove edges that aren't shortest paths
            let validEdges = [];
            for (let edge of edges) {
                let midpoint = {
                    x: (edge.star1.x + edge.star2.x) / 2,
                    y: (edge.star1.y + edge.star2.y) / 2
                };

                let blocked = edges.some(other => {
                    if (other === edge) return false;
                    let distToMid = Math.hypot(other.star1.x - midpoint.x, other.star1.y - midpoint.y);
                    return distToMid < edge.distance / 2;
                });

                if (!blocked) validEdges.push(edge);
            }

            // Draw edges
            for (let { star1, star2, distance } of validEdges) {
                const minDist = 10, maxDist = 150;
                const normalizedDist = Math.min(Math.max(distance, minDist), maxDist);
                const thickness = 3 - (normalizedDist / maxDist) * 2;
                const brightness = 1.2 - (normalizedDist / maxDist) * 0.8;
                const colorIntensity = Math.floor(255 - (normalizedDist / maxDist) * 100);
                const color = `rgba(255, ${colorIntensity}, ${255}, ${star1.alpha * brightness})`;

                ctx.beginPath();
                ctx.moveTo(star1.x, star1.y);
                ctx.lineTo(star2.x, star2.y);
                ctx.strokeStyle = color;
                ctx.lineWidth = thickness;
                ctx.stroke();
            }
        }

        // Fade out constellations
        constellation.forEach(star => (star.alpha -= 0.008));
        if (constellation[0].alpha <= 0) constellations.splice(i, 1);
    }
}

// Ensure this function is called inside animate()
function animate() {
    updateStars();
    drawStars();
    drawConstellations(); // 🔥 Make sure constellations are drawn
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