import Vector from "./Vector2D.js";

const GRAVITY = new Vector(0, -981);
function* trackObjectPosition(properties) {
  const acceleration = properties.initialAcceleration.clone();
  const velocity = properties.initialVelocity.clone();
  const position = properties.initialPosition.clone();
  yield position;
  for (let i = 0; i < properties.lifeExpectancy; i++) {
    const thrust =
      i < properties.fuelAutonomy
        ? velocity
            .clone()
            .normalize()
            .multiply(properties.motorThrust * (1 - Math.exp(-i)))
        : Vector.NUL;
    const friction = velocity.clone().multiply(-properties.frictionCoefficient);
    acceleration.add(GRAVITY, thrust, friction);
    velocity.add(acceleration);
    position.add(velocity);
    yield position;
  }
  return { position, velocity, acceleration };
}

function displayForALimitedTime(ctx, x, y, width, clearRect, reminiscence) {
  ctx.beginPath();
  ctx.rect(x, y, width, 1);
  ctx.fill();
  setTimeout(clearRect, reminiscence, x, y, width, 1);
}

async function drawTrajectory(ctx, ballisticObject, width) {
  const clearRect = CanvasRenderingContext2D.prototype.clearRect.bind(ctx);
  return new Promise((resolve) => {
    const getPosition = trackObjectPosition(ballisticObject);

    let previousTimestamp;
    function nextFrame(timestamp) {
      for (let i = previousTimestamp || timestamp; i < timestamp; i++) {
        const { value: position, done } = getPosition.next();
        if (done) return resolve(position);
        displayForALimitedTime(
          ctx,
          position.x / 10 ** 9,
          position.y / 10 ** 9,
          width,
          clearRect,
          ballisticObject.reminiscence
        );
      }
      requestAnimationFrame(nextFrame);
      previousTimestamp = timestamp;
    }
    nextFrame();
  });
}

function spiderEffect({ position: initialPosition, velocity }) {
  return {
    initialPosition,
    initialVelocity: new Vector(0, velocity.y),
    initialAcceleration: new Vector(
      2 * (Math.random() - 0.5) * 10 ** 6,
      -GRAVITY.y * 1000
    ),
    lifeExpectancy: 800,
    fuelAutonomy: 0,
    motorThrust: 0,
    frictionCoefficient: Math.random() * 0.000_02 + 0.000_005,
    reminiscence: 100,
  };
}

const flex = document.createElement("div");
flex.style.display = "flex";

function launchFirework(ctx) {
  const skyRocket = {
    initialPosition: Vector.NUL,
    initialVelocity: Vector.NUL,
    initialAcceleration: new Vector(
      ((Math.random() * 10 + 15) % 20) - 10, // [-10, -5]U[5, 10]
      GRAVITY.y * -1.2
    ),
    reminiscence: 200,
    lifeExpectancy: 1000,
    fuelAutonomy: 600,
    motorThrust: GRAVITY.y * -3,
    frictionCoefficient: Math.random() * 0.000_015 + 0.000_005,
  };

  return drawTrajectory(ctx, skyRocket, 5)
    .then((previousState) =>
      Promise.all(
        Array.from({ length: Math.random() * 10 }, () =>
          drawTrajectory(ctx, spiderEffect(previousState), 2)
        )
      )
    )
    .catch(console.error);
}

const delay = (delay) => new Promise((done) => setTimeout(done, delay));

requestIdleCallback(() => {
  const canvas = document.createElement("canvas");
  canvas.height = 500;
  canvas.width = 999;
  flex.append(canvas);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, -1, canvas.width / 2, canvas.height);
  Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      delay(Math.random() * 50 + i * 200).then(() => launchFirework(ctx))
    )
  ).then((...args) => {
    canvas.style.transformOrigin = "top";
    canvas.addEventListener("animationend", () => canvas.remove());
    canvas.animate(
      [
        {
          opacity: 1,
          transform: "none",
        },
        { opacity: 0, transform: "translateY(50px) scaleY(1.5)" },
      ],
      {
        delay: 1000,
        duration: 3800,
      }
    );
  });

  document.body.append(flex);
});
