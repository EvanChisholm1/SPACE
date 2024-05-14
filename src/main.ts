import { Body, Line, StaticBody } from "./body";
import { Simulator } from "./simulator";

// const PIXELS_PER_METER = 1 / 1e8;

const frameCounterElement = document.querySelector("#frame_counter")!;
const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// const WIDTH_IN_METERS = 1e8;
// const PIXELS_PER_METER = canvas.width / WIDTH_IN_METERS;
// console.log(PIXELS_PER_METER, 50e2);

const WIDTH_IN_METERS = 5e8;
const PIXELS_PER_METER = canvas.width / WIDTH_IN_METERS;
console.log(PIXELS_PER_METER, 50e2);

// const WIDTH_IN_METERS = 100;
// const PIXELS_PER_METER = canvas.width / WIDTH_IN_METERS;
// console.log(PIXELS_PER_METER, 50e2);

// console.log(canvas.width / PIXELS_PER_METER);

function threeBodyProblem() {
    const M = 6e31;
    const bodies = [
        new Body({
            position: { x: 50e6, y: 50e6 },
            velocity: { x: 10, y: -7e6 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "green",
        }),
        new Body({
            position: { x: 50e6, y: 100e6 },
            velocity: { x: -10e6, y: -7 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "red",
        }),
        new Body({
            position: { x: 100e6, y: 50e6 },
            velocity: { x: 10, y: 10e6 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "blue",
        }),
    ];

    return new Simulator(bodies, {
        x: { min: 0, max: canvas.width / PIXELS_PER_METER },
        y: { min: 0, max: canvas.height / PIXELS_PER_METER },
    });
}

function nBodyProblem() {
    const M = 6e31;
    const bodies = [
        new Body({
            position: { x: 50e6, y: 50e6 },
            velocity: { x: 10, y: -7e6 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "green",
        }),
        new Body({
            position: { x: 50e6, y: 100e6 },
            velocity: { x: -10e6, y: -7 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "red",
        }),
        new Body({
            position: { x: 100e6, y: 50e6 },
            velocity: { x: 10, y: 10e6 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "blue",
        }),
        new Body({
            position: { x: 100e6, y: 100e6 },
            velocity: { x: -10e5, y: 10e6 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "pink",
        }),
        new Body({
            position: { x: 20e6, y: 100e6 },
            velocity: { x: -10e5, y: 10e6 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "orange",
        }),
        new Body({
            position: { x: 20e6, y: 10e6 },
            velocity: { x: -10e5, y: 10e6 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "yellow",
        }),
    ];

    for (let i = 0; i < 2; i++) {
        bodies.push(
            new Body({
                position: { x: Math.random() * 5e8, y: Math.random() * 5e8 },
                velocity: { x: Math.random() * 10e5, y: Math.random() * 10e5 },
                mass: M,
                radius: 3e6,
                generateGravity: true,
                color: "white",
            })
        );
    }

    return new Simulator(bodies, {
        x: { min: 0, max: canvas.width / PIXELS_PER_METER },
        y: { min: 0, max: canvas.height / PIXELS_PER_METER },
    });
}

// const simulator = threeBodyProblem();
const simulator = nBodyProblem();

function spawn() {
    const M = 6e31;

    simulator.bodies.push(
        new Body({
            position: { x: Math.random() * 5e8, y: Math.random() * 5e8 },
            velocity: { x: Math.random() * 10e5, y: Math.random() * 10e5 },
            mass: M,
            radius: 3e6,
            generateGravity: true,
            color: "purple",
        })
    );
    console.log(simulator.bodies.length);
}

function orbit() {
    const bodies = [
        // earth
        new StaticBody({
            position: { x: WIDTH_IN_METERS / 2, y: WIDTH_IN_METERS / 2 },
            mass: 6e29,
            radius: 6e6,
            generateGravity: true,
        }),
        // moon
        new Body({
            position: { x: WIDTH_IN_METERS / 2, y: WIDTH_IN_METERS / 2 - 10e7 },
            velocity: { x: 5e5, y: 0 },
            mass: 5e22,
            radius: 6e6,
            generateGravity: false,
        }),
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

// const simulator = orbit();
// const simulator = threeBodyProblem();

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

function linearCollision() {
    const bodies = [
        new Body({
            position: { x: 50, y: 10 },
            velocity: { x: 0, y: 10 },
            mass: 1,
            radius: 3,
        }),
        new Body({
            position: { x: 90, y: 50 },
            velocity: { x: -10, y: 0 },
            mass: 1,
            radius: 3,
        }),
    ];

    return new Simulator(
        bodies,
        {
            x: { min: 0, max: canvas.width / PIXELS_PER_METER },
            y: { min: 0, max: canvas.height / PIXELS_PER_METER },
        },
        false
    );
}

// const simulator = linearCollision();

function manyBouncyBalls() {
    const bodies = [];
    for (let i = 0; i < 250; i++) {
        bodies.push(
            new Body({
                position: { x: Math.random() * 100, y: Math.random() * 100 },
                velocity: { x: Math.random() * 10, y: Math.random() * 10 },
                mass: Math.random() * 10,
                radius: 0.5,
            })
        );
    }

    return new Simulator(bodies, {
        x: { min: 0, max: canvas.width / PIXELS_PER_METER },
        y: { min: 0, max: canvas.height / PIXELS_PER_METER },
    });
}

// const simulator = manyBouncyBalls();

function wallCollision() {
    const bodies = [
        new Body({
            position: { x: 50, y: 50 },
            velocity: { x: -20, y: -10 },
            mass: 1,
            radius: 3,
        }),
    ];

    return new Simulator(
        bodies,
        {
            x: { min: 0, max: canvas.width / PIXELS_PER_METER },
            y: { min: 0, max: canvas.height / PIXELS_PER_METER },
        },
        false
    );
}

// const simulator = wallCollision();

function conservationOfEnergy() {
    const bodies: Body[] = [
        new Body({
            position: { x: 10, y: 50 },
            velocity: { x: 10, y: 0 },
            mass: 200,
            radius: 3,
        }),
        new Body({
            position: { x: 50, y: 50 },
            velocity: { x: 0, y: 0 },
            mass: 1,
            radius: 3,
        }),
    ];

    return new Simulator(
        bodies,
        {
            x: { min: 0, max: canvas.width / PIXELS_PER_METER },
            y: { min: 0, max: canvas.height / PIXELS_PER_METER },
        },
        false
    );
}

// const simulator = conservationOfEnergy();

function walls() {
    const bodies = [
        new Line({
            mass: 1,
            tail: { x: 0, y: 0 },
            tip: { x: 10, y: 10 },
            color: "red",
            width: 2,
        }),
        new Line({
            mass: 1,
            tail: { x: 10, y: 80 },
            tip: { x: 90, y: 80 },
            color: "blue",
            width: 9,
        }),
    ];

    return new Simulator(
        bodies,
        {
            x: { min: 0, max: canvas.width / PIXELS_PER_METER },
            y: { min: 0, max: canvas.height / PIXELS_PER_METER },
        },
        false
    );
}

// const simulator = walls();

const spawnButton = document.querySelector("#spawn");

spawnButton?.addEventListener("click", spawn);

function kineticEnergy(body: Body) {
    const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
    return (1 / 2) * (body.mass * speed ** 2);
}

function findTotalKinetic() {
    return simulator.bodies.reduce((acc, body) => acc + kineticEnergy(body), 0);
}

let prevTime = performance.now();
let frameCount = 0;
function loop() {
    const currentTime = performance.now();
    const dt = (currentTime - prevTime) / 1000;
    const FPS = 1 / dt;
    if (frameCount === 0) frameCounterElement.textContent = FPS.toFixed(4);
    prevTime = currentTime;

    frameCount = (frameCount + 1) % 60;

    simulator.step(dt);
    simulator.render(ctx, PIXELS_PER_METER);

    console.log(findTotalKinetic());
    requestAnimationFrame(loop);
}

loop();
