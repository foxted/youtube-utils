import { ensureDir } from "std/fs/mod.ts";
import { join } from "std/path/mod.ts";
import { parse } from "std/flags/mod.ts";
import { Configuration, OpenAIApi } from "npm:openai@3.2.1";
import { parseSRT, formatSRT } from "./srt.ts";
import { getLanguage, listLanguages } from "../utils/languages.ts";

const usage = `
Translate SRT - A tool to translate SRT subtitles to a target language

USAGE:
    deno run --allow-read --allow-write --allow-run index.ts [OPTIONS] <input-file>

OPTIONS:
    -i, --input <file>     Input SRT file path
    -o, --output <file>    Output file path (default: input filename with .srt extension)
    -l, --lang <code>      Target language code (default: fr)
    -f, --formal           Use formal language
    --list-languages      List supported languages
    -h, --help            Show this help message

EXAMPLE:
    deno run --allow-read --allow-write --allow-run index.ts -o output.srt input.srt
`;

const openai = new OpenAIApi(
  new Configuration({
    apiKey: Deno.env.get("OPENAI_API_KEY"),
  })
);

async function translateSubtitles(
  subtitles: string[],
  targetLanguage: string,
  useInformal: boolean = true,
  extraPrompt?: string
): Promise<string[]> {
  const systemPrompt = useInformal
    ? `You are a translator who translates to casual, informal language. Maintain the same tone and style as the original text. ${extraPrompt}`
    : `You are a translator who translates to formal language. Maintain the same tone and style as the original text. ${extraPrompt}`;

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Translate the following subtitles to ${targetLanguage}. Keep the translations concise to fit subtitle length requirements:\n\n${subtitles.join(
          "\n"
        )}`,
      },
    ],
  });

  const translatedText = completion.data.choices[0].message?.content || "";
  return translatedText.split("\n").filter((line) => line.trim() !== "");
}

async function main() {
  const args = parse(Deno.args, {
    string: ["lang", "input", "output"],
    boolean: ["formal", "list-languages", "help"],
    default: {
      lang: "fr",
      formal: false,
    },
    alias: {
      i: "input",
      o: "output",
      l: "lang",
      f: "formal",
      h: "help",
    },
  });

  if (args.help) {
    console.log(usage);
    Deno.exit(0);
  }

  if (args["list-languages"]) {
    console.log("Supported languages:");
    console.log(listLanguages());
    Deno.exit(0);
  }

  const inputFile =
    args.input || (args._.length > 0 ? String(args._[0]) : null);
  if (!inputFile) {
    console.error("Error: Input file is required");
    console.error("Usage: deno task run [options] -i <input-file>");
    console.error("Use --help for more information");
    Deno.exit(1);
  }

  if (!Deno.env.get("OPENAI_API_KEY")) {
    console.error("Please set the OPENAI_API_KEY environment variable");
    Deno.exit(1);
  }

  const targetLang = getLanguage(args.lang);
  if (!targetLang) {
    console.error(`Unsupported language code: ${args.lang}`);
    console.error("Use --list-languages to see available languages");
    Deno.exit(1);
  }

  try {
    const inputContent = await Deno.readTextFile(inputFile);
    const subtitles = parseSRT(inputContent);

    console.log(`Translating subtitles to ${targetLang.name}...`);
    const translatedTexts = await translateSubtitles(
      subtitles.map((sub) => sub.text),
      targetLang.name,
      !args.formal,
      targetLang.extraPrompt
    );

    const translatedSubtitles = subtitles.map((sub, index) => ({
      ...sub,
      text: translatedTexts[index] || sub.text,
    }));

    const outputContent = formatSRT(translatedSubtitles);

    // Determine output path
    let outputPath: string;
    if (args.output) {
      // If output is specified, ensure its directory exists
      const outputDir = args.output.split("/").slice(0, -1).join("/");
      if (outputDir) {
        await ensureDir(outputDir);
      }
      outputPath = args.output;
    } else {
      // If no output specified, use input directory
      const inputDir = inputFile.split("/").slice(0, -1).join("/");
      const inputFileName =
        inputFile.split("/").pop()?.split(".")[0] || "subtitles";
      const outputFileName = `${inputFileName}_${args.lang}.srt`;
      outputPath = inputDir ? join(inputDir, outputFileName) : outputFileName;
    }

    await Deno.writeTextFile(outputPath, outputContent);
    console.log(`Translation complete! Output saved to: ${outputPath}`);
  } catch (error: any) {
    if (error.message) {
      console.error("An error occurred:", error.message);
    } else {
      console.error("An error occurred:", error);
    }
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
