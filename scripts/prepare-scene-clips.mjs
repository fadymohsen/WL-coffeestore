// Cuts the source video into one short clip per scene. Usage: node scripts/prepare-scene-clips.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpeg = process.env.FFMPEG_PATH || require("ffmpeg-static");

const INPUT = "public/video/gemini_generated_video_93485268.mp4";
const OUT = "public/video/scenes";

// [name, first frame, last frame] at 24 fps, inclusive
const SCENES = [
  ["beans", 0, 52],
  ["grind", 53, 108],
  ["pour", 109, 177],
  ["finale", 178, 239], // wave, then the cup
];
const SIZES = [
  ["", 1280, 720, 22],
  ["-m", 960, 540, 26],
];

mkdirSync(OUT, { recursive: true });
for (const [name, a, b] of SCENES) {
  for (const [suffix, w, h, crf] of SIZES) {
    execFileSync(
      ffmpeg,
      [
        "-y", "-loglevel", "error", "-i", INPUT,
        "-vf", `trim=start_frame=${a}:end_frame=${b + 1},setpts=PTS-STARTPTS,scale=${w}:${h}:flags=lanczos`,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "main", "-crf", String(crf),
        "-g", "6", "-movflags", "+faststart", "-an",
        `${OUT}/${name}${suffix}.mp4`,
      ],
      { stdio: "inherit" }
    );
    console.log(`${name}${suffix}.mp4`);
  }
}
