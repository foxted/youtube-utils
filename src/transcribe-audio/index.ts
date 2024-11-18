import { transcribeAudio } from "./transcribe-audio.ts";
import { resolve, dirname, fromFileUrl } from "std/path/mod.ts";
import { ensureDir } from "std/fs/ensure_dir.ts";
import { parse } from "std/flags/mod.ts";

const usage = `
Transcribe Audio - A tool to transcribe audio files

USAGE:
    deno run --allow-read --allow-write --allow-run index.ts [OPTIONS] <input-file>

OPTIONS:
    -i, --input <file>     Input audio file path
    -o, --output <file>    Output file path (default: input filename with .srt extension)
    -h, --help            Show this help message

EXAMPLE:
    deno run --allow-read --allow-write --allow-run index.ts -o output.srt input.mp4
`;

async function main() {
  const args = parse(Deno.args, {
    string: ["input", "output"],
    boolean: ["help"],
    alias: {
      i: "input",
      o: "output",
      h: "help",
    },
  });

  if (args.help) {
    console.log(usage);
    Deno.exit(0);
  }

  const inputFile =
    args.input || (args._.length > 0 ? String(args._[0]) : null);
  const outputDir = args.output;

  if (!inputFile) {
    console.error("Please provide an input file path as an argument");
    console.error("Usage: transcribe-audio <input-file> [output-directory]");
    Deno.exit(1);
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    console.error("Please set the OPENAI_API_KEY environment variable");
    Deno.exit(1);
  }

  const inputPath = resolve(inputFile);
  // Use provided output directory or default to project root outputs
  const projectRoot = resolve(
    dirname(fromFileUrl(import.meta.url)),
    "..",
    ".."
  );
  const outputsDir = outputDir
    ? resolve(outputDir)
    : resolve(projectRoot, "outputs");

  // Ensure outputs directory exists
  await ensureDir(outputsDir);

  try {
    const transcript = await transcribeAudio(inputPath, apiKey);
    const outputPath = resolve(
      outputsDir,
      `${Deno.realPathSync(inputPath)
        .split("/")
        .pop()
        ?.replace(".mp3", "")}.srt`
    );

    await Deno.writeTextFile(outputPath, transcript);
    console.log(`Subtitles saved to: ${outputPath}`);
  } catch (error: any) {
    if (error.message) {
      console.error("Error during transcription:", error.message);
    } else {
      console.error("Error during transcription:", error);
    }
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
