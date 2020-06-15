import Vector from "./Vector2D.js";

const GRAVITY = new Vector(0, -9.81);
interface BallisticProperties {
  initialPosition: Vector;
  initialVelocity: Vector;
  initialAcceleration: Vector;
  mass: number;
  airFrictionCoefficient: number;
  trailLength: number;
}

function* trackObjectPosition(properties: BallisticProperties) {
  const acceleration = properties.initialAcceleration.clone();
  const velocity = properties.initialVelocity.clone();
  const position = properties.initialPosition.clone();
  while (velocity.isNotNull()) {
    acceleration
      .add(GRAVITY.multiply(properties.mass))
      .add(velocity.multiply(-properties.airFrictionCoefficient));
    velocity.add(acceleration);
    position.add(velocity);
    yield position;
  }
}

function launchFirework() {
  const skyRocket: BallisticProperties = {
    initialPosition: new Vector(0, 0),
    initialVelocity: new Vector(0, 0),
    initialAcceleration: new Vector(1, 90),
    mass: 1,
    airFrictionCoefficient: 1,
    trailLength: 10,
  };

  for (const position of trackObjectPosition(skyRocket)) {
    console.log(position);
  }
}
