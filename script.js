// Simple Slideshow
document.addEventListener("DOMContentLoaded", () => {
  // Hamburger menu toggle (if you use the CSS-only menu, this is not needed)
  // ...existing code...

  let slideIndex = 1;
  showSlides(slideIndex);

  function showSlides(n) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    if (slides.length === 0) return;
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove("active"));
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].classList.add("active");
  }

  function plusSlides(n) {
    showSlides(slideIndex += n);
  }

  function currentSlide(n) {
    showSlides(slideIndex = n);
  }

  // Event listeners for arrows
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  if (prev && next) {
    prev.addEventListener("click", () => plusSlides(-1));
    next.addEventListener("click", () => plusSlides(1));
  }

  // Event listeners for dots
  document.querySelectorAll(".dot").forEach((dot, idx) => {
    dot.addEventListener("click", () => currentSlide(idx + 1));
  });
});