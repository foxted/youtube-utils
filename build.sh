#!/bin/sh

# Set default values if environment variables are not set
PLATFORM=${PLATFORM:-$(uname -s | tr '[:upper:]' '[:lower:]')}
ARCH=${ARCH:-$(uname -m)}

# Map common architecture names
case "$ARCH" in
    x86_64|amd64) ARCH="x86_64" ;;
    aarch64|arm64) ARCH="aarch64" ;;
esac

echo "Building for platform: $PLATFORM, architecture: $ARCH"

echo 'Building extract-audio' && \
(cd src/extract-audio && DENO_PLATFORM=$PLATFORM DENO_ARCH=$ARCH deno task build) && \
echo 'Done'

echo 'Building transcribe-audio' && \
(cd src/transcribe-audio && DENO_PLATFORM=$PLATFORM DENO_ARCH=$ARCH deno task build) && \
echo 'Done'

echo 'Building translate-srt' && \
(cd src/translate-srt && DENO_PLATFORM=$PLATFORM DENO_ARCH=$ARCH deno task build) && \
echo 'Done'

