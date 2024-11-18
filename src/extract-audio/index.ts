import { parse } from "std/flags/mod.ts";
import { extractAudio } from "./extract-audio.ts";

const usage = `
Extract Audio - A tool to extract audio from video files

USAGE:
    deno run --allow-read --allow-write --allow-run index.ts [OPTIONS] <input-file>

OPTIONS:
    -i, --input <file>     Input video file path
    -o, --output <file>    Output file path (default: input filename with .mp3 extension)
    -f, --format <format>  Output audio format (default: mp3)
    -h, --help            Show this help message

EXAMPLE:
    deno run --allow-read --allow-write --allow-run index.ts -o output.mp3 input.mp4
`;

async function main() {
  const args = parse(Deno.args, {
    string: ["input", "output", "format"],
    alias: {
      i: "input",
      o: "output",
      f: "format",
      h: "help",
    },
  });

  if (args.help || args._.length === 0) {
    console.log(usage);
    Deno.exit(0);
  }

  const inputFile =
    args.input || (args._.length > 0 ? String(args._[0]) : null);
  let outputFile = args.output;
  const format = args.format || "mp3";

  if (!inputFile) {
    console.error("Please provide an input file path as an argument");
    console.error("Usage: extract-audio <input-file> [output-file]");
    Deno.exit(1);
  }

  if (!outputFile) {
    // Generate output filename based on input filename
    outputFile = inputFile.replace(/\.[^/.]+$/, "") + "." + format;
  }

  try {
    await extractAudio(inputFile, outputFile, format);
    console.log(`Successfully extracted audio to: ${outputFile}`);
  } catch (error: any) {
    if (error.message) {
      console.error("Error:", error.message);
    } else {
      console.error("Error:", error);
    }
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
