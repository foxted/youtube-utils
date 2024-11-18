export interface Language {
  code: string;
  name: string;
  voice: string;
  extraPrompt?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "fr", name: "French", voice: "alloy" },
  { code: "es", name: "Spanish", voice: "alloy" },
  { code: "de", name: "German", voice: "alloy" },
  { code: "it", name: "Italian", voice: "alloy" },
  { code: "pt", name: "Portuguese", voice: "alloy" },
  { code: "nl", name: "Dutch", voice: "alloy" },
  { code: "pl", name: "Polish", voice: "alloy" },
  { code: "ru", name: "Russian", voice: "alloy" },
  { code: "ja", name: "Japanese", voice: "alloy" },
  { code: "ko", name: "Korean", voice: "alloy" },
  { code: "zh", name: "Chinese", voice: "alloy" },
  { code: "fa", name: "Persian (Farsi)", voice: "alloy" },
];

export function getLanguage(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

export function listLanguages(): string {
  return SUPPORTED_LANGUAGES.map((lang) => `${lang.code} - ${lang.name}`).join(
    "\n"
  );
}
