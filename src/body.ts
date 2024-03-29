import { Vec2d, addVecs, scaleVec } from "./vec";

export class Body {
    position: Vec2d;
    velocity: Vec2d;
    acceleration: Vec2d;
    mass: number = 1;
    radius: number = 1;

    constructor(
        position: Vec2d,
        velocity: Vec2d,
        mass: number = 1,
        radius: number = 1
    ) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = { x: 0, y: 0 };
        this.mass = mass;
        this.radius = radius;
    }

    resetAcceleration() {
        this.acceleration = { x: 0, y: 0 };
    }

    applyForce(force: Vec2d) {
        this.acceleration = addVecs(this.acceleration, {
            x: force.x / this.mass,
            y: force.y / this.mass,
        });
    }

    updatePosition(dt: number) {
        this.position = addVecs(this.position, scaleVec(this.velocity, dt));
    }

    updateVelocity(dt: number) {
        this.velocity = addVecs(this.velocity, scaleVec(this.acceleration, dt));
    }

    update(dt: number) {
        this.updateVelocity(dt);
        this.updatePosition(dt);
        this.resetAcceleration();
    }
}
