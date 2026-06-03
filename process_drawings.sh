#!/bin/bash
set -e

echo "Processing Drawings..."
ffmpeg -y -i "drawings and art/drawing 1.jpeg" -c:v libwebp -lossless 0 -q:v 75 "public/images/drawings/drawing-1.webp"
ffmpeg -y -i "drawings and art/drawing 2.jpeg" -c:v libwebp -lossless 0 -q:v 75 "public/images/drawings/drawing-2.webp"
ffmpeg -y -i "drawings and art/drawing 3.jpeg" -c:v libwebp -lossless 0 -q:v 75 "public/images/drawings/drawing-3.webp"

echo "Done drawings processing."
