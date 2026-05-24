export class MultimediaContent {
  constructor(src) {
    this.src = src;
  }
}

export class Video extends MultimediaContent {
  get isVideo() { return true; }
}

export class Image extends MultimediaContent {
  get isImage() { return true; }
}

// Factory
export function createMultimedia(src) {
  if (!src) return null;
  if (src.match(/\.(mp4|webm|ogg)$/i)) return new Video(src);
  if (src.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return new Image(src);
  return new MultimediaContent(src); // fallback
}
