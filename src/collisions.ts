import { Body } from "./body";

export function findElasticCollisionVelocities(body1: Body, body2: Body) {
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

export function detectCircularCollision(body1: Body, body2: Body) {
    const distance = Math.sqrt(
        (body1.position.x - body2.position.x) ** 2 +
            (body1.position.y - body2.position.y) ** 2
    );

    return distance < body1.radius + body2.radius;
}

export function findPOI1dStaticLinear(
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

export interface WallCollisionOptions {
    wallDirection: "vert" | "horiz";
    x?: number;
    y?: number;
}

export function wallCollisionResolution(
    body: Body,
    options: WallCollisionOptions
) {
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

export function findPOIBodies(body1: Body, body2: Body): number {
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
