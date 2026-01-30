const params = new URLSearchParams(window.location.search);
const codigo = params.get("code");

if(!codigo){ window.location.href="../index.html"; }

let usados = JSON.parse(localStorage.getItem("ruletaUsados")) || [];
if(usados.includes(codigo)){
  alert("Este código ya fue usado.");
  window.location.href="../index.html";
}

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const girarBtn = document.getElementById("girarBtn");

// --- LÓGICA DE BOLSA DE PREMIOS ---
const premiosBase = ["10% EXTRA", "5% EXTRA", "$300 EXTRA", "$200 EXTRA"];
// Intentamos cargar la bolsa actual del almacenamiento para que no se resetee al recargar la página
let bolsaPremios = JSON.parse(localStorage.getItem("bolsaPremios")) || [];

// Si la bolsa está vacía, la llenamos y la mezclamos
if (bolsaPremios.length === 0) {
  bolsaPremios = [...premiosBase].sort(() => Math.random() - 0.5);
  localStorage.setItem("bolsaPremios", JSON.stringify(bolsaPremios));
}

// COLORES PARA LAS 10 SECCIONES VISUALES
const coloresSectores = [
  "#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", 
  "#e67e22", "#1abc9c", "#c0392b", "#d35400", "#27ae60"
];

const sectores = 10;
const anguloSector = (2 * Math.PI) / sectores;
let rotacion = 0;
let velocidad = 0;
let girando = false;
let acelerando = false;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centro = canvas.width / 2;
  for (let i = 0; i < sectores; i++) {
    const inicio = rotacion + i * anguloSector;
    const fin = inicio + anguloSector;
    ctx.beginPath();
    ctx.moveTo(centro, centro);
    ctx.arc(centro, centro, centro, inicio, fin);
    ctx.fillStyle = coloresSectores[i];
    ctx.fill();
  }
}

function loop() {
  if (girando) {
    rotacion += velocidad;
    if (acelerando) {
      velocidad += 0.007; 
      if (velocidad > 0.55) acelerando = false; 
    } else {
      velocidad *= 0.985;
    }
    
    if (velocidad < 0.001 && !acelerando) {
      velocidad = 0;
      girando = false;
      finalizarGiro();
    }
  }
  draw();
  requestAnimationFrame(loop);
}
loop();

girarBtn.onclick = () => {
  if (girando) return;
  girando = true;
  acelerando = true;
  velocidad = 0.01; 
  girarBtn.style.display = "none"; 
};

function finalizarGiro() {
  // Tomamos el primer premio de la bolsa (el que "toca" ahora)
  const premioGanado = bolsaPremios.shift(); 
  
  // Guardamos la bolsa actualizada (con un premio menos)
  localStorage.setItem("bolsaPremios", JSON.stringify(bolsaPremios));

  const contenedor = document.querySelector('.contenedor-premio');
  contenedor.style.width = "300px"; 
  contenedor.style.padding = "30px 20px";

  contenedor.innerHTML = `
    <h2 style="color: #ffd700; font-family: 'Great Vibes', cursive; font-size: 35px; margin-bottom: 10px; text-align: center;">¡Felicidades!</h2>
    <p style="color: white; font-family: 'Cinzel', serif; margin-bottom: 5px; font-size: 14px; text-align: center;">GANASTE:</p>
    <span id="premioExtra" style="display: block; font-size: 32px; color: white; font-family: 'Cinzel', serif; font-weight: bold; margin-bottom: 25px; text-shadow: 0 0 10px rgba(255,255,255,0.5); text-align: center;">${premioGanado}</span>
    
    <div style="
      color: white; 
      font-family: 'Cinzel', serif; 
      font-weight: bold; 
      font-size: 14px; 
      line-height: 1.6; 
      text-align: center;
      border-top: 1px solid rgba(255,215,0,0.3);
      padding-top: 15px;
    ">
      ¡SACA CAPTURA A ESTE BONO Y RECLAMA<br>
      EN LA LINEA DONDE CARGASTE!
    </div>

    <a href="../index.html" style="display: block; margin-top: 25px; color: #ffd700; text-decoration: none; font-size: 11px; font-family: 'Cinzel', serif; text-align: center;">VOLVER AL INICIO</a>
  `;

  document.getElementById("mensajePremio").classList.remove("hidden");
  usados.push(codigo);
  localStorage.setItem("ruletaUsados", JSON.stringify(usados));
}