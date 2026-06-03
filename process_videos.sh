#!/bin/bash
set -e

for i in {1..8}; do
  if [ -f "projects videos/$i.mp4" ]; then
    EXT="mp4"
  elif [ -f "projects videos/$i.mov" ]; then
    EXT="mov"
  else
    echo "Video $i not found, skipping."
    continue
  fi

  echo "Processing Project $i ($EXT)..."
  # Thumbnail (First frame)
  ffmpeg -y -i "projects videos/$i.$EXT" -vframes 1 -c:v libwebp -lossless 0 -q:v 90 "public/images/thumbnails/project-$i.webp"
  # Animation (Optimized 12 FPS Loop)
  ffmpeg -y -i "projects videos/$i.$EXT" -vf "scale=960:-1,fps=12" -c:v libwebp -lossless 0 -q:v 75 -t 4 -loop 0 "public/images/animations/project-$i.webp"
done

echo "Done video processing."
