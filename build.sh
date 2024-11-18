#!/bin/sh

echo 'Building extract-audio' && \
(cd src/extract-audio && deno task build) && \
echo 'Done'

echo 'Building transcribe-audio' && \
(cd src/transcribe-audio && deno task build) && \
echo 'Done'

echo 'Building translate-srt' && \
(cd src/translate-srt && deno task build) && \
echo 'Done'
