import { Body, StaticBody } from "./body";
import { Simulator } from "./simulator";

// const PIXELS_PER_METER = 1 / 1e8;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const WIDTH_IN_METERS = 1e9;
const PIXELS_PER_METER = canvas.width / WIDTH_IN_METERS;
console.log(PIXELS_PER_METER, 50e2);

// console.log(canvas.width / PIXELS_PER_METER);

// function threeBodyProblem() {
//     const M = 5e32;
//     const bodies = [
//         new Body({ x: 50e6, y: 50e6 }, { x: 10, y: -7e5 }, M, 6e6, true),
//         new Body({ x: 50e6, y: 100e6 }, { x: 10e5, y: -7 }, M, 6e6, true),
//         new Body({ x: 100e6, y: 50e6 }, { x: 10, y: 7e6 }, M, 6e6, true),
//     ];

//     return new Simulator(bodies, {
//         x: { min: 0, max: canvas.width / PIXELS_PER_METER },
//         y: { min: 0, max: canvas.height / PIXELS_PER_METER },
//     });
// }

// const simulator = threeBodyProblem();

function orbit() {
    const bodies = [
        // earth
        new StaticBody(
            { x: WIDTH_IN_METERS / 2, y: WIDTH_IN_METERS / 2 },
            // { x: 0, y: 0 },
            6e29,
            6e6,
            true
        ),
        // moon
        new Body(
            { x: WIDTH_IN_METERS / 2, y: WIDTH_IN_METERS / 2 - 10e7 },
            { x: 5e5, y: 0 },
            5e22,
            6e6,
            false
        ),
    ];
    const simulator = new Simulator(
        bodies,
        {
            x: { min: 0, max: canvas.width / PIXELS_PER_METER },
            y: { min: 0, max: canvas.height / PIXELS_PER_METER },
        },
        false,
        100
    );
    return simulator;
}

const simulator = orbit();

// const body = new Body({ x: 70, y: 70 }, { x: 0, y: 0 }, 1, 10);
// const staticB = new StaticBody({ x: 20, y: 20 }, 1e14, 10, true);
// const staticC = new StaticBody({ x: 120, y: 120 }, 1e14, 10, true);

// const simulator = new Simulator([body, staticB, staticC], {
//     x: { min: 0, max: canvas.width / PIXELS_PER_METER },
//     y: { min: 0, max: canvas.height / PIXELS_PER_METER },
// });

// const bodies = [
//     new Body({ x: 10, y: 10 }, { x: 10, y: -7 }, 1e14, 3, true),
//     new Body({ x: 50, y: 50 }, { x: -5, y: 50 }, 1e14, 3, true),
//     new Body({ x: 70, y: 30 }, { x: 3, y: -2 }, 1e14, 3, true),
// ];

// const simulator = new Simulator(bodies, {
//     x: { min: 0, max: canvas.width / PIXELS_PER_METER },
//     y: { min: 0, max: canvas.height / PIXELS_PER_METER },
// });

// simulator.toggleGravity();

let prevTime = performance.now();
function loop() {
    const currentTime = performance.now();
    const dt = (currentTime - prevTime) / 1000;
    prevTime = currentTime;

    simulator.step(dt);
    simulator.render(ctx, PIXELS_PER_METER);

    requestAnimationFrame(loop);
}

loop();
