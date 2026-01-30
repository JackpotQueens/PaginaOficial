/* 🔐 VALIDACIÓN DE CÓDIGO DESDE LA SALA */
const params = new URLSearchParams(window.location.search);
const codigo = params.get("code");

if(!codigo){ window.location.href="../index.html"; }

/* 🚫 EVITAR REUTILIZACIÓN */
let usados = JSON.parse(localStorage.getItem("regaloUsados")) || [];
if(usados.includes(codigo)){
  alert("Este código ya fue usado en la Caja Sorpresa.");
  window.location.href="../index.html";
}

/* 🎁 BOLSA DE PREMIOS (6 REGALOS) */
const premiosCaja = [
  "10% EXTRA",
  "5% EXTRA",
  "$200 EXTRA",
  "$300 EXTRA",
  "$400 EXTRA",
  "$500 EXTRA"
];

let bolsaRegalo = JSON.parse(localStorage.getItem("bolsaRegalo")) || [];

if(bolsaRegalo.length === 0){
  bolsaRegalo = [...premiosCaja].sort(() => Math.random() - 0.5);
  localStorage.setItem("bolsaRegalo", JSON.stringify(bolsaRegalo));
}

/* ----------------------- */
/*  BOTÓN ABRIR CAJA      */
/* ----------------------- */

const abrirBtn = document.getElementById("abrirBtn");

abrirBtn.onclick = () => {

  abrirBtn.style.display = "none";

  setTimeout(finalizarApertura, 1200);
};

function finalizarApertura(){

  const premio = bolsaRegalo.shift();
  localStorage.setItem("bolsaRegalo", JSON.stringify(bolsaRegalo));

  document.getElementById("premioExtra").textContent = premio;

  document.getElementById("mensajePremio").classList.remove("hidden");

  usados.push(codigo);
  localStorage.setItem("regaloUsados", JSON.stringify(usados));
}
