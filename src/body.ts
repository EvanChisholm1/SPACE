import { Vec2d, addVecs, scaleVec, subVecs, normalizeVec } from "./vec";

function universalGravitation(m1: number, m2: number, r: number): number {
    const G = 6.674 * 10 ** -11;
    return (G * m1 * m2) / r ** 2;
}

export class Body {
    position: Vec2d;
    velocity: Vec2d;
    acceleration: Vec2d;
    mass: number = 1;
    radius: number = 1;
    generateGravity: boolean = false;

    constructor(
        position: Vec2d,
        velocity: Vec2d,
        mass: number = 1,
        radius: number = 1,
        generateGravity: boolean = false
    ) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = { x: 0, y: 0 };
        this.mass = mass;
        this.radius = radius;
        this.generateGravity = generateGravity;
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

    findGeneratedGravity(otherBody: Body): Vec2d {
        const deltaPos = subVecs(otherBody.position, this.position);
        const radius = Math.sqrt(deltaPos.x ** 2 + deltaPos.y ** 2);

        const force = universalGravitation(this.mass, otherBody.mass, radius);

        const gravity = scaleVec(normalizeVec(deltaPos), force);

        return gravity;
    }
}

export class StaticBody extends Body {
    generateGravity: boolean = false;
    constructor(
        position: Vec2d,
        mass: number,
        radius: number = 1,
        generateGravity = false
    ) {
        super(position, { x: 0, y: 0 }, mass, radius);
        this.generateGravity = generateGravity;
    }

    applyForce(force: Vec2d) {
        // do nothing
        return;
    }

    updatePosition(dt: number): void {
        return;
    }

    updateVelocity(dt: number): void {
        return;
    }

    update(dt: number): void {
        return;
    }
}
