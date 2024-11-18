# SRT Translator

This script translates SRT subtitle files from English to another language using OpenAI's GPT-4 model. By default, it translates to casual French.

## Prerequisites

- OpenAI API key set in the environment variables

## Setup

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your_api_key_here
```

## Usage

```bash
translate-srt [OPTIONS] <input-file>
```

## Options

- `-i, --input <file>`: Input subtitles file path (required, can also be a positional positional argument)
- `-o, --output <file>`: Output file path (default: input filename with .mp3 extension)
- `-l, --lang`: Target language code (default: "fr")
- `-f, --formal`: Use formal language (default: false)
- `--list-languages`: Show available language options
- `-h, --help`: Show help message

## Input/Output

### Input

The script accepts SRT files in standard SubRip format.

### Output

The translated subtitles will be saved in the `outputs` directory with the naming format:
`{original_filename}_{target_language}.srt`

## Examples

```bash
# Translate to Japanese
translate-srt --lang=ja video.srt
```

This will create a file like `outputs/video_ja.srt` containing the Japanese translation of the subtitles.

## Supported Languages

- fr - French
- es - Spanish
- de - German
- it - Italian
- pt - Portuguese
- nl - Dutch
- pl - Polish
- ru - Russian
- ja - Japanese
- ko - Korean
- zh - Chinese

To see the list of supported languages, run:

```bash
deno task run --list-languages
```
