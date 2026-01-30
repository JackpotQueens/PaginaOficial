const cards = document.querySelectorAll(".card");
let angle = 0;
let autoRotate = true;
let isDragging = false;
let startX = 0;

const radius = 320;
const total = cards.length;

// ✅ CONTROL: evita recalcular activo todo el tiempo
let activeIndex = -1;
let lastActiveCard = null;

/* ✅ VIDEO CONTROL: reproduce solo el del frente */
function setActiveCard(card) {
  if (lastActiveCard === card) return; // no repite si ya es el mismo

  // pausa el anterior
  if (lastActiveCard) {
    const prevVideo = lastActiveCard.querySelector("video");
    if (prevVideo) {
      prevVideo.pause();
      // NO reiniciamos el video, así no tilda
    }
    lastActiveCard.classList.remove("active");
  }

  // activa el nuevo
  lastActiveCard = card;
  if (lastActiveCard) {
    lastActiveCard.classList.add("active");
    const video = lastActiveCard.querySelector("video");
    if (video) {
      video.play().catch(() => {});
    }
  }
}

/* CARRUSEL */
function animate() {
  if (autoRotate && !isDragging) angle += 0.25;

  let bestZ = -999999;
  let bestCard = null;
  let bestI = -1;

  cards.forEach((card, i) => {
    const a = angle + i * (360 / total);
    const rad = a * Math.PI / 180;

    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius;

    card.style.transform = `
      translateX(${x}px)
      translateZ(${z}px)
      translateX(-50%)
      scale(${z > 0 ? 1 : 0.85})
    `;
    card.style.opacity = z > 0 ? 1 : 0.45;

    // ✅ detecta la carta más al frente (mayor z)
    if (z > bestZ) {
      bestZ = z;
      bestCard = card;
      bestI = i;
    }
  });

  // ✅ Cambia activo solo si realmente cambió
  if (bestI !== activeIndex) {
    activeIndex = bestI;
    setActiveCard(bestCard);
  }

  requestAnimationFrame(animate);
}
animate();

/* HOVER */
cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    autoRotate = false;
    setActiveCard(card);
  });

  card.addEventListener("mouseleave", () => {
    autoRotate = true;
  });

  card.addEventListener("click", () => {
    location.href = card.dataset.link;
  });
});

/* DRAG MOUSE */
document.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.clientX;
  autoRotate = false;
});
document.addEventListener("mousemove", e => {
  if (isDragging) {
    angle += (e.clientX - startX) * 0.15;
    startX = e.clientX;
  }
});
document.addEventListener("mouseup", () => {
  isDragging = false;
  autoRotate = true;
});

/* TOUCH */
document.addEventListener("touchstart", e => {
  isDragging = true;
  startX = e.touches[0].clientX;
  autoRotate = false;
}, { passive: true });

document.addEventListener("touchmove", e => {
  if (isDragging) {
    angle += (e.touches[0].clientX - startX) * 0.15;
    startX = e.touches[0].clientX;
  }
}, { passive: true });

document.addEventListener("touchend", () => {
  isDragging = false;
  autoRotate = true;
});

/* BRILLOS SUTILES */
const canvas = document.getElementById("goldParticles");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = Array.from({ length: 45 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.4 + 0.6,
  s: Math.random() * 0.4 + 0.25,
  o: Math.random() * 0.35 + 0.15
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,215,150,${p.o})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.y += p.s;
    if (p.y > canvas.height) {
      p.y = 0;
      p.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();
