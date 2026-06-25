export class MultimediaContent {
  constructor(src) {
    this.src = src;
  }
}

export class Video extends MultimediaContent {
  get isVideo() { return true; }
}

export class YoutubeVideo extends MultimediaContent {
  get isYoutube() { return true; }
}

export class Image extends MultimediaContent {
  get isImage() { return true; }
}

export class Audio extends MultimediaContent {
  get isAudio() { return true; }
}

// Factory
export function createMultimedia(src) {
  if (!src) return null;
  if (src.match(/youtube\.com|youtu\.be/i)) return new YoutubeVideo(src);
  if (src.match(/\.(mp3|wav|flac|aac)$/i)) return new Audio(src);
  if (src.match(/\.(mp4|webm|ogg)$/i)) return new Video(src);
  if (src.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return new Image(src);
  return new MultimediaContent(src); // fallback
}
