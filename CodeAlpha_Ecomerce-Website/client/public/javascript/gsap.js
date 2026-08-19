gsap.from(".container", {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: "power3.out",
  delay: 0.2,
});


gsap.from(".cart-item", {
  x: -30,
  opacity: 0,
  duration: 0.5,
  ease: "power3.out",
  stagger: 0.1,
});

gsap.from(".checkout-item", {
  y: 20,
  opacity: 0,
  duration: 0.5,
  ease: "power3.out",
  stagger: 0.1,
});

gsap.from(".navbar-brand a", {
  opacity: 0,
  x: -20,
  duration: 0.8,
  ease: "power3.out",
  delay: 0.3,
});

gsap.from(".navbar-links a", {
  opacity: 0,
  y: -10,
  duration: 0.5,
  ease: "power2.out",
  stagger: 0.1,
  delay: 0.4,
});

document.addEventListener("mouseover", (e) => {
  const button = e.target.closest(".btn");
  const image = e.target.closest(".product-card-img, .product-detail-img");

  if (button) {
    gsap.to(button, {
      scale: 1.05,
      duration: 0.2,
      ease: "power1.out",
    });
  }

  if (image) {
    gsap.to(image, {
      scale: 1.08,
      duration: 0.3,
      ease: "power1.out",
    });
  }
});

document.addEventListener("mouseout", (e) => {
  const button = e.target.closest(".btn");
  const image = e.target.closest(".product-card-img, .product-detail-img");

  if (button) {
    gsap.to(button, {
      scale: 1,
      duration: 0.2,
      ease: "power1.out",
    });
  }

  if (image) {
    gsap.to(image, {
      scale: 1,
      duration: 0.3,
      ease: "power1.out",
    });
  }
});

document.addEventListener("click", (e) => {
  const addButton = e.target.closest(".btn-primary");

  if (addButton && addButton.textContent.includes("Add to Cart")) {
    gsap.fromTo(
      addButton,
      { scale: 1 },
      {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      }
    );
  }
});

const cartBadge = document.getElementById("cart-badge");

if (cartBadge) {
  gsap.from(cartBadge, {
    scale: 0,
    duration: 0.5,
    ease: "back.out(1.7)",
  });
}