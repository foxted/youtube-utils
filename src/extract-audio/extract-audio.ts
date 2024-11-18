/**
 * Extracts audio from a video file using FFmpeg
 * @param inputFile Path to the input video file
 * @param outputFile Path to the output audio file
 * @param format Output audio format (default: mp3)
 */
export async function extractAudio(
  inputFile: string,
  outputFile: string,
  format: string = "mp3"
): Promise<void> {
  // Check if FFmpeg is installed
  try {
    const ffmpegVersion = new Deno.Command("ffmpeg", { args: ["-version"] });
    const { success } = await ffmpegVersion.output();
    if (!success) {
      throw new Error("FFmpeg check failed");
    }
  } catch (error) {
    throw new Error(
      "FFmpeg is not installed. Please install FFmpeg to use this script."
    );
  }

  // Check if input file exists
  try {
    await Deno.stat(inputFile);
  } catch {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  // Extract audio using FFmpeg
  const ffmpeg = new Deno.Command("ffmpeg", {
    args: [
      "-i",
      inputFile,
      "-vn", // Disable video
      "-acodec",
      format === "mp3" ? "libmp3lame" : format,
      "-y", // Overwrite output file if it exists
      outputFile,
    ],
  });

  const { success, stderr } = await ffmpeg.output();

  if (!success) {
    throw new Error(
      `Failed to extract audio: ${new TextDecoder().decode(stderr)}`
    );
  }
}
