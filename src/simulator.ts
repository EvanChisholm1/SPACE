import { Body } from "./body";
import { addVecs, scaleVec } from "./vec";
import {
    findPOIBodies,
    findElasticCollisionVelocities,
    wallCollisionResolution,
} from "./collisions";

const Fg = (mass: number) => {
    return mass * 9.8;
};

type bound = {
    x: { min: number; max: number };
    y: { min: number; max: number };
};

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
            body.render(ctx, pixelsPerMeter);
        }
    }

    toggleGravity() {
        this.gravityOn = !this.gravityOn;
    }
}
