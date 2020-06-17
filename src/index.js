import fire from "./fireworks.js";

const maxNumberOfRocketPerCanvas = 20;
const delayBetweenRockets = 250;

function launchRocketsAfterRandomDelay() {
  const canvas = fire(
    Math.random() * maxNumberOfRocketPerCanvas,
    delayBetweenRockets
  );
  canvas.style.top =
    (Math.random() * document.documentElement.clientHeight) / 3 + "px";
  canvas.style.left =
    Math.random() * (document.documentElement.clientWidth - canvas.width) +
    "px";
  document.body.append(canvas);
  setTimeout(
    launchRocketsAfterRandomDelay,
    Math.random() * maxNumberOfRocketPerCanvas * delayBetweenRockets + 500
  );
}

launchRocketsAfterRandomDelay();
