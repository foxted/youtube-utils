interface WhisperResponse {
  text: string;
  segments: {
    id: number;
    start: number;
    end: number;
    text: string;
  }[];
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function convertToSRT(response: WhisperResponse): string {
  return response.segments
    .map((segment, index) => {
      const start = formatTime(segment.start);
      const end = formatTime(segment.end);
      return `${index + 1}\n${start} --> ${end}\n${segment.text.trim()}\n`;
    })
    .join("\n");
}

export async function transcribeAudio(
  audioPath: string,
  apiKey: string
): Promise<string> {
  const audioFile = await Deno.readFile(audioPath);

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([audioFile], { type: "audio/mpeg" }),
    "audio.mp3"
  );
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `OpenAI API error: ${error.error?.message || "Unknown error"}`
    );
  }

  const result = (await response.json()) as WhisperResponse;
  return convertToSRT(result);
}
