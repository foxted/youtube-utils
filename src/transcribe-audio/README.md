# Audio Transcription Script

This script uses OpenAI's Whisper API to transcribe MP3 audio files into SRT subtitle files.

## Prerequisites

- OpenAI API key (set as environment variable)

## Setup

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your_api_key_here
```

## Usage

```bash
transcribe-audio [OPTIONS] <input-file>
```

## Options

- `-i, --input <file>`: Input audio file path (required, can also be a positional positional argument)
- `-o, --output <file>`: Output subtitle file path (default: input filename with .mp3 extension)
- `-h, --help`: Show help message

## Input/Output

### Input

The script accepts input files from:

- The current working directory
- An `./inputs` directory
- The user's home directory
- A full absolute path

### Output

The script generates an SRT (SubRip Subtitle) file with the filename pattern: `{original_filename}.srt`

The SRT format includes:

- Subtitle number
- Timestamp (start --> end)
- Subtitle text
- Blank line between entries

Example output:

```
1
00:00:00,000 --> 00:00:03,400
Hello, welcome to this video.

2
00:00:03,400 --> 00:00:07,200
Today we're going to talk about...
```

## Examples

```bash
# Transcribe video.mov
transcribe-audio video.mov
```
