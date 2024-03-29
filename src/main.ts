import { Body } from "./body";
import { Simulator } from "./simulator";

const PIXELS_PER_METER = 10;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const body = new Body({ x: 25, y: 10 }, { x: 10, y: 0 }, 1, 10);

const simulator = new Simulator([body], {
    x: { min: 0, max: canvas.width / PIXELS_PER_METER },
    y: { min: 0, max: canvas.height / PIXELS_PER_METER },
});

// simulator.toggleGravity();

let prevTime = performance.now();
function loop() {
    const currentTime = performance.now();
    const dt = (currentTime - prevTime) / 1000;
    prevTime = currentTime;

    simulator.step(dt);
    simulator.render(ctx);

    requestAnimationFrame(loop);
}

loop();
