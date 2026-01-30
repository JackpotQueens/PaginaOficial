/* 🔐 VALIDACIÓN DE CÓDIGO */
const params = new URLSearchParams(window.location.search);
const codigo = params.get("code");

if(!codigo){ window.location.href="../index.html"; }

/* 🚫 Código solo una vez */
let usados = JSON.parse(localStorage.getItem("diamantesUsados")) || [];
if(usados.includes(codigo)){
  alert("Este código ya fue usado en Diamantes.");
  window.location.href="../index.html";
}

/* 🎁 PREMIOS ROTATIVOS */
const premiosDiamante = [
  "10% EXTRA",
  "15% EXTRA",
  "20% EXTRA",
  "$400 EXTRA",
  "$500 EXTRA",
  "$600 EXTRA",
  "$700 EXTRA"
];

let bolsaDiamantes = JSON.parse(localStorage.getItem("bolsaDiamantes")) || [];

if(bolsaDiamantes.length === 0){
  bolsaDiamantes = [...premiosDiamante].sort(() => Math.random() - 0.5);
  localStorage.setItem("bolsaDiamantes", JSON.stringify(bolsaDiamantes));
}

/* 🍉 FRUTAS VISUALES */
const frutas = ["🍓","🍒","🍋","🍎","🍊","🍐","🍉","🍇","🥝","🍍"];

/* 🎯 GENERAR SECUENCIA CONTROLADA */
function generarSecuencia(){

  const pool = [...frutas];

  const principal = pool.splice(Math.floor(Math.random()*pool.length),1)[0];
  const diferente1 = pool.splice(Math.floor(Math.random()*pool.length),1)[0];
  const diferente2 = pool.splice(Math.floor(Math.random()*pool.length),1)[0];

  return {
    principal,
    secuencia:[
      diferente1,
      principal,
      principal,
      diferente2,
      principal
    ]
  };
}

const ronda = generarSecuencia();
let paso = 0;
let clicks = 0;

const diamantes = document.querySelectorAll(".diamond");
const boxPremio = document.getElementById("resultadoSecuencia");

/* 💎 CLIC EN DIAMANTES */
diamantes.forEach(d => {

  d.addEventListener("click", () => {

    if(d.classList.contains("revealed")) return;
    if(clicks >= 5) return;

    const fruta = ronda.secuencia[paso];

    d.classList.add("revealed");
    d.innerHTML = `<span>${fruta}</span>`;

    paso++;
    clicks++;

    if(clicks === 5){
      finalizarJuego();
    }
  });
});


/* 🏆 MOSTRAR PREMIO */
function finalizarJuego(){

  const premio = bolsaDiamantes.shift();
  localStorage.setItem("bolsaDiamantes", JSON.stringify(bolsaDiamantes));

  if(bolsaDiamantes.length === 0){
    bolsaDiamantes = [...premiosDiamante].sort(() => Math.random() - 0.5);
    localStorage.setItem("bolsaDiamantes", JSON.stringify(bolsaDiamantes));
  }

  boxPremio.textContent = premio;

  document.getElementById("mensajePremio").classList.remove("hidden");

  usados.push(codigo);
  localStorage.setItem("diamantesUsados", JSON.stringify(usados));
}
