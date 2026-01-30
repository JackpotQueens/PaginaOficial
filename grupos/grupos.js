/* ✅ GRUPOS.JS
   - reproduce solo videos visibles (optimización mobile)
   - abre modal al tocar el círculo
   - botón TG brilla si ese video está activo
*/

document.addEventListener("DOMContentLoaded", () => {
  const allVideos = document.querySelectorAll("video");

  allVideos.forEach(v => {
    v.muted = true;
    v.playsInline = true;
    v.autoplay = true;
    v.loop = true;
  });

  /* ✅ OPTIMIZACIÓN: reproducir solo visibles */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(()=>{});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });

  allVideos.forEach(video => observer.observe(video));

  /* ✅ MODAL */
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const cerrarBtn = document.getElementById("cerrarModal");
  const backdrop = document.querySelector(".modal-backdrop");
  const modalTgBtn = document.getElementById("modalTgBtn");

  function abrirModal(videoSrc, tgLink){
    modal.classList.remove("hidden");
    modalVideo.src = videoSrc;
    modalVideo.play().catch(()=>{});
    modalTgBtn.href = tgLink || "#";
  }

  function cerrarModal(){
    modal.classList.add("hidden");
    modalVideo.pause();
    modalVideo.src = "";
  }

  cerrarBtn.addEventListener("click", cerrarModal);
  backdrop.addEventListener("click", cerrarModal);
  document.addEventListener("keydown", (e)=> {
    if(e.key === "Escape") cerrarModal();
  });

  /* ✅ CLICK EN CIRCULOS */
  const circleCards = document.querySelectorAll(".circle-card");

  circleCards.forEach(card => {
    const btnVideo = card.querySelector(".circle-video");
    const tgBtn = card.querySelector(".btn-tg");
    const tgLink = card.dataset.tg;

    const vid = card.querySelector("video");
    if (vid) {
      vid.addEventListener("play", () => {
        circleCards.forEach(c => c.querySelector(".btn-tg")?.classList.remove("active-tg"));
        tgBtn.classList.add("active-tg");
      });
    }

    btnVideo.addEventListener("click", () => {
      const src = btnVideo.getAttribute("data-video");
      abrirModal(src, tgLink);
    });
  });
});
