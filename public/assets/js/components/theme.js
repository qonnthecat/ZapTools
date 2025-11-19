export function initTheme() {
  const btn = document.getElementById("theme-toggle");

  function update() {
    if (localStorage.theme === "dark") {
      document.body.classList.add("dark");
      btn.textContent = "☀️";
    } else {
      document.body.classList.remove("dark");
      btn.textContent = "🌙";
    }
  }

  update();

  btn.addEventListener("click", () => {
    localStorage.theme = localStorage.theme === "dark" ? "light" : "dark";
    update();
  });
}