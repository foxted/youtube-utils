interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

/**
 * Parses an SRT file content into an array of subtitle objects
 */
export function parseSRT(content: string): Subtitle[] {
  const blocks = content.trim().split(/\n\s*\n/);
  return blocks.map((block) => {
    const [id, timeCode, ...textLines] = block.trim().split("\n");
    const [startTime, endTime] = timeCode.split(" --> ");

    return {
      id: parseInt(id),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      text: textLines.join("\n").trim(),
    };
  });
}

/**
 * Formats an array of subtitle objects back into SRT format
 */
export function formatSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((sub) => {
      return [
        sub.id,
        `${sub.startTime} --> ${sub.endTime}`,
        sub.text,
        "", // Empty line between subtitles
      ].join("\n");
    })
    .join("\n");
}
