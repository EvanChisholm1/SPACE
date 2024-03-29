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

export function scaleVec({ x, y }: Vec2d, scalar: number): Vec2d {
    return { x: x * scalar, y: y * scalar };
}

export function normalizeVec(vec: Vec2d): Vec2d {
    const magnitude = Math.sqrt(vec.x ** 2 + vec.y ** 2);
    return scaleVec(vec, 1 / magnitude);
}

export function subVecs(a: Vec2d, b: Vec2d): Vec2d {
    return addVecs(a, scaleVec(b, -1));
}
