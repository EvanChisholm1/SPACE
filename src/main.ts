import { Body, StaticBody } from "./body";
import { Simulator } from "./simulator";

const PIXELS_PER_METER = 5;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const body = new Body({ x: 70, y: 70 }, { x: 0, y: 0 }, 1, 10);
const staticB = new StaticBody({ x: 20, y: 20 }, 1e14, 10, true);
const staticC = new StaticBody({ x: 120, y: 120 }, 1e14, 10, true);

const simulator = new Simulator([body, staticB, staticC], {
    x: { min: 0, max: canvas.width / PIXELS_PER_METER },
    y: { min: 0, max: canvas.height / PIXELS_PER_METER },
});

simulator.toggleGravity();

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
