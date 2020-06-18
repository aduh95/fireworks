# Fireworks animation

This is a simple firework animation using HTML5 Canvas (and a bit of maths).

[Demo](https://aduh95.github.io/fireworks/)

### Usage

```js
import fireworks from "https://aduh95.github.io/fireworks/src/fireworks.js";

const numberOfRocketToLaunch = 5;
const delayBetweenRocketInMilliseconds = 200;
const scale = 1; // Canvas of 1000x1000

const figure = document.createElement("figure");
const figcaption = document.createElement("figcaption");
figcaption.append("Canvas displaying a fireworks show.");
figure.append(
  fireworks(numberOfRocketToLaunch, delayBetweenRocketInMilliseconds, scale),
  figcaption
);

document.body.append(figure);
```

Note: the canvas gets deleted at the end of the animation.

You can also use the other exported functions of `fireworks.js` to customize the
show.
