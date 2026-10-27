// Extracts scrub frames from the source video. Usage: node scripts/prepare-video-assets.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpeg = process.env.FFMPEG_PATH || require("ffmpeg-static");

const INPUT = "public/video/gemini_generated_video_93485268.mp4";
const FRAMES = "public/frames";

mkdirSync(`${FRAMES}/mobile`, { recursive: true });

const run = (args) => execFileSync(ffmpeg, ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

console.log("1/3 desktop frames 1280x720");
run(["-i", INPUT, "-vf", "fps=24,scale=1280:720:flags=lanczos", "-c:v", "libwebp", "-q:v", "82", "-compression_level", "6", `${FRAMES}/frame_%04d.webp`]);

console.log("2/3 mobile frames 960x540");
run(["-i", INPUT, "-vf", "fps=24,scale=960:540:flags=lanczos", "-c:v", "libwebp", "-q:v", "78", "-compression_level", "6", `${FRAMES}/mobile/frame_%04d.webp`]);

console.log("3/3 all-intra scrub mp4");
run(["-i", INPUT, "-vf", "scale=1280:720", "-movflags", "+faststart", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "main", "-crf", "20", "-g", "1", "-an", "public/video/pour-play-scrub.mp4"]);

const count = (d) => readdirSync(d).filter((f) => f.endsWith(".webp")).length;
console.log(`Done: ${count(FRAMES)} desktop, ${count(`${FRAMES}/mobile`)} mobile frames`);
