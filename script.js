const scrollButton = document.getElementById("scrollButton");

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

if (scrollButton) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300)
      scrollButton.style.display = "flex";
    else
      scrollButton.style.display = "none";
  });
  scrollButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});}

if (hamburger && mobileNav) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("active");
    }
  });
}

function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".mobile-nav a, nav a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html") ||
      (currentPage === "/" && linkPage === "index.html")
    ) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
    }
  });
}

highlightActiveNav();

if (typeof gsap !== "undefined" && document.querySelector(".timeline")) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".timeline-title", {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".timeline-title",
      start: "top 80%",
    },
  });

  gsap.to(".timeline::before", {
    height: "100%",
    duration: 2,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".timeline",
      start: "top 60%",
      end: "bottom 40%",
      scrub: 1,
    },
  });

  gsap.utils.toArray(".timeline-item").forEach((item, index) => {
    if (index % 2 === 0) {
      gsap.set(item, { x: -50 });
    } else {
      gsap.set(item, { x: 50 });
    }

    gsap.to(item, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: item,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

let currentIndex = 0;
const carousel = document.getElementById("carousel");
const cards = document.querySelectorAll(".book-card");
const dotsContainer = document.getElementById("dots");

let dimensions = {
  cardWidth: 0,
  containerWidth: 0,
  totalWidth: 0,
  maxOffset: 0,
  maxSlides: 0,
};

function calculateDimensions() {
  if (cards.length >= 2) {
    dimensions.cardWidth = cards[1].offsetLeft - cards[0].offsetLeft;
  } else {
    dimensions.cardWidth = cards[0]?.offsetWidth || 280;
  }

  dimensions.containerWidth = carousel.parentElement.offsetWidth;

  const lastCard = cards[cards.length - 1];
  dimensions.totalWidth = lastCard.offsetLeft + lastCard.offsetWidth;

  dimensions.maxOffset = Math.max(
    0,
    dimensions.totalWidth - dimensions.containerWidth
  );

  if (dimensions.totalWidth <= dimensions.containerWidth) {
    dimensions.maxSlides = 0;
  } else {
    const normalSlides = Math.ceil(dimensions.maxOffset / dimensions.cardWidth);

    const lastSlideMovement =
      dimensions.maxOffset - (normalSlides - 1) * dimensions.cardWidth;

    const threshold = dimensions.cardWidth * 0.3;

    if (lastSlideMovement < threshold && normalSlides > 1) {
      dimensions.maxSlides = normalSlides - 1;
    } else {
      dimensions.maxSlides = normalSlides;
    }
  }
}

function createDots() {
  dotsContainer.innerHTML = "";

  if (dimensions.maxSlides === 0) return;

  for (let i = 0; i <= dimensions.maxSlides; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
}

function moveCarousel(direction) {
  if (dimensions.maxSlides === 0) return;

  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = dimensions.maxSlides;
  } else if (currentIndex > dimensions.maxSlides) {
    currentIndex = 0;
  }

  updateCarousel();
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

function updateCarousel() {
  if (currentIndex > dimensions.maxSlides) {
    currentIndex = dimensions.maxSlides;
  }

  let offset;

  if (currentIndex === dimensions.maxSlides) {
    offset = dimensions.maxOffset;
  } else {
    offset = currentIndex * dimensions.cardWidth;
    offset = Math.min(offset, dimensions.maxOffset);
  }

  carousel.style.transform = `translateX(-${offset}px)`;

  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

cards.forEach((card) => {
  card.addEventListener("click", function (e) {
    if (e.target.closest(".carousel-button")) return;

    this.classList.toggle("flipped");
  });
});

calculateDimensions();
createDots();
updateCarousel();

window.addEventListener("resize", () => {
  calculateDimensions();
  createDots();
  updateCarousel();
});
