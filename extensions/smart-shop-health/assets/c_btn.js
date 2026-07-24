document.addEventListener("DOMContentLoaded", function () {
  const colors = [
    "#098098",
    "#456456",
    "#2ecb84",
    "#284283"
  ];

  const button = document.getElementById("color-btn");

  button.addEventListener("click", function () {
    const randomColor =
      colors[Math.floor(Math.random() * 4)];

    button.style.backgroundColor = randomColor;
  });
});