const toggle = document.querySelector(".nav-toggle");
const closeBtn = document.querySelector(".nav-close");
const nav = document.querySelector(".main-nav");

function openNav() {
  toggle.setAttribute("aria-expanded", "true");
  toggle.style.visibility = "hidden";
  nav.classList.add("is-open");
  document.body.style.overflow = "hidden";
  closeBtn?.focus();
}

function closeNav() {
  toggle.setAttribute("aria-expanded", "false");
  toggle.style.visibility = "visible";
  nav.classList.remove("is-open");
  document.body.style.overflow = "";
  toggle?.focus();
}

if (toggle && nav) {
  toggle.addEventListener("click", openNav);
  closeBtn?.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) closeNav();
  });

  // Close when a nav link is clicked (navigating away)
  nav.querySelectorAll(".main-nav__link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}
