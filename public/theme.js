// Toggle Theme
document.querySelector("#themeSwitch").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};

// Load saved theme
if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}
