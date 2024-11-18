# Extract Audio

A Deno script to extract audio from video files using FFmpeg.

## Prerequisites

- [FFmpeg](https://ffmpeg.org/) installed and available in your system PATH

## Usage

```bash
extract-audio [OPTIONS] <input-file>
```

## Options

- `-i, --input <file>`: Input video file path (required, can also be a positional argument)
- `-o, --output <file>`: Output file path (default: input filename with .mp3 extension)
- `-f, --format <format>`: Output audio format (default: mp3)
- `-h, --help`: Show help message

## Input/Output

### Input

The script accepts input files from:

- The current working directory
- An `./inputs` directory
- The user's home directory
- A full absolute path

### Output

The script generates an audio file with the filename pattern: `{original_filename}.{format}`

### Examples

```bash
#Extract audio to MP3 (default)
extract-audio video.mp4
```

```bash
# Specify output file
extract-audio -o audio.mp3 video.mp4
```

```bash
# Extract to different format
extract-audio -f aac -o audio.aac video.mp4
```
