export const G = 6.674 * 10 ** -11;

export function universalGravitation(
    m1: number,
    m2: number,
    r: number
): number {
    return (G * m1 * m2) / r ** 2;
}

export const Fg = (mass: number) => {
    return mass * 9.8;
};
