import { Body } from "./body";

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

    constructor(bodies: Body[], boundaries: bound, gravityOn: boolean = true) {
        this.bodies = bodies;
        this.boundaries = boundaries;
        this.gravityOn = gravityOn;
    }

    step(dt: number) {
        for (const body of this.bodies) {
            this.gravityOn && body.applyForce({ x: 0, y: Fg(body.mass) });
            body.update(dt);
        }

        this.checkBoundaries();
    }

    // TODO: implement continuous collision detection
    // this is a simple collision detection that just bounces the body off the wall
    // assumes no energy loss
    checkBoundaries() {
        for (const body of this.bodies) {
            if (body.position.x - body.radius < this.boundaries.x.min) {
                body.position.x = this.boundaries.x.min + body.radius;
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
