import { Body } from "./body";
import { addVecs, scaleVec } from "./vec";

const Fg = (mass: number) => {
    return mass * 9.8;
};

type bound = {
    x: { min: number; max: number };
    y: { min: number; max: number };
};

function findElasticCollisionVelocities(body1: Body, body2: Body) {
    const m1 = body1.mass;
    const m2 = body2.mass;
    const vi1 = body1.velocity;
    const vi2 = body2.velocity;

    const vf1 = {
        x: ((m1 - m2) * vi1.x + 2 * m2 * vi2.x) / (m1 + m2),
        y: ((m1 - m2) * vi1.y + 2 * m2 * vi2.y) / (m1 + m2),
    };

    const vf2 = {
        x: ((m2 - m1) * vi2.x + 2 * m1 * vi1.x) / (m1 + m2),
        y: ((m2 - m1) * vi2.y + 2 * m1 * vi1.y) / (m1 + m2),
    };

    return { vf1, vf2 };
}

function detectCircularCollision(body1: Body, body2: Body) {
    const distance = Math.sqrt(
        (body1.position.x - body2.position.x) ** 2 +
            (body1.position.y - body2.position.y) ** 2
    );

    return distance < body1.radius + body2.radius;
}

function findPOI1dStaticLinear(
    velComponent: number,
    initialPos: number,
    radius: number,
    staticPoint: number
): number {
    return (
        (staticPoint -
            (initialPos < staticPoint ? radius : -radius) -
            initialPos) /
        velComponent
    );
}

interface WallCollisionOptions {
    wallDirection: "vert" | "horiz";
    x?: number;
    y?: number;
}

function wallCollisionResolution(body: Body, options: WallCollisionOptions) {
    const wallDirection = options.wallDirection;
    const wallAxisPos = wallDirection === "vert" ? options.x! : options.y!;

    const bodyAxisVel =
        wallDirection === "vert" ? body.velocity.x : body.velocity.y;
    const bodyAxisPos =
        wallDirection === "vert" ? body.position.x : body.position.y;

    const prevPos = bodyAxisPos - bodyAxisVel * body._prevDt;
    const timeToCollision = findPOI1dStaticLinear(
        bodyAxisVel,
        prevPos,
        body.radius,
        wallAxisPos
    );

    const afterCollision =
        wallAxisPos +
        (prevPos < wallAxisPos ? -body.radius : body.radius) -
        bodyAxisVel * (body._prevDt - timeToCollision);

    if (wallDirection === "vert") {
        body.position.x = afterCollision;
        body.velocity.x = -body.velocity.x;
    } else {
        body.position.y = afterCollision;
        body.velocity.y = -body.velocity.y;
    }
}

function findPOIBodies(body1: Body, body2: Body): number {
    const deltaX = body1.position.x - body2.position.x;
    const deltaY = body1.position.y - body2.position.y;

    const deltaVx = body1.velocity.x - body2.velocity.x;
    const deltaVy = body1.velocity.y - body2.velocity.y;

    const a = deltaVx ** 2 + deltaVy ** 2;
    const b = 2 * (deltaX * deltaVx + deltaY * deltaVy);
    const c = deltaX ** 2 + deltaY ** 2 - (body1.radius + body2.radius) ** 2;

    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) return -1;

    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    return Math.min(t1, t2);
}

// down is a positive force in y dir
// right is a positive force in x dir
export class Simulator {
    bodies: Body[] = [];
    boundaries: bound;
    gravityOn: boolean = true;
    timeMultiplier: number = 1;

    constructor(
        bodies: Body[],
        boundaries: bound,
        gravityOn: boolean = true,
        timeMultiplier: number = 1
    ) {
        this.bodies = bodies;
        this.boundaries = boundaries;
        this.gravityOn = gravityOn;
        this.timeMultiplier = timeMultiplier;
    }

    updateVelocities(dt: number) {
        const gravityGenerators = this.bodies.filter(
            (body) => body.generateGravity
        );

        for (const body of this.bodies) {
            for (const generator of gravityGenerators) {
                if (generator === body) continue;
                const gravity = body.findGeneratedGravity(generator);
                body.applyForce(gravity);
            }

            if (this.gravityOn) body.applyForce({ x: 0, y: Fg(body.mass) });

            body.updateVelocity(dt);
        }
    }

    updatePositions(dt: number) {
        for (const body of this.bodies) {
            body.updatePosition(dt);
        }
    }

    resetAccelerations() {
        for (const body of this.bodies) {
            body.resetAcceleration();
        }
    }

    resolveCollisions() {
        for (const body1 of this.bodies) {
            const dt = body1._prevDt;
            for (const body2 of this.bodies) {
                if (body1 === body2) continue;

                const prevLoc1 = addVecs(
                    body1.position,
                    scaleVec(body1.velocity, -dt)
                );
                const prevLoc2 = addVecs(
                    body2.position,
                    scaleVec(body2.velocity, -dt)
                );

                const body1OgFinalPos = { ...body1.position };
                const body2OgFinalPos = { ...body2.position };

                body1.position = prevLoc1;
                body2.position = prevLoc2;

                const timeToCollision = findPOIBodies(body1, body2);
                if (timeToCollision < 0 || timeToCollision > dt) {
                    body1.position = body1OgFinalPos;
                    body2.position = body2OgFinalPos;
                    continue;
                }

                const { vf1, vf2 } = findElasticCollisionVelocities(
                    body1,
                    body2
                );

                body1.updatePosition(timeToCollision);
                body2.updatePosition(timeToCollision);

                body1.velocity = vf1;
                body2.velocity = vf2;

                body1.updatePosition(dt - timeToCollision);
                body2.updatePosition(dt - timeToCollision);
            }
        }
    }

    step(dt: number) {
        const substeps = 6;
        dt *= this.timeMultiplier;
        dt = dt / substeps;

        for (let i = 0; i < substeps; i++) {
            this.updateVelocities(dt);
            this.updatePositions(dt);
            this.resolveCollisions();
            this.resetAccelerations();
            this.checkBoundaries();
        }
    }

    checkBoundaries() {
        for (const body of this.bodies) {
            if (body.position.x - body.radius < this.boundaries.x.min) {
                wallCollisionResolution(body, {
                    wallDirection: "vert",
                    x: this.boundaries.x.min,
                });
            }
            if (body.position.x + body.radius > this.boundaries.x.max) {
                wallCollisionResolution(body, {
                    wallDirection: "vert",
                    x: this.boundaries.x.max,
                });
            }

            if (body.position.y - body.radius < this.boundaries.y.min) {
                wallCollisionResolution(body, {
                    wallDirection: "horiz",
                    y: this.boundaries.y.min,
                });
            }

            if (body.position.y + body.radius > this.boundaries.y.max) {
                wallCollisionResolution(body, {
                    wallDirection: "horiz",
                    y: this.boundaries.y.max,
                });
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, pixelsPerMeter: number = 10) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (const body of this.bodies) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(
                body.position.x * pixelsPerMeter,
                body.position.y * pixelsPerMeter,
                body.radius * pixelsPerMeter,
                0,
                2 * Math.PI
            );
            ctx.closePath();
            ctx.fill();
        }
    }

    toggleGravity() {
        this.gravityOn = !this.gravityOn;
    }
}
