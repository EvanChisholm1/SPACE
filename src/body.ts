import { Vec2d, addVecs, scaleVec, subVecs } from "./vec";
import { universalGravitation } from "./gravity";

interface BodyOptions {
    position: Vec2d;
    velocity: Vec2d;
    mass: number;
    radius: number;
    generateGravity?: boolean;
    color?: string;
}

export class Body {
    position: Vec2d;
    prevPosition: Vec2d;
    velocity: Vec2d;
    acceleration: Vec2d;
    mass: number = 1;
    radius: number = 1;
    generateGravity: boolean = false;
    _prevDt: number = 0;
    color: string;

    constructor(options: BodyOptions) {
        const defaultOptions = { generateGravity: false, color: "white" };

        const { position, velocity, mass, radius, generateGravity, color } = {
            ...defaultOptions,
            ...options,
        };

        this.position = position;
        this.velocity = velocity;
        this.acceleration = { x: 0, y: 0 };
        this.mass = mass;
        this.radius = radius;
        this.generateGravity = generateGravity;
        this.color = color;
        this.prevPosition = { x: position.x, y: position.y };
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
        this.prevPosition = { x: this.position.x, y: this.position.y };
        this.position = addVecs(this.position, scaleVec(this.velocity, dt));
        this._prevDt = dt;
    }

    updateVelocity(dt: number) {
        this.velocity = addVecs(this.velocity, scaleVec(this.acceleration, dt));
    }

    update(dt: number) {
        this.updateVelocity(dt);
        this.updatePosition(dt);
        this.resetAcceleration();
        this._prevDt = dt;
    }

    findGeneratedGravity(otherBody: Body): Vec2d {
        const deltaPos = subVecs(otherBody.position, this.position);
        const radius = Math.sqrt(deltaPos.x ** 2 + deltaPos.y ** 2);

        const force = universalGravitation(this.mass, otherBody.mass, radius);
        const theta = Math.atan2(deltaPos.y, deltaPos.x);

        const gravity: Vec2d = {
            x: Math.cos(theta) * force,
            y: Math.sin(theta) * force,
        };

        return gravity;
    }

    render(ctx: CanvasRenderingContext2D, pixelsPerMeter: number) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            this.position.x * pixelsPerMeter,
            this.position.y * pixelsPerMeter,
            this.radius * pixelsPerMeter,
            0,
            2 * Math.PI
        );
        ctx.closePath();
        ctx.fill();
    }
}

interface StaticBodyOptions {
    position: Vec2d;
    mass: number;
    radius: number;
    generateGravity?: boolean;
}

export class StaticBody extends Body {
    generateGravity: boolean = false;
    constructor(options: StaticBodyOptions) {
        const superOptions = { velocity: { x: 0, y: 0 }, ...options };
        super(superOptions);
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

interface WallOptions {
    tail: Vec2d;
    tip: Vec2d;
    mass: number;
    generateGravity?: boolean;
    width: number;
    color?: string;
}

export class Line extends Body {
    tail: Vec2d;
    tip: Vec2d;
    width: number;
    constructor(options: WallOptions) {
        const superOptions = {
            color: "white",
            ...options,
            radius: options.width / 2,
            velocity: { x: 0, y: 0 },
            position: {
                x: (options.tip.x + options.tail.x) / 2,
                y: (options.tip.y + options.tail.y) / 2,
            },
        };
        super(superOptions);

        this.tail = options.tail;
        this.tip = options.tip;
        this.width = options.width;
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

    render(ctx: CanvasRenderingContext2D, pixelsPerMeter: number) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.lineWidth = this.width;
        ctx.moveTo(this.tip.x * pixelsPerMeter, this.tip.y * pixelsPerMeter);
        ctx.lineTo(this.tail.x * pixelsPerMeter, this.tail.y * pixelsPerMeter);
        ctx.stroke();
        ctx.closePath();
    }
}
