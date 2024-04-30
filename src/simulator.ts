import { Body } from "./body";

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

    step(dt: number) {
        const substeps = 5;
        dt *= this.timeMultiplier;
        dt = dt / substeps;

        const gravityGenerators = this.bodies.filter(
            (body) => body.generateGravity
        );

        for (let i = 0; i < substeps; i++) {
            for (const body of this.bodies) {
                if (this.gravityOn) body.applyForce({ x: 0, y: Fg(body.mass) });
                for (const generator of gravityGenerators) {
                    if (generator === body) continue;
                    const gravity = body.findGeneratedGravity(generator);
                    body.applyForce(gravity);
                }

                for (const otherBody of this.bodies) {
                    if (otherBody === body) continue;
                    if (detectCircularCollision(body, otherBody)) {
                        const { vf1, vf2 } = findElasticCollisionVelocities(
                            body,
                            otherBody
                        );

                        body.velocity = vf1;
                        otherBody.velocity = vf2;
                    }
                }
                body.update(dt);
            }

            this.checkBoundaries();
        }
    }

    // TODO: implement continuous collision detection
    // this is a simple collision detection that just bounces the body off the wall
    // assumes no energy loss
    checkBoundaries() {
        for (const body of this.bodies) {
            if (body.position.x - body.radius < this.boundaries.x.min) {
                const prevPos =
                    body.position.x - body.velocity.x * body._prevDt;
                const timeToCollision = findPOI1dStaticLinear(
                    body.velocity.x,
                    prevPos,
                    body.radius,
                    this.boundaries.x.min
                );

                console.log(timeToCollision, body._prevDt);

                const beforeCollision =
                    prevPos + body.velocity.x * timeToCollision;
                const afterCollision =
                    beforeCollision -
                    body.velocity.x * (body._prevDt - timeToCollision);

                // body.position.x = this.boundaries.x.min + body.radius;
                body.position.x = afterCollision;
                body.velocity.x = -body.velocity.x;
            }

            if (body.position.x + body.radius > this.boundaries.x.max) {
                body.position.x = this.boundaries.x.max - body.radius;
                body.velocity.x = -body.velocity.x;
            }

            if (body.position.y - body.radius < this.boundaries.y.min) {
                body.position.y = this.boundaries.y.min + body.radius;
                body.velocity.y = -body.velocity.y;
            }

            if (body.position.y + body.radius > this.boundaries.y.max) {
                body.position.y = this.boundaries.y.max - body.radius;
                body.velocity.y = -body.velocity.y;
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
