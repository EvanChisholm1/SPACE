export type Vec2d = {
    x: number;
    y: number;
};

export function getAvgVec(vecs: Vec2d[]): Vec2d {
    const sum = vecs.reduce(
        (acc, vec) => ({ x: acc.x + vec.x, y: acc.y + vec.y }),
        {
            x: 0,
            y: 0,
        }
    );

    return {
        x: sum.x / vecs.length,
        y: sum.y / vecs.length,
    };
}

export function addVecs(a: Vec2d, b: Vec2d): Vec2d {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

export function scaleVec(vec: Vec2d, scalar: number): Vec2d {
    return { x: vec.x * scalar, y: vec.y * scalar };
}

export function normalizeVec(vec: Vec2d): Vec2d {
    const magnitude = Math.sqrt(vec.x ** 2 + vec.y ** 2);
    return scaleVec(vec, 1 / magnitude);
}

export function unit(vec: Vec2d): Vec2d {
    return normalizeVec(vec);
}

export function subVecs(a: Vec2d, b: Vec2d): Vec2d {
    return addVecs(a, scaleVec(b, -1));
}

export function norm(vec: Vec2d): Vec2d {
    return { x: vec.y, y: -vec.x };
}

export function dot(u: Vec2d, v: Vec2d): number {
    return u.x * v.x + u.y * v.y;
}

export function reflect(d: Vec2d, n: Vec2d): Vec2d {
    console.log("D", d);
    console.log("n", n);
    return subVecs(d, scaleVec(n, 2 * dot(d, n)));
}
