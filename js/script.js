"use strict";

/* ========================================
   Elements
======================================== */

const pageLoader = document.getElementById("pageLoader");
const navbar = document.getElementById("navbar");

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const navigationLinks = document.querySelectorAll(".nav-link");

const currentYear = document.getElementById("currentYear");
const cursorGlow = document.querySelector(".cursor-glow");

const typingText = document.getElementById("typingText");

const revealElements = document.querySelectorAll(
  ".reveal, .reveal-left"
);

const counterElements = document.querySelectorAll("[data-counter]");
const magneticElements = document.querySelectorAll(".magnetic");
const tiltCards = document.querySelectorAll(".tilt-card");

const canvas = document.getElementById("particleCanvas");
const context = canvas.getContext("2d");

/* ========================================
   Page loader
======================================== */

window.addEventListener("load", () => {
  setTimeout(() => {
    pageLoader.classList.add("hidden");
    document.body.classList.add("loaded");
  }, 750);
});

/* ========================================
   Current year
======================================== */

currentYear.textContent = new Date().getFullYear();

/* ========================================
   Mobile menu
======================================== */

function openMenu() {
  menuButton.classList.add("active");
  navLinks.classList.add("active");
  document.body.classList.add("menu-open");

  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close navigation menu");
}

function closeMenu() {
  menuButton.classList.remove("active");
  navLinks.classList.remove("active");
  document.body.classList.remove("menu-open");

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", () => {
  const menuIsOpen = navLinks.classList.contains("active");

  if (menuIsOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 850) {
    closeMenu();
  }
});

/* ========================================
   Navbar scroll effect
======================================== */

function updateNavbar() {
  if (window.scrollY > 35) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateNavbar);
updateNavbar();

/* ========================================
   Active navigation link
======================================== */

const sections = document.querySelectorAll("section[id], header[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navigationLinks.forEach((link) => {
        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === `#${entry.target.id}`) {
          link.classList.add("active");
        }
      });
    });
  },
  {
    threshold: 0.45,
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* ========================================
   Typing animation
======================================== */

const typingWords = [
  "machine learning models.",
  "data-driven applications.",
  "interactive dashboards.",
  "predictive systems.",
  "intelligent solutions."
];

let wordIndex = 0;
let characterIndex = 0;
let deleting = false;

function runTypingAnimation() {
  const currentWord = typingWords[wordIndex];

  if (!deleting) {
    typingText.textContent = currentWord.slice(
      0,
      characterIndex + 1
    );

    characterIndex += 1;

    if (characterIndex === currentWord.length) {
      deleting = true;

      setTimeout(runTypingAnimation, 1400);
      return;
    }

    setTimeout(runTypingAnimation, 65);
  } else {
    typingText.textContent = currentWord.slice(
      0,
      characterIndex - 1
    );

    characterIndex -= 1;

    if (characterIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;

      setTimeout(runTypingAnimation, 350);
      return;
    }

    setTimeout(runTypingAnimation, 32);
  }
}

runTypingAnimation();

/* ========================================
   Scroll reveal
======================================== */

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${(index % 4) * 0.08}s`;
  revealObserver.observe(element);
});

/* ========================================
   Animated counters
======================================== */

let countersStarted = false;

function animateCounters() {
  if (countersStarted) {
    return;
  }

  countersStarted = true;

  counterElements.forEach((counter) => {
    const target = Number(counter.dataset.counter);
    const duration = 1500;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        1 - Math.pow(1 - progress, 4);

      const value = Math.floor(target * easedProgress);

      counter.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
      }
    });
  },
  {
    threshold: 0.45,
  }
);

const heroSection = document.getElementById("home");
heroObserver.observe(heroSection);

/* ========================================
   Cursor glow
======================================== */

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (event) => {
    cursorGlow.style.opacity = "1";

    cursorGlow.style.transform =
      `translate(${event.clientX - 175}px, ${event.clientY - 175}px)`;
  });

  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });
}

/* ========================================
   Magnetic buttons
======================================== */

if (window.matchMedia("(pointer: fine)").matches) {
  magneticElements.forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rectangle = element.getBoundingClientRect();

      const x =
        event.clientX -
        rectangle.left -
        rectangle.width / 2;

      const y =
        event.clientY -
        rectangle.top -
        rectangle.height / 2;

      element.style.transform =
        `translate(${x * 0.14}px, ${y * 0.14}px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translate(0, 0)";
    });
  });
}

/* ========================================
   3D card tilt
======================================== */

if (window.matchMedia("(pointer: fine)").matches) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rectangle = card.getBoundingClientRect();

      const mouseX =
        event.clientX - rectangle.left;

      const mouseY =
        event.clientY - rectangle.top;

      const rotateY =
        ((mouseX / rectangle.width) - 0.5) * 10;

      const rotateX =
        ((mouseY / rectangle.height) - 0.5) * -10;

      card.style.transform =
        `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0)";
    });
  });
}

/* ========================================
   Animated particle background
======================================== */

let canvasWidth = 0;
let canvasHeight = 0;

let particles = [];
let mouse = {
  x: null,
  y: null,
};

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;

    this.size = Math.random() * 1.7 + 0.4;

    this.speedX =
      (Math.random() - 0.5) * 0.35;

    this.speedY =
      (Math.random() - 0.5) * 0.35;

    this.opacity =
      Math.random() * 0.35 + 0.15;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (
      this.x < 0 ||
      this.x > canvasWidth ||
      this.y < 0 ||
      this.y > canvasHeight
    ) {
      this.reset();
    }

    if (mouse.x !== null && mouse.y !== null) {
      const differenceX = mouse.x - this.x;
      const differenceY = mouse.y - this.y;

      const distance = Math.sqrt(
        differenceX * differenceX +
        differenceY * differenceY
      );

      if (distance < 120) {
        this.x -= differenceX * 0.003;
        this.y -= differenceY * 0.003;
      }
    }
  }

  draw() {
    context.beginPath();

    context.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    context.fillStyle =
      `rgba(0, 229, 255, ${this.opacity})`;

    context.fill();
  }
}

function resizeCanvas() {
  const devicePixelRatioValue =
    Math.min(window.devicePixelRatio || 1, 2);

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width =
    canvasWidth * devicePixelRatioValue;

  canvas.height =
    canvasHeight * devicePixelRatioValue;

  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  context.setTransform(
    devicePixelRatioValue,
    0,
    0,
    devicePixelRatioValue,
    0,
    0
  );

  createParticles();
}

function createParticles() {
  particles = [];

  const particleCount = Math.min(
    Math.floor((canvasWidth * canvasHeight) / 16000),
    85
  );

  for (let index = 0; index < particleCount; index += 1) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (
    let firstIndex = 0;
    firstIndex < particles.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < particles.length;
      secondIndex += 1
    ) {
      const firstParticle = particles[firstIndex];
      const secondParticle = particles[secondIndex];

      const differenceX =
        firstParticle.x - secondParticle.x;

      const differenceY =
        firstParticle.y - secondParticle.y;

      const distanceSquared =
        differenceX * differenceX +
        differenceY * differenceY;

      if (distanceSquared < 11000) {
        const opacity =
          1 - distanceSquared / 11000;

        context.beginPath();

        context.moveTo(
          firstParticle.x,
          firstParticle.y
        );

        context.lineTo(
          secondParticle.x,
          secondParticle.y
        );

        context.strokeStyle =
          `rgba(0, 229, 255, ${opacity * 0.07})`;

        context.lineWidth = 0.7;
        context.stroke();
      }
    }
  }
}

function animateParticles() {
  context.clearRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  connectParticles();

  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

resizeCanvas();
animateParticles();